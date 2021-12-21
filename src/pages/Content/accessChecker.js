import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../common'

console.log("access checker executed");
setTimeout(() => {
    switch (location.host) {
        case 'docs.google.com': {
            if (document.title.toLowerCase().includes("access denied")) {
                console.log("send access tip: google docs");
                sendMessageToBackground({ site: "google_docs" }, MessageLocation.Content, EVENTS.ACCESS_TIP)
            }
        }
            break;
        case 'www.notion.so': {
            const appRoot = document.querySelector('#notion-app');
            if (appRoot && appRoot.innerText.includes('This content does not exist')) {
                console.log("send access tip: notion");
                sendMessageToBackground({ site: "notion" }, MessageLocation.Content, EVENTS.ACCESS_TIP)
            }
        }
            break;
        case 'www.figma.com': {
            if (document.querySelector("[class^=_404_app--page]")) {
                console.log("send access tip: figma");
                sendMessageToBackground({ site: "figma" }, MessageLocation.Content, EVENTS.ACCESS_TIP)
            }
        }

            break;

        default:
            break;
    }
}, 1500);