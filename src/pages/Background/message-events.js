import { onMessageFromContentScript, onMessageFromPopup, MessageLocation } from '@wbet/message-api';
import { EVENTS } from '../../common';

// 监听来自content script 的触发事件
onMessageFromContentScript(MessageLocation.Background, {
  [EVENTS.JUMP_TAB]: (request) => {
    console.log('jump tab', request);
    chrome.tabs.update(Number(request.tabId), { active: true })
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
  [EVENTS.LOGIN]: () => {
    chrome.tabs.create(
      {
        active: true,
        url: `Login/index.html`
      },
      null
    );
  },
  [EVENTS.JUMP_TAB]: (request) => {
    console.log('jump tab', request);
    const { tabId, windowId } = request;
    if (windowId) {
      chrome.windows.update(Number(windowId), { focused: true }, () => {

        chrome.tabs.update(Number(tabId), { active: true })
      })
    } else {
      chrome.tabs.update(Number(tabId), { active: true })
    }
  },
});
