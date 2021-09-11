import { AuthingGuard } from '@authing/native-js-ui-components'
// 引入 css 文件
import '@authing/native-js-ui-components/lib/index.min.css'
import { sendMessageToContentScript, MessageLocation } from '@wbet/message-api';

const guard = new AuthingGuard('6034a70af621af721e5320b9', {
  lang: navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US',
  localesConfig: {
    defaultLang: navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US',
    isShowChange: true,
  },
})

// 事件监听
const loginHandler = (user) => {
  console.log(user);
  // 本地种下用户数据
  chrome.storage.sync.set({ user }, function () {
    console.log('user from login page ', user)
  });
  chrome.tabs.getCurrent((tab) => {
    console.log({ tab })
    let { id, openerTabId } = tab
    sendMessageToContentScript(openerTabId, { user }, MessageLocation.Content, 'LOGIN');
    chrome.tabs.update(id, { url: `https://webrow.se/logined?name=${encodeURI(user.username)}` })
  })
}
guard.on('load', (authClient) => console.log(authClient))
guard.on('login', (user) => {
  loginHandler(user)
})
guard.on('register-info-completed', (user) => {
  loginHandler(user)
})
