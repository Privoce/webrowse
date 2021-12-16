import { useState, useEffect } from 'react';


const useLocalUser = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    chrome.storage.sync.get(['user'], (res) => {
      const { user = null } = res;
      setUser(user)
    })
    const listener = (changes, area) => {
      console.log({ changes, area });
      if (area == 'sync' && changes?.user) {
        setUser(changes.user.newValue)
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, [])
  return {
    user
  }
}
export default useLocalUser;

