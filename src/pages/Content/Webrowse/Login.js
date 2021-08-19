import { useEffect } from 'react';
import { sendMessageToBackground, MessageLocation, onMessageFromContentScript } from '@wbet/message-api';
import { EVENTS } from '../../../common'
import Button from './Button';
const loginTxt = chrome.i18n.getMessage('login');
const regTxt = chrome.i18n.getMessage('reg');
export default function Login({ type = 'login' }) {
  const handleLogin = () => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.LOGIN)
  };
  useEffect(() => {
    // 监听
    onMessageFromContentScript(MessageLocation.Content, {
      [EVENTS.LOGIN]: () => {

        // VERA_EMITTER.emit('login', { isHost, localId, inviteId, username });
      }
    })
  }, []);
  return <Button onClick={handleLogin}>{type == 'login' ? loginTxt : regTxt}</Button>;
}
