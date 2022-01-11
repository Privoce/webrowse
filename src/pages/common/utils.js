
import { sendMessageToBackground, onMessageFromBackground, MessageLocation } from '@wbet/message-api';
import { EVENTS } from '../../config'
const Locations = {
  content: MessageLocation.Content,
  popup: MessageLocation.Popup
}
const getWindowTabs = ({ windowId = null, origin = false, from = 'content' } = {}) => {
  return new Promise((resolve) => {
    sendMessageToBackground({ windowId, from }, Locations[from], [EVENTS.GET_TABS_BY_WINDOW]);
    onMessageFromBackground(Locations[from], {
      [EVENTS.GET_TABS_BY_WINDOW]: ({ tabs }) => {
        console.log({ tabs });
        let returns = tabs.filter(t => t.url.startsWith('http')).map(t => {
          const { title, favIconUrl, url } = t;
          return { title, url, favIconUrl }
        });
        if (!origin) {
          returns = returns.map(t => {
            const { favIconUrl, ...rest } = t;
            return { icon: favIconUrl, ...rest }
          })
        }
        resolve(returns)
      }
    })
  })
}
const getWindowTitle = () => {
  return new Promise((resolve) => {
    sendMessageToBackground({}, MessageLocation.Content, [EVENTS.WIN_TITLE]);
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.WIN_TITLE]: ({ title }) => {
        console.log({ title });
        resolve(title)
      }
    })
  })
}
function debounce(callback, wait = 2000, immediate = false) {
  let timeout = null
  return function () {
    const callNow = immediate && !timeout
    const next = () => callback.apply(this, arguments)
    clearTimeout(timeout)
    timeout = setTimeout(next, wait)
    if (callNow) {
      next()
    }
  }
}
function generateUUID() { // Public Domain/MIT
  let d = new Date().getTime();//Timestamp
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
const stringToHexColor = (str = '') => {
  if (!str) return null;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}
export { stringToHexColor, debounce, throttle, getWindowTabs, getWindowTitle, generateUUID }
