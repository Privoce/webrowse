try {

  const worker = new Worker(new URL('./worker.js', import.meta.url));
  console.log('service worker script ready~', worker);
} catch (error) {
  console.log('sw error', { error });
}
// 右上角小图标点击事件
// chrome.browserAction.onClicked.addListener(() => {
//   chrome.tabs.create(
//     {
//       active: true,
//       url: 'https://nicegoodthings.com/'
//     },
//     null
//   );
// });
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('bg msg event fire', { request });
//   const { action, data } = request;
//   // 来自content script 的请求：拿到当前tab的信息
//   if (action === 'UPDATE_TOKEN') {
//     console.log('update oath');
//     const { key, value } = data;
//     localStorage.setItem(key, value);
//   }
//   if (action === 'OPEN_HOME') {
//     console.log('open home page in ext');
//     chrome.tabs.create(
//       {
//         active: true,
//         url: 'https://nicegoodthings.com/'
//       },
//       null
//     );
//   }
//   if (action === 'LOGIN') {
//     console.log('open login in ext');
//     chrome.tabs.create(
//       {
//         openerTabId: sender.tab.id,
//         active: true,
//         url: `Login/index.html?tid=${sender.tab.id}`
//       },
//       null
//     );
//   }
//   sendResponse()
// });
