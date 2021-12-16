import { onMessageFromContentScript, onMessageFromPopup, MessageLocation, onMessageFromOptions } from '@wbet/message-api';
import { EVENTS } from '../../common';
const openLoginTab = () => {
  chrome.tabs.create(
    {
      active: true,
      url: `Login/index.html`
    },
    null
  );
}
// 监听来自content script 的触发事件
onMessageFromContentScript(MessageLocation.Background, {
  [EVENTS.NEW_ACTIVE_WINDOW]: (request) => {
    const { url = 'login' } = request;
    chrome.windows.create({ url })
  },
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

        chrome.tabs.update(Number(tabId), { active: true })
      })
    } else {
      chrome.tabs.update(Number(tabId), { active: true })
    }
  },
});
onMessageFromOptions(MessageLocation.Background, {
  [EVENTS.LOGIN]: () => {
    openLoginTab()
  },
});

