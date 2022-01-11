import { useState } from 'react';
import { MessageLocation, sendMessageToBackground } from '@wbet/message-api';
import { EVENTS } from '../../../config'
const Froms = {
  content: MessageLocation.Content,
  popup: MessageLocation.Popup
}
export default function useCopy(params = {}) {
  const { duration = 2000, from = 'content' } = params;
  const [copied, setCopied] = useState(false);
  const copy = (content = '') => {
    if (copied || !content) return;
    sendMessageToBackground({ content }, Froms[from], EVENTS.COPY_SOMETHING)
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, duration);
  };

  return { copied, copy };
}
