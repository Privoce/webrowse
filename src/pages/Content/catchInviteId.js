// room id
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'

document.addEventListener('VERA_ROOM_EVENT', function (e) {
  let {
    detail: { rid, wid, user }
  } = e;
  console.log('received', rid, user);
  if (user) {
    chrome.storage.sync.set({ user }, () => {
      // Notify that we saved.
      console.log('user saved', user);
    });
  }
  if (rid) {
    sendMessageToBackground({ wid, rid, src: 'INVITE_LINK' }, MessageLocation.Content, 'NEW_WINDOW')
  }
});
document.addEventListener('VERA_ROOM_NEW_WINDOW_EVENT', function (e) {
  let {
    detail: { urls = [], rid = null, wid = null }
  } = e;
  console.log('new window from catchInviteId', urls, rid, wid);
  if (rid) {
    sendMessageToBackground({ wid, urls, rid }, MessageLocation.Content, 'NEW_WINDOW')
  }
});
