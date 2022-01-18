/**
 * @author: laoona
 * @date:  2022-01-18
 * @time: 10:47
 * @contact: laoona.com
 * @description: #
 */
import { useState, useEffect } from 'react';

const useStreamToken = (uid) => {
  const key = 'stream_token';
  const [token, setToken] = useState(null)

  // 更新 key;
  const setStreamToken = async (uid) => {
    if (!uid) return null;

    const _token = await getToken(uid);

    chrome.storage.sync.set({ [key]: _token });

    return _token;
  }

  const getToken = async (id = uid) => {
    return await (await fetch(`https://wechat.okeydemo.com/api/getstream/get_token?user=${id}`)).text();
  };

  useEffect(() => {
    if (!uid) {
      setToken(null);
      return;
    }

    chrome.storage.sync.get([key], async (res) => {
      const _token = res?.[key] || null;

      if (!_token) {
        const res = await setStreamToken(uid);
        return setToken(res);
      }

      setToken(_token);
    });
  }, [uid])

  useEffect(() => {

    const listener = (changes, area) => {
      if (area === 'sync' && changes?.[key]) {
        setToken(changes?.[key]?.newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, []);

  return {
    token,
    setToken: setStreamToken,
  }
}

export  default useStreamToken;
