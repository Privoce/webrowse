import { io } from "socket.io-client";
import Workspace, { TabEvent } from './lib/main';
import { sendMessageToContentScript, onMessageFromPopup, sendMessageToPopup, onMessageFromContentScript, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../common';
import { getActiveTab, debounce } from './utils'
const SOCKET_SERVER_URL = 'wss://stage.vera.nicegoodthings.com';
// const SOCKET_SERVER_URL = 'wss://vera.nicegoodthings.com';
// const SOCKET_SERVER_URL = 'http://localhost:4000';
const DEFAULT_LANDING_PAGE = 'https://nicegoodthings.com/landing/vera';
const DATA_HUB = {};
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
    DATA_HUB.user = tmp;
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log({ changes, area });
    if (area == 'sync') {
      const { user } = changes;
      if (user) {
        let { newValue = null } = user || {};
        DATA_HUB.user = newValue;
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
    socket.send({ cmd: EVENTS.TAB_EVENT, payload: { data: wsUpdateCopy } });
  });
});
// 初始化workspace
const initWorkspace = ({ roomId = "", winId = "", urls = [], tabId = undefined }) => {
  console.log('init workspace', { urls, tabId });
  chrome.windows.create({ url: urls, tabId }, (window) => {
    const windowId = window.id;
    const currWorkspace = new Workspace(windowId, true);
    // 初始化datahub
    DATA_HUB[windowId] = { socket: null, workspace: currWorkspace, roomId, winId, roomName: "", floaterTabVisible: { tab: false, follow: true, audio: false }, tabs: [], createTabs: [], users: [], userId: "" }
    currWorkspace.addEventHandler(async ({ event, rawParams }) => {
      // 捕捉并处理对应的tab事件
      let currSocket = null;
      let currLink = '';
      let needSyncTabsList = false;
      console.log('workspace trigger tab event', { event, rawParams });
      switch (event) {
        case TabEvent.onActivated:
        case TabEvent.onHighlighted:
          {
            let wid = null;
            if (event == TabEvent.onActivated) {
              wid = rawParams.activeInfo.windowId;
            } else {
              wid = rawParams.highlightInfo.windowId;
            }
            let activeTab = await getActiveTab();
            if (activeTab.url && !activeTab.url.startsWith('chrome')) {
              currSocket = DATA_HUB[wid].socket;
              currLink = activeTab.url;
              console.log('tab active/highlight event', activeTab, currSocket);
            }
          }
          break;
        case TabEvent.onCreated: {
          // 给新建的tab做标记
          const { tab } = rawParams;
          DATA_HUB[windowId].createTabs.push(tab.id);
        }
          break;
        case TabEvent.onUpdated: {
          needSyncTabsList = true;
          const { changeInfo, tab } = rawParams;
          const { windowId, active, url } = tab;
          // const { windowId, active,url,title} = tab;
          // 条件：活跃，非空页，正在加载，(host 或者 属于新建tab)
          // youtube的判断条件： active && url && !url.startsWith('chrome') && url.indexOf(title)>-1 && pageLoadingStatus == "loading"
          const { status: pageLoadingStatus } = changeInfo;
          const currUser = DATA_HUB[windowId].users.find(u => u.id == DATA_HUB[windowId].userId)
          const shouldSync = currUser?.host || DATA_HUB[windowId].createTabs.includes(tab.id);
          console.log("tab update sync flag", { active, pageLoadingStatus, shouldSync, changeInfo, tab });
          if (active && url && !url.startsWith('chrome') && pageLoadingStatus == "complete" && shouldSync) {
            console.log(`page load status: ${status} `, changeInfo, tab);
            // 拿到socket
            currSocket = DATA_HUB[windowId].socket;
            currLink = url;
            // 从创建tab id 集合中移除
            DATA_HUB[windowId].createTabs = DATA_HUB[windowId].createTabs.filter(tid => tid !== tab.id)
          }
        }
          break;
        case TabEvent.onRemoved: {
          needSyncTabsList = true;
          const { removeInfo: { windowId, isWindowClosing } } = rawParams;
          // 关闭window引起的
          if (isWindowClosing) {
            DATA_HUB[windowId].socket?.disconnect();
            return
          };
          currSocket = DATA_HUB[windowId].socket;
        }
          break;
        case TabEvent.onMoved: {
          needSyncTabsList = true;
          // to do: workspace api lib bug
          const { moveInfo: { windowId } } = rawParams;
          console.log('tab moved', windowId);
          currSocket = DATA_HUB[windowId].socket;
        }
          break;
      }
      if (needSyncTabsList) {
        // 发送原始tab list 信息
        let rawTabs = await currWorkspace.readRaw();
        console.log({ rawTabs });
        const filteredTabs = rawTabs.tabs.map(t => {
          const { url, favIconUrl, title, active } = t;
          return {
            url, favIconUrl, title, active
          }
        });
        currSocket?.send({
          cmd: "RAW_TABS", payload: {
            tabs: filteredTabs
          }
        });
      }
      if (currSocket) {
        console.log("socket not null");
        sendTabSyncMsg(currWorkspace, currSocket);
      }
      // 每次有变动 应该执行的事件
      notifyActiveTab({ windowId, action: EVENTS.CHECK_CONNECTION });
      notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER });
      notifyActiveTab({ windowId, action: EVENTS.GET_INVITE_LINK, payload: { landing: currLink } });
    });
    notifyActiveTab({ windowId, action: EVENTS.CHECK_CONNECTION });
  })
}
// update tabs
const notifyActiveTab = ({ windowId = 0, action = EVENTS.UPDATE_TABS, payload = {} }) => {
  chrome.tabs.query({ active: true, windowId }, ([tab]) => {
    console.log('active tab', { tab });
    if (!tab) return;
    switch (action) {
      case EVENTS.CHECK_CONNECTION: {
        let connected = !!DATA_HUB[tab.windowId]?.workspace;
        sendMessageToContentScript(tab?.id, connected, MessageLocation.Background, EVENTS.CHECK_CONNECTION)
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
          const { floaterTabVisible, tabs: floaterTabs, users, userId, roomName } = DATA_HUB[windowId];
          sendMessageToContentScript(tab?.id, { floaterTabVisible, tabs: floaterTabs, users, userId, roomName }, MessageLocation.Background, EVENTS.UPDATE_FLOATER)
        });
      }
        break;
      case EVENTS.GET_INVITE_LINK: {
        let { landing } = payload;
        landing = landing ? landing : tab.url;
        let rid = DATA_HUB[tab.windowId].roomId;
        let inviteLink = rid ? `https://nicegoodthings.com/transfer/wb/${rid}/${encodeURIComponent(landing)}?extid=${chrome.runtime.id
          }` : ''
        console.log("get link event", rid, landing);
        sendMessageToContentScript(tab?.id, inviteLink, MessageLocation.Background, EVENTS.GET_INVITE_LINK)
      }
        break;
    }
  })
}
// 监听来自popup的触发事件
onMessageFromPopup(MessageLocation.Background, {
  [EVENTS.LOGOUT]: () => {
    delete DATA_HUB?.user;
    chrome.storage.sync.remove(['user']);
  },
  [EVENTS.POP_UP_DATA]: () => {
    console.log("popup event");
    const { user, ...windows } = DATA_HUB;
    let filteredWindows = [];
    if (windows) {
      let keeps = ['roomId', "roomName", 'tabs', 'userId', 'users'];
      Object.entries(windows).forEach(([, obj]) => {
        let tmp = {};
        Object.keys(obj).forEach(k => {
          if (keeps.includes(k) && typeof obj[k] !== "undefined") {
            tmp[k] = obj[k];
          }
        });
        filteredWindows.push(tmp)
      })
    }
    sendMessageToPopup({ user, windows: filteredWindows }, MessageLocation.Background, EVENTS.POP_UP_DATA)
  },
  [EVENTS.NEW_WINDOW]: ({ currentTab }) => {
    let roomId = `${Math.random().toString(36).substring(7)}_temp`;
    const { user } = DATA_HUB;
    if (user && user.id) {
      roomId = user.id;
    }
    if (currentTab) {
      chrome.windows.getCurrent({ populate: true }, ({ tabs }) => {
        let urls = tabs.map(({ url }) => url);
        console.log({ urls });
        initWorkspace({ roomId, urls })
      })
    } else {
      initWorkspace({ roomId, urls: [DEFAULT_LANDING_PAGE] })
    }
  }
})
// 监听来自content script 的触发事件
onMessageFromContentScript(MessageLocation.Background, {
  // new window
  [EVENTS.NEW_WINDOW]: (request = {}, sender) => {
    console.log('new window', request);
    const { urls = null, rid, wid, src = 'CO_BROWSE' } = request;
    const { id: tabId } = sender.tab;
    switch (src) {
      case 'CO_BROWSE':
        {
          console.log({ rid });
          // 从co-browse 点过来的  种下bg room id 告诉vera的加载不新开窗口
          // chrome.storage.sync.set({ room_id: rid });
          initWorkspace({ roomId: rid, winId: wid, urls: [DEFAULT_LANDING_PAGE, ...urls] });
        }
        break;
      case 'INVITE_LINK':
        {
          // 从widget & invite url 过来的
          initWorkspace({ tabId, roomId: rid, winId: wid })
        }
        break;
    }
  },
  // socket 初始化
  [EVENTS.ROOM_SOCKET_INIT]: (request = {}, sender) => {
    const { roomId, winId, temp, peerId = '', user } = request;
    const { id: tabId, url, windowId } = sender.tab;
    // 如果已初始化，则不必再次初始化
    if (DATA_HUB[windowId].socket) return;
    console.log('init websocket', user);
    const newSocket = io(SOCKET_SERVER_URL, {
      jsonp: false,
      transports: ['websocket'],
      reconnectionAttempts: 8,
      upgrade: false,
      query: { roomId, winId, link: url, temp, peerId, ...user }
    });
    console.log('init websocket', { roomId, winId, temp, peerId, user });
    DATA_HUB[windowId].socket = newSocket;
    // 当前room的socket实例
    const { socket } = DATA_HUB[windowId];
    const currTabId = tabId;

    socket.on('connect', () => {
      console.log('ws room io connect', socket.id);
      // 全局维护window 与 peerid,roomId 的映射
      DATA_HUB[windowId].userId = socket.id;
    });
    socket.on('message', (wtf) => {
      console.log('io message', wtf);
    });
    // 房间当前有哪些人 服务器端来判断是否是host
    socket.on(EVENTS.CURRENT_USERS, ({ room = {}, workspaceData = null, users, update = false }) => {
      // 更新到全局变量
      DATA_HUB[windowId].users = users;
      const computedRoomName = room?.name || DATA_HUB[windowId]?.roomName || (room?.temp ? 'Temporary Room' : '') || room?.id == DATA_HUB.user?.id ? 'Personal Room' : '';
      sendMessageToTab(currTabId, { roomName: computedRoomName, users, update }, EVENTS.CURRENT_USERS);
      // 首次
      if (!update) {
        // 如果有workspace数据 则全量更新一次
        if (workspaceData) {
          console.log("update current workspace", workspaceData);
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
        DATA_HUB[windowId].roomName = computedRoomName;
        notifyActiveTab({ windowId, action: EVENTS.UPDATE_FLOATER })
      }
    });
    // tab事件：CRUD
    socket.on(EVENTS.TAB_EVENT, async (tab) => {
      // tab更新
      const currentUser = DATA_HUB[windowId].users.find(u => u.id == socket.id);
      const { data: tabsData, fromHost = false } = tab;
      const curWS = DATA_HUB[windowId].workspace;
      console.log('tab event received', { tab, currentUser, curWS });
      let filter = [TabEvent.onCreated, TabEvent.onMoved, TabEvent.onRemoved];
      if (currentUser?.follow) {
        filter.push(TabEvent.onActivated)
      }
      if (fromHost) {
        filter.push(TabEvent.onUpdated)
      }
      await curWS?.write(tabsData, { filter })
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
    // 出错则重连
    socket.on('connect_error', () => {
      console.log('io socket connect error');
      setTimeout(() => {
        socket.connect();
      }, 1000);
    });
  },
  // send socket msg
  [EVENTS.SOCKET_MSG]: (request, sender) => {
    const { data = null } = request;
    const { windowId } = sender.tab;
    if (data) {
      let currSocket = DATA_HUB[windowId].socket;
      currSocket.send(data);
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
  [EVENTS.DISCONNECT_SOCKET]: (request, sender) => {
    const { windowId } = sender.tab;
    if (DATA_HUB[windowId].socket) {
      DATA_HUB[windowId].socket.disconnect();
      delete DATA_HUB[windowId];
    }
  },
  [EVENTS.CHECK_CONNECTION]: (request, sender) => {
    const { windowId } = sender.tab;
    notifyActiveTab({ windowId, action: EVENTS.CHECK_CONNECTION })
  },
  [EVENTS.GET_INVITE_LINK]: (request, sender) => {
    const { windowId } = sender.tab;
    notifyActiveTab({ windowId, action: EVENTS.GET_INVITE_LINK, payload: { landing: sender.tab.url } })
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
  [EVENTS.LOAD_VERA]: (request, sender) => {
    const { windowId } = sender.tab;
    chrome.tabs.query({ index: 0, currentWindow: true }, ([tab]) => {
      console.log("first tab", tab);
      chrome.tabs.update(tab.id, { active: true }, () => {
        notifyActiveTab({ windowId, action: EVENTS.LOAD_VERA })
      })
    })
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
  }
})
// 关闭窗口
chrome.windows.onRemoved.addListener((windowId) => {
  console.log('close event: window close', windowId);
  const currWorkspace = DATA_HUB[windowId]?.workspace || null;
  if (!currWorkspace) return;
  currWorkspace.destroy();
  const currSocket = DATA_HUB[windowId]?.socket || null;
  if (currSocket) {
    currSocket.disconnect();
  }
  delete DATA_HUB[windowId]
})
