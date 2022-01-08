import React, { useEffect, useState } from 'react'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import { MdOutlineRefresh } from 'react-icons/md';
import ContentLoader from '../ContentLoader'
import { useWindow } from '../../../common/hooks'
import { generateUUID } from '../../../common/utils'
import Window from './Window'
import { EVENTS } from '../../../../common';
import StyledWrapper from './styled';
let tempTitle = "";
export default function WindowList({ titles = {}, windows = null, uid = null }) {

  const { windows: remoteWindows, saveWindow, removeWindow, updateWindowTitle, loading } = useWindow(uid)
  const [savedWindows, setSavedWindows] = useState(null);
  const [currentWindows, setCurrentWindows] = useState([]);
  useEffect(() => {
    if (remoteWindows) {
      setSavedWindows(remoteWindows);
      chrome.storage.sync.set({ [`local_windows`]: remoteWindows })
    } else {
      chrome.storage.sync.get(['local_windows'], (res) => {
        const { local_windows } = res;
        if (local_windows) {
          setSavedWindows(local_windows)
        }
      })
    }
  }, [remoteWindows]);
  const handleNewBrowsing = async (evt) => {
    evt.stopPropagation();
    const { roomId, winId, type } = evt.target.dataset;
    let urls = [];
    let finalRoomId = roomId;
    let finalWinId = winId;
    switch (type) {
      case 'current': {
        console.log("window id", winId);
        finalRoomId = uid;
        finalWinId = generateUUID();
        chrome.windows.getCurrent(({ id }) => {
          if (id == winId) {
            sendMessageToBackground({ currentWindow: true, roomId: finalRoomId, winId: finalWinId, urls }, MessageLocation.Popup, EVENTS.NEW_WINDOW);
          } else {
            chrome.windows.update(Number(winId), { focused: true }, () => {
              sendMessageToBackground({ currentWindow: true, roomId: finalRoomId, winId: finalWinId, urls }, MessageLocation.Popup, EVENTS.NEW_WINDOW);
            })
          }
        })
      }
        break;
      case 'saved': {
        urls = savedWindows.find(w => w.id == winId)?.tabs.map(({ url }) => url) || []
        sendMessageToBackground({ currentWindow: false, roomId: finalRoomId, winId: finalWinId, urls }, MessageLocation.Popup, EVENTS.NEW_WINDOW);
      }
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    chrome.windows.getCurrent((w) => {
      console.log("last focuse", w);
      chrome.windows.getAll({ populate: true }, (wins) => {
        const tmps = wins.map(({ id, tabs }, idx) => {
          let localTitle = titles[id];
          let browsingWindow = windows?.find(w => w.windowId == id)
          console.log("compare", { id, w });
          return {
            id,
            room: browsingWindow?.roomId,
            winId: browsingWindow?.winId,
            active: w.id == id,
            live: !!browsingWindow,
            title: localTitle || browsingWindow?.title || `Window ${idx + 1}`,
            tabs: tabs.map(t => {
              const { favIconUrl, id, title, windowId, url } = t;
              return { favIconUrl, id, title, windowId, url }
            })
          }
        });
        console.log("window list", tmps, windows);
        setCurrentWindows(tmps)
      })
    })
  }, [windows, titles]);

  const handleRemoveWindow = (rid) => {
    console.log("start remove ", rid);
    if (!rid) return;
    removeWindow({
      rid
    })
  }

  const handleSaveWindow = async ({ id, winId = null }) => {
    const willSaveWindow = currentWindows.find(w => w.id == id);
    console.log("start save ", id, winId, willSaveWindow);
    if (!willSaveWindow) return;
    const tabs = willSaveWindow.tabs.map(({ title, favIconUrl, url }) => {
      return { title, icon: favIconUrl, url }
    })
    const obj = { title: willSaveWindow.title, room: `${uid}`, tabs };
    if (winId && !winId.endsWith('_temp')) {
      obj.id = winId;
    }
    const resp = await saveWindow(obj);
    return resp;
  }
  const handleTitleClick = (evt) => {
    evt.stopPropagation();
    const { target } = evt;
    if (!target.readOnly) return;
    tempTitle = target.value;
    target.readOnly = false;
    target.select();
  }
  const handleTitleBlur = (evt) => {
    const { target } = evt;
    target.readOnly = true;
    const { windowId, type = "" } = target.dataset;
    const currVal = target.value;
    if (!currVal || tempTitle == currVal) return;
    if (type == 'saved') {
      // update title
      updateWindowTitle({ id: windowId, title: currVal })
    } else {
      setCurrentWindows(prevs => {
        return prevs.map(w => {
          if (w.id == windowId) {
            w.title = currVal;
            return w;
          }
          return w;
        })
      })
      sendMessageToBackground({ title: currVal, windowId }, MessageLocation.Popup, EVENTS.UPDATE_WIN_TITLE)
    }
  }
  console.log("window list data", uid, remoteWindows);
  return (
    <>
      {currentWindows && currentWindows.length !== 0 && <StyledWrapper>
        <h2 className="title">{chrome.i18n.getMessage('current_window_title')}</h2>
        <div className={`block`}>
          {currentWindows.sort((a, b) => b.active - a.active).map(({ active, title, id, winId, room, tabs, live }) => {
            return <Window
              key={id}
              data={{ local: true, title, id, winId, room, tabs, live, active }}
              handleTitleClick={handleTitleClick}
              handleTitleBlur={handleTitleBlur}
              handleNewBrowsing={handleNewBrowsing}
              handleRemoveWindow={handleRemoveWindow}
              handleSaveWindow={handleSaveWindow} />
          })}
        </div>
      </StyledWrapper>}
      {savedWindows ? <StyledWrapper>
        <h2 className="title">{chrome.i18n.getMessage('saved_window_title')} {loading && <MdOutlineRefresh className="tip" />}</h2>
        <div className={`block ${savedWindows.length == 0 ? 'empty' : ''}`}>
          {savedWindows.length == 0 && <div className="tip">You haven’t saved any windows yet. Start cobrowsing and save any window that you would like to share again!</div>}
          {savedWindows.sort((a, b) => {
            const aLive = !!currentWindows.find((w) => w.winId == a.id);
            const bLive = !!currentWindows.find(w => w.winId == b.id);
            return bLive - aLive;
          }).map(({ relation_id, title, id, room, tabs, active, updated_at }) => {
            const localOpenedWindow = currentWindows.find(w => w.winId == id);
            const live = !!localOpenedWindow;
            const windowId = localOpenedWindow?.id;
            console.log({ localOpenedWindow });
            return <Window
              key={id}
              data={{ relation_id, title, id, room, tabs, active, live, windowId, updated_at }}
              handleTitleClick={handleTitleClick}
              handleTitleBlur={handleTitleBlur}
              handleNewBrowsing={handleNewBrowsing}
              handleRemoveWindow={handleRemoveWindow}
              handleSaveWindow={handleSaveWindow} />
          })}
        </div>
      </StyledWrapper> : <ContentLoader />}
    </>
  )
}
