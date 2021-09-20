import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'

document.documentElement.classList.add('webrowse');
chrome.storage.sync.get(['user'], (result) => {
  const { user } = result;
  if (user) {
    document.documentElement.classList.add('logined');
    setTimeout(() => {
      const startBrowseBtn = document.querySelector('.viewport .add.btn');
      if (!startBrowseBtn) return;
      console.log("start browse ele", startBrowseBtn);
      startBrowseBtn.innerHTML = 'Start Cobrowse!';
      startBrowseBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        //to do
        sendMessageToBackground({ rid: user.id }, MessageLocation.Content, 'NEW_WINDOW')
      }, false)
    }, 100)
  } else {
    setTimeout(() => {
      const loginEle = document.querySelector('.navbar .right .btn.login');
      if (!loginEle) return;
      loginEle.setAttribute('href', `chrome-extension://${chrome.runtime.id}/Login/index.html`);
    }, 100)
  }
});
