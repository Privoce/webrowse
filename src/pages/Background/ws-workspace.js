/* eslint-disable max-lines */
import { io } from "socket.io-client";
// import Workspace, { ITabEvent as TabEvent } from 'workspace-api-for-chrome'
import Workspace, { TabEvent } from './lib/main';
import { sendMessageToContentScript, onMessageFromPopup, sendMessageToPopup, onMessageFromContentScript, MessageLocation } from '@wbet/message-api'
import { EVENTS, SOCKET_SERVER_DOMAIN, DEFAULT_LANDING } from '../../common';
import { getActiveTab, debounce } from './utils';
const protocolPrefix = SOCKET_SERVER_DOMAIN.indexOf('localhost') > -1 ? 'http://' : 'wss://';
const SOCKET_SERVER_URL = `${protocolPrefix}${SOCKET_SERVER_DOMAIN}`;
const DATA_HUB = { windowTitles: {}, loginUser: null };
const Tabs = {};
const InvitedWindows = {};
const inactiveWindows = [];
const tabOperations = []
// 安装扩展触发的事件
chrome.runtime.onInstalled.addListener(function (details) {
  const { reason } = details;
  console.log("install reason", reason);
  switch (reason) {
    case 'install': {
      // 初始化未激活的window list
      chrome.windows.getAll((windows) => {
        let winIds = windows.map(w => {
          return w.id
        });
        inactiveWindows.push(...winIds)
      })
      chrome.tabs.query({ url: "*://*/transfer/wb/*" }, function (tabs) {
        console.log('query invite tabs', tabs);
        if (!tabs || tabs.length === 0) {
          chrome.tabs.create(
            {
              active: true,
              url: 'https://webrow.se/guiding/'
            }
          );
        } else {
          for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            if (i == 0) {
              chrome.tabs.executeScript(tab.id, {
                file: 'catchInviteId.bundle.js'
              }, () => {
                console.log('catch script executed');
                chrome.tabs.update(tab.id, { active: true });
              });
            } else {
              chrome.tabs.remove(tab.id);
            }
          }
        }
      });
    }
      break;
  }
});
// init user info
chrome.storage.sync.get(['user'], (res) => {
  console.log('local user data', res.user);
  const { user = null } = res;
  if (user) {
    // 只保留需要的字段
    let keeps = ["id", "username", "photo", "token"];
    let tmp = {};
    Object.keys(user).forEach(k => {
      if (keeps.includes(k) && typeof user[k] !== "undefined") {
        tmp[k] = user[k];
      }
    });
    DATA_HUB.loginUser = tmp;
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log({ changes, area });
    if (area == 'sync') {
      const { user } = changes;
      if (user) {
        let { newValue = null } = user || {};
        DATA_HUB.loginUser = newValue;
      }
    }
  });
});
// 向特定tab发消息
const sendMessageToTab = (tid = null, params, actionType = '') => {
  if (tid) {
    sendMessageToContentScript(tid, params, MessageLocation.Background, actionType);
  }
}
// 向websocket发tab sync消息 with debounce
const sendTabSyncMsg = debounce((ws, socket) => {
  console.log("start sync tab info", ws, socket);
  if (!socket) return;
  ws.read().then(wsUpdateCopy => {
    console.log({ wsUpdateCopy });
    socket.send({ cmd: EVENTS.WORKSPACE, payload: { workspace: wsUpdateCopy } });
  });
}, 500);
const getNewWindow = (params) => {
  return new Promise((resolve) => {
    chrome.windows.create(params, (w) => {
      resolve(w);
    })
  });
}
// 初始化workspace
const initWorkspace = async ({ invited = false, windowId = null, roomId = "", winId = "", urls = [], tabId = undefined }) => {
  console.log('init workspace', { windowId, urls, tabId });
  let finalWindowId = windowId;
  if (!finalWindowId) {
    const newWindow = await getNewWindow({ url: urls, tabId });
    finalWindowId = newWindow.id;
  }
  // 标识该window是不是通过邀请链接初始化的
  InvitedWindows[finalWindowId] = invited;
  const currWorkspace = new Workspace(finalWindowId, true);
  // 初始化datahub
  DATA_HUB[finalWindowId] = { socket: null, workspace: currWorkspace, roomId, winId, title: "", floaterTabVisible: { tab: true, follow: false, audio: false }, tabs: [], createTabs: [], users: [], socketId: "" }
  currWorkspace.addEventHandler(async ({ event, rawParams }) => {
    const currUser = DATA_HUB[finalWindowId].users.find(u => u.id == DATA_HUB[finalWindowId].socketId)
    // 捕捉并处理对应的tab事件
    let currSocket = null;
    let needSyncTabsList = true;
    console.log('workspace trigger tab event', { event, rawParams });
    switch (event) {
      case TabEvent.onActivated:
        // case TabEvent.onHighlighted:
        {
          needSyncTabsList = false;
          let wid = null;
          if (event == TabEvent.onActivated) {
            wid = rawParams.activeInfo.windowId;
          } else {
            wid = rawParams.highlightInfo.windowId;
          }
          let activeTab = await getActiveTab();
          if (activeTab.url && !activeTab.url.startsWith('chrome')) {
            currSocket = DATA_HUB[wid].socket;
            console.log('tab active/highlight event', activeTab, currSocket);
          }
        }
        break;
      case TabEvent.onCreated: {
        needSyncTabsList = false;
        // 给新建的tab做标记
        const { tab: { id, windowId } } = rawParams;
        DATA_HUB[windowId].createTabs.push(id);
      }
        break;
      case TabEvent.onUpdated: {
        const { changeInfo, tab } = rawParams;
        const { windowId, active, url, title } = tab;
        // 备份到全局变量 Tabs
        Tabs[tab.id] = { title, url };
        // const { windowId, active,url,title} = tab;
        // 条件：活跃，非空页，正在加载，(host 或者 属于新建tab)
        // youtube的判断条件： active && url && !url.startsWith('chrome') && url.indexOf(title)>-1 && pageLoadingStatus == "loading"
        const { status: pageLoadingStatus } = changeInfo;
        const isCreated = DATA_HUB[windowId].createTabs.includes(tab.id);
        const shouldSync = currUser?.host || isCreated;
        console.log("tab update sync flag", { active, pageLoadingStatus, shouldSync, changeInfo, tab });
        if (active && url && !url.startsWith('chrome') && pageLoadingStatus == "complete" && shouldSync) {
          console.log(`page load status: ${pageLoadingStatus} `, changeInfo, tab);
          // 拿到socket
          currSocket = DATA_HUB[windowId].socket;
          if (isCreated) {
            currSocket.send({
              cmd: EVENTS.TAB_EVENT, payload: {
                type: "create", tab: { title, url }
              }
            })
          }
          // 从创建tab id 集合中移除
          DATA_HUB[windowId].createTabs = DATA_HUB[windowId].createTabs.filter(tid => tid !== tab.id)
        }
      }
        break;
      case TabEvent.onRemoved: {
        const { tabId, removeInfo: { windowId, isWindowClosing } } = rawParams;
        // 关闭window引起的
        if (isWindowClosing) {
          DATA_HUB[windowId].socket?.disconnect();
          return
        };
        currSocket = DATA_HUB[windowId].socket;
        console.log("tab removed", tabId, Tabs);
        currSocket.send({
          cmd: EVENTS.TAB_EVENT, payload: {
            type: "remove", tab: Tabs[tabId]
          }
        })
        delete Tabs[tabId];
      }
        break;
      case TabEvent.onMoved: {
        // to do: workspace api lib bug
        const { moveInfo: { windowId } } = rawParams;
        console.log('tab moved', windowId);
        currSocket = DATA_HUB[windowId].socket;
      }
        break;
    }
    if (needSyncTabsList) {
      // 发送原始tab list 信息
      let { tabs } = await currWorkspace.readRaw();
      tabs = tabs.map(t => {
        const { url, favIconUrl, title, active } = t;
        return {
          url, favIconUrl, title, active
        }
      });
      currSocket?.send({
        cmd: "RAW_TABS", payload: {
          tabs
        }
      });
    }
    if (currSocket) {
      console.log("socket not null");
      sendTabSyncMsg(currWorkspace, currSocket);
    }
    // 每次有变动 应该执行的事件
    notifyActiveTab({ finalWindowId, action: EVENTS.UPDATE_FLOATER });
    notifyActiveTab({ finalWindowId, action: EVENTS.CHECK_CONNECTION });
  });
  notifyActiveTab({ finalWindowId, action: EVENTS.CHECK_CONNECTION });
}
// update tabs
const notifyActiveTab = ({ windowId = 0, action = EVENTS.UPDATE_TABS, payload = {} }) => {
  chrome.tabs.query({ active: true, windowId }, ([tab]) => {
    console.log('notify active tab', { tab, action });
    if (!tab) return;
    switch (action) {
      case EVENTS.CHECK_CONNECTION: {
        let connected = !!DATA_HUB[tab.windowId]?.workspace;
        sendMessageToContentScript(tab?.id, connected, MessageLocation.Background, EVENTS.CHECK_CONNECTION)
      }
        break;
      case EVENTS.TAB_EVENT: {
        console.log("send msg to active tab", tab, payload);
        sendMessageToContentScript(tab?.id, { ...payload }, MessageLocation.Background, EVENTS.TAB_EVENT)
      }
        break;
      case EVENTS.UPDATE_USERS: {
        sendMessageToContentScript(tab?.id, { users: DATA_HUB[windowId].users }, MessageLocation.Background, EVENTS.UPDATE_USERS)
      }
        break;
      case EVENTS.LOAD_VERA: {
        sendMessageToContentScript(tab?.id, {}, MessageLocation.Background, EVENTS.LOAD_VERA)
      }
        break;
      case EVENTS.UPDATE_FLOATER: {
        console.log("current DATA_HUB data", DATA_HUB[windowId]);
        chrome.tabs.query({ windowId }, (tabs) => {
          DATA_HUB[windowId].tabs = tabs;
          const { floaterTabVisible, tabs: floaterTabs, users, socketId, title } = DATA_HUB[windowId];
          sendMessageToContentScript(tab?.id, { floaterTabVisible, tabs: floaterTabs, users, userId: socketId, title }, MessageLocation.Background, EVENTS.UPDATE_FLOATER)
        });
      }
        break;
    }
  })
}
// 监听来自popup的触发事件
onMessageFromPopup(MessageLocation.Background, {
  [EVENTS.LOGOUT]: () => {
    delete DATA_HUB?.loginUser;
    chrome.storage.sync.remove(['user', 'fakename']);
  },
  [EVENTS.POP_UP_DATA]: () => {
    console.log("popup event");
    const { loginUser, windowTitles, ...windows } = DATA_HUB;
    let filteredWindows = [];
    if (windows) {
      let keeps = ['roomId', 'winId', "title", 'tabs', 'socketId', 'users'];
      Object.entries(windows).forEach(([windowId, obj]) => {
        let tmp = { windowId };
        Object.keys(obj).forEach(k => {
          if (keeps.includes(k) && typeof obj[k] !== "undefined") {
            tmp[k] = obj[k];
          }
        });
        filteredWindows.push(tmp)
      })
    }
    sendMessageToPopup({ user: loginUser, windows: filteredWindows }, MessageLocation.Background, EVENTS.POP_UP_DATA)
    sendMessageToPopup({ titles: windowTitles }, MessageLocation.Background, EVENTS.WINDOW_TITLES)
  },
  [EVENTS.UPDATE_WIN_TITLE]: (request) => {
    const { title = "", windowId } = request;
    console.log("update window title from popup", request, DATA_HUB);
    if (!title || !windowId) return;
    if (!DATA_HUB[windowId]) {
      DATA_HUB.windowTitles[windowId] = title
    } else {
      DATA_HUB[windowId]?.socket.send(
        { cmd: EVENTS.UPDATE_WIN_TITLE, payload: { title } }
      )
    }
  },
  [EVENTS.NEW_WINDOW]: ({ currentWindow = false, roomId = "", winId = "", urls = [] }) => {
    const { loginUser } = DATA_HUB;
    let isOpenedWindow = winId !== '' && Number.isInteger(Number(winId))
    let finalRoomId = roomId || loginUser?.id || `${Math.random().toString(36).substring(7)}_temp`;
    let finalWinId = isOpenedWindow ? `${Math.random().toString(36).substring(7)}_temp` : (winId || `${Math.random().toString(36).substring(7)}_temp`);
    console.log({ currentWindow, finalRoomId, finalWinId, urls, isOpenedWindow });
    if (currentWindow) {
      // 不新开窗口的逻辑
      chrome.tabs.create({ url: DEFAULT_LANDING, active: true }, ({ windowId }) => {
        initWorkspace({ windowId, roomId: finalRoomId, winId: finalWinId });
        // 如果是未激活的window 则刷新其它tab
        // eslint-disable-next-line no-undef
        if (inactiveWindows.includes(windowId)) {
          chrome.tabs.query({ active: false, currentWindow: true }, (tabs = []) => {
            tabs.forEach(tab => {
              chrome.tabs.reload(tab.id)
            })
          })
        }
      })
    } else {
      if (isOpenedWindow) {
        // 已有窗口
        chrome.windows.update(Number(winId), { focused: true }, ({ id }) => {
          initWorkspace({ windowId: id, roomId: finalRoomId, winId: finalWinId });
          chrome.tabs.create({ url: DEFAULT_LANDING, active: true }, () => {
            console.log("create new page");
          })
        })
      } else {
        initWorkspace({ roomId: finalRoomId, winId: finalWinId, urls: urls.length == 0 ? [DEFAULT_LANDING] : urls })
      }
    }
  }
})
// 监听来自content script 的触发事件
onMessageFromContentScript(MessageLocation.Background, {
  // new window
  [EVENTS.NEW_WINDOW]: (request = {}, sender) => {
    console.log('new window', request);
    let { urls = [], rid, wid = "", src = 'CO_BROWSE' } = request;
    // 不存在wid 则初始化一个临时id
    if (!wid) {
      wid = `${Math.random().toString(36).substring(7)}_temp`;
    }
    const { id: tabId } = sender.tab;
    switch (src) {
      case 'CO_BROWSE':
        {
          console.log({ rid });
          // 从co-browse 点过来的  种下bg room id 告诉vera的加载不新开窗口
          // chrome.storage.sync.set({ room_id: rid });
          const initUrls = urls ? (urls.length == 0 ? [DEFAULT_LANDING] : urls) : [DEFAULT_LANDING]
          initWorkspace({ roomId: rid, winId: wid, urls: initUrls });
        }
        break;
      case 'INVITE_LINK':
        {
          // 从widget & invite url 过来的
          initWorkspace({ invited: true, tabId, roomId: rid, winId: wid })
        }
        break;
    }
  },
  // socket 初始化
  [EVENTS.ROOM_SOCKET_INIT]: (request = {}, sender) => {
    const { roomId, winId, temp, user } = request;
    const { id: tabId, windowId } = sender.tab;
    // 如果已初始化，则不必再次初始化
    if (DATA_HUB[windowId]?.socket) return;
    const newSocket = io(SOCKET_SERVER_URL, {
      jsonp: false,
      transports: ['websocket'],
      reconnectionAttempts: 8,
      upgrade: false,
      query: { type: 'WEBROWSE', roomId, winId, temp, title: DATA_HUB.windowTitles[windowId] || "", invited: InvitedWindows[windowId], ...user }
    });
    console.log('invited', InvitedWindows[windowId]);
    console.log('init websocket', { roomId, winId, temp, user });
    DATA_HUB[windowId].socket = newSocket;
    // 当前room的socket实例
    const { socket } = DATA_HUB[windowId];
    const currTabId = tabId;

    socket.on('connect', () => {
      console.log('ws room io connect', socket.id);
      // 去掉本地title
      delete DATA_HUB.windowTitles[windowId];
      // 全局维护window 与 peerid,roomId 的映射
      DATA_HUB[windowId].socketId = socket.id;
      sendMessageToContentScript(tabId, true, MessageLocation.Background, EVENTS.CHECK_CONNECTION)
    });
    socket.on('message', (wtf) => {
      console.log('io message', wtf);
    });
    // 房间当前有哪些人 服务器端来判断是否是host
    socket.on(EVENTS.CURRENT_USERS, ({ room = {}, title = "", workspaceData = null, users, update = false }) => {
      // 更新到全局变量
      DATA_HUB[windowId].users = users;
      console.log("current users", room, workspaceData, update);
      sendMessageToTab(currTabId, { title, users, update }, EVENTS.CURRENT_USERS);
      // 首次
      if (!update) {
        // 如果有workspace数据 则全量更新一次
        if (workspaceData && workspaceData.tabs?.length) {
          console.log("update current workspace", workspaceData);
          // 首次删掉 activeTabIndex
          delete workspaceData?.activeTabIndex;
          DATA_HUB[windowId].workspace?.write(workspaceData);
        }
        // 立即开始监听房间新加入人员事件
        socket.on(EVENTS.USER_ENTER, (user) => {
          console.log('io enter event', user);
          if (user.id === socket.id) return;
          sendMessageToTab(currTabId, { user }, EVENTS.USER_ENTER)
        });
        socket.on(EVENTS.USER_JOIN_MEETING, (user) => {
          console.log('io join event', user);
          if (user.id === socket.id) return;
          sendMessageToTab(currTabId, { user }, EVENTS.USER_JOIN_MEETING)
        });
        // 更新floater
        DATA_HUB[windowId].title = title;
        notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER })
      }
    });
    // TAB EVENT
    socket.on(EVENTS.TAB_EVENT, (operation) => {
      const { username, type, tab } = operation;
      console.log("tab operation event", username, type, tab);
      if (type == 'remove') {
        // remove tab 特殊处理下
        tabOperations.push({ username, type, tab })
      } else {
        notifyActiveTab({ windowId, action: EVENTS.TAB_EVENT, payload: { username, type, tab } })
      }
    });
    // workspace 事件
    socket.on(EVENTS.WORKSPACE, async (workspace) => {
      // workspace更新
      const currentUser = DATA_HUB[windowId].users.find(u => u.id == socket.id);
      const { data: wsData, fromHost = false } = workspace;
      const curWS = DATA_HUB[windowId].workspace;
      let filter = [TabEvent.onCreated, TabEvent.onMoved, TabEvent.onRemoved];
      // 没有开启follow mode 则忽略active index的更新
      if (currentUser?.follow) {
        filter.push(TabEvent.onActivated)
      }
      if (fromHost) {
        filter.push(TabEvent.onUpdated)
      }
      await curWS?.write(wsData, { filter })
    });
    // 更新user列表
    socket.on(EVENTS.UPDATE_USERS, async ({ users }) => {
      console.log('update users', { users, socket });
      // 更新到全局变量
      DATA_HUB[windowId].users = users;
      notifyActiveTab({ windowId, action: EVENTS.UPDATE_USERS });
      notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER });
    });
    // 离开房间事件
    socket.on(EVENTS.USER_LEAVE, (user) => {
      console.log('io leave user', user);
      sendMessageToTab(currTabId, { user }, EVENTS.USER_LEAVE)
    });
    // window title更新
    socket.on(EVENTS.UPDATE_WIN_TITLE, ({ title }) => {
      console.log('update window title', title);
      DATA_HUB[windowId].title = title;
      DATA_HUB.windowTitles[windowId] = title;
      // 发送给popup
      sendMessageToPopup({ titles: DATA_HUB.windowTitles }, MessageLocation.Background, EVENTS.WINDOW_TITLES)
      notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER });
    });
    // 服务器端触发，主动断掉
    socket.on("disconnect", () => {
      console.log("disconnect from server");
      // 销毁该销毁的
      DATA_HUB[windowId]?.workspace.destroy();
      delete DATA_HUB[windowId];
      notifyActiveTab({ windowId, action: EVENTS.CHECK_CONNECTION })
    })
    // 出错则重连
    let retryCount = 0;
    socket.on('connect_error', () => {
      console.log('io socket connect error');
      setTimeout(() => {
        if (retryCount >= 3) {
          // 超过十次重连，毁灭吧，赶紧的。
          if (DATA_HUB[windowId]) {
            DATA_HUB[windowId].workspace.destroy();
            delete DATA_HUB[windowId];
            notifyActiveTab({ windowId, action: EVENTS.CHECK_CONNECTION })
          }
          return
        };
        socket.connect();
        retryCount++;
      }, 2000);
    });
  },
  // send socket msg
  [EVENTS.SOCKET_MSG]: (request, sender) => {
    const { data = null } = request;
    const { windowId } = sender.tab;
    if (data) {
      const { cmd, payload } = data;
      switch (cmd) {
        case 'BE_HOST': {
          let { socket, workspace } = DATA_HUB[windowId];
          if (payload.enable) {
            workspace.read().then(ws => {
              payload.workspace = ws;
              socket.send(data);
            });
          } else {
            socket.send(data);
          }
        }
          break;
        default: {
          let currSocket = DATA_HUB[windowId].socket;
          currSocket.send(data);
        }
          break;
      }
    }
  },
  // 发送room & window id
  [EVENTS.ROOM_WINDOW]: (request, sender) => {
    // if (!DATA_HUB[windowId]) return;
    const { id, windowId } = sender.tab;
    const { roomId, winId } = DATA_HUB[windowId] || {};
    console.log("background ids", roomId, winId, id);
    sendMessageToTab(id, { roomId, winId }, EVENTS.ROOM_WINDOW)
  },
  // socket 断开
  [EVENTS.DISCONNECT_SOCKET]: async (request = {}, sender) => {
    const { keepTabs = false, endAll = false } = request;
    console.log("disconnect args", { keepTabs, endAll });
    const { windowId } = sender.tab;
    if (keepTabs) {
      let { tabs } = await DATA_HUB[windowId].workspace.readRaw();
      tabs = tabs.map(t => {
        const { url, favIconUrl, title } = t;
        return {
          url, icon: favIconUrl, title,
        }
      });
      console.log({ tabs });
      DATA_HUB[windowId].socket.send({ cmd: "KEEP_TABS", payload: { tabs } })
    }
    // 关闭所有socket连接，包括自己
    if (endAll) {
      DATA_HUB[windowId].socket.send({ cmd: "END_ALL" });
      return;
    }
    if (DATA_HUB[windowId].socket) {
      DATA_HUB[windowId]?.workspace.destroy();
      DATA_HUB[windowId].socket.disconnect();
      delete DATA_HUB[windowId];
    }
  },
  [EVENTS.CHECK_CONNECTION]: (request, sender) => {
    const { id, windowId } = sender.tab;
    let connected = !!DATA_HUB[windowId]?.workspace;
    sendMessageToTab(id, connected, EVENTS.CHECK_CONNECTION)
  },
  [EVENTS.GET_INVITE_LINK]: (request, sender) => {
    const { id, windowId } = sender.tab;
    const { roomId, winId } = DATA_HUB[windowId] || {};
    let inviteLink = roomId ? `https://nicegoodthings.com/transfer/wb/${roomId}?wid=${winId}&extid=${chrome.runtime.id
      }` : ''
    sendMessageToTab(id, inviteLink, EVENTS.GET_INVITE_LINK)
  },
  [EVENTS.UPDATE_TABS]: (request, sender) => {
    const { windowId } = sender.tab;
    chrome.tabs.query({ windowId }, (tabs) => {
      DATA_HUB[windowId].tabs = tabs;
      notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER });
    });
  },
  [EVENTS.UPDATE_USERS]: (request, sender) => {
    const { windowId } = sender.tab;
    notifyActiveTab({ windowId, action: EVENTS.UPDATE_USERS })
  },
  [EVENTS.CHANGE_FLOATER_TAB]: (request, sender) => {
    const { tab = "", visible = true } = request;
    const { windowId } = sender.tab;
    const datahub = DATA_HUB[windowId];
    if (!datahub) return;
    let tmp = { tab: false, audio: false, follow: false };
    tmp[tab] = visible;
    DATA_HUB[windowId].floaterTabVisible = tmp;
    notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER })
  },
  [EVENTS.UPDATE_WIN_TITLE]: (request, sender) => {
    const { title = "" } = request;
    if (!title) return;
    const { windowId } = sender.tab;
    const currSocket = DATA_HUB[windowId].socket;
    currSocket.send(
      { cmd: EVENTS.UPDATE_WIN_TITLE, payload: { title } }
    )
  }
})
// 关闭窗口
chrome.windows.onRemoved.addListener(async (windowId) => {
  console.log('close event: window close', windowId);
  const currWorkspace = DATA_HUB[windowId]?.workspace || null;
  if (!currWorkspace) return;
  const currSocket = DATA_HUB[windowId]?.socket || null;
  if (currSocket) {
    currSocket.disconnect();
  }
  currWorkspace.destroy();
  delete DATA_HUB[windowId]
});
// tab标签关闭的处理事件
chrome.tabs.onRemoved.addListener((tabId, { windowId, isWindowClosing }) => {
  const currWorkspace = DATA_HUB[windowId]?.workspace || null;
  console.log('tab remove event', windowId, tabOperations, !currWorkspace);
  if (!currWorkspace || isWindowClosing || tabOperations.length == 0) return;
  notifyActiveTab({ windowId, action: EVENTS.TAB_EVENT, payload: tabOperations.pop() })
})
