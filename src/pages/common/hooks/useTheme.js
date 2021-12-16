import { useEffect, useState } from 'react'
const useTheme = () => {
  const [theme, setTheme] = useState('default')
  useEffect(() => {
    chrome.storage.sync.get(['local_theme'], (res) => {
      const { local_theme = 'default' } = res;
      setTheme(local_theme)
    });
    const listener = (changes, area) => {
      console.log({ changes, area });
      if (area == 'sync' && changes?.local_theme) {
        setTheme(changes.local_theme.newValue)
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener)
    }
  }, []);
  const updateTheme = (theme = 'default') => {
    chrome.storage.sync.set({ local_theme: theme })
  }
  return {
    theme,
    updateTheme
  }

}

export default useTheme
