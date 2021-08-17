
import './message-events';
import './ws-workspace';
import './ws-notification';

// 安装扩展触发的事件
chrome.runtime.onInstalled.addListener(function (details) {
  const { reason } = details;
  switch (reason) {
    case 'install':
    case 'update':
    case 'chrome_update':
      chrome.tabs.create(
        {
          active: true,
          url: 'https://nicegoodthings.com/landing/webrowse'
        },
        null
      );
      break;
  }
});
console.log('bg script ready~');

