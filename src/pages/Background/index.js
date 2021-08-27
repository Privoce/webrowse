
import './message-events';
import './ws-workspace';
import './ws-notification';

// 安装扩展触发的事件
chrome.runtime.onInstalled.addListener(function (details) {
  const { reason } = details;
  console.log("install reason", reason);
  switch (reason) {
    case 'install': {
      chrome.tabs.query({ url: "*://*/transfer/wb/*" }, function (tabs) {
        console.log('query invite tabs', tabs);
        if (!tabs || tabs.length === 0) {
          chrome.tabs.create(
            {
              active: true,
              url: 'https://nicegoodthings.com/landing/webrowse'
            },
            null
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
// case 'update':
// case 'chrome_update':
console.log('bg script ready~');

