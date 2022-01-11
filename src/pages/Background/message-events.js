import { onMessageFromContentScript, onMessageAnywhere, sendMessageToPopup, onMessageFromPopup, MessageLocation, sendMessageToContentScript, onMessageFromOptions } from '@wbet/message-api';
import { EVENTS } from '../../config';
const openLoginTab = () => {
  chrome.tabs.create(
    {
      active: true,
      url: `Login/index.html`
    },
    null
  );
}
const copyToClipboard = (txt) => {
  const input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = txt;
  input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}
// 监听来自content script 的触发事件
onMessageFromContentScript(MessageLocation.Background, {
  [EVENTS.COPY_SOMETHING]: (request) => {
    const { content = '' } = request;
    copyToClipboard(content);
  },
  [EVENTS.NEW_ACTIVE_WINDOW]: (request) => {
    const { url = 'login' } = request;
    chrome.windows.create({ url })
  },
  [EVENTS.JUMP_TAB]: (request) => {
    console.log('jump tab', request);
    const { tabId, following = false } = request;
    if (!tabId) return;
    chrome.tabs.get(+tabId, tab => {
      if (!tab || tab.active) return;
      chrome.tabs.update(+tabId, { active: true }, () => {
        if (following) {
          sendMessageToContentScript(tabId, null, MessageLocation.Background, EVENTS.FOLLOW_MODE_TIP)
        }
      });
    })
  },
  [EVENTS.LOGIN]: (request = {}, sender) => {
    const { scene = 'login' } = request;
    chrome.tabs.create(
      {
        openerTabId: sender.tab.id,
        active: true,
        url: `Login/index.html?tid=${sender.tab.id}&scene=${scene}`
      },
      null
    );
  },
  // get current tab info
  [EVENTS.CURRENT_TAB]: (request, sender) => {
    console.log('get current tab info', sender.tab);
    return sender.tab;
  },
});
onMessageFromPopup(MessageLocation.Background, {
  [EVENTS.COPY_SOMETHING]: (request) => {
    const { content = '' } = request;
    copyToClipboard(content);
  },
  [EVENTS.NEW_ACTIVE_WINDOW]: (request) => {
    const { url = 'login' } = request;
    chrome.windows.create({ url })
  },
  [EVENTS.LOGIN]: () => {
    openLoginTab()
  },
  [EVENTS.JUMP_TAB]: (request) => {
    console.log('jump tab', request);
    const { tabId, windowId } = request;
    if (windowId) {
      chrome.windows.update(Number(windowId), { focused: true }, () => {
        if (tabId) {
          chrome.tabs.update(Number(tabId), { active: true })
        }
      })
    } else if (tabId) {
      chrome.tabs.update(Number(tabId), { active: true })
    }
  },
});
onMessageFromOptions(MessageLocation.Background, {
  [EVENTS.LOGIN]: () => {
    openLoginTab()
  },
});

// 监听来自非bg的事件
onMessageAnywhere({
  [EVENTS.GET_TABS_BY_WINDOW]: (req) => {
    console.log("req from some where", req);
    const { windowId, from } = req;
    const sendResponse = (window) => {
      switch (from) {
        case 'content': {
          let activeTab = window.tabs.find(t => t.active)
          sendMessageToContentScript(activeTab.id, { tabs: window.tabs }, MessageLocation.Background, EVENTS.GET_TABS_BY_WINDOW)
        }
          break;
        case 'popup':
          sendMessageToPopup({ tabs: window.tabs }, MessageLocation.Background, EVENTS.GET_TABS_BY_WINDOW)
          break;

        default:
          break;
      }
    }
    if (windowId) {
      chrome.windows.get(windowId, { populate: true }, (w) => {
        sendResponse(w)
      })
    } else {
      chrome.windows.getCurrent({ populate: true }, (w) => {
        sendResponse(w)
      })
    }
  }
});
