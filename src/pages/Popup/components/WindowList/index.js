import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS, SOCKET_SERVER_DOMAIN } from '../../../../common';
import StyledWrapper from './styled'


const fetcher = (...args) => fetch(...args).then(res => res.json());
const prefix = SOCKET_SERVER_DOMAIN.indexOf('localhost') > -1 ? 'http:' : 'https:';
let tempTitle = ""
export default function WindowList({ windows = null, roomId = "" }) {
  const [savedWindows, setSavedWindows] = useState(null);
  const [currentWindows, setCurrentWindows] = useState([])
  const { data, } = useSWR(`${prefix}//${SOCKET_SERVER_DOMAIN}/webrowse/window/list/${roomId}`, fetcher)
  const handleJumpTab = ({ currentTarget }) => {
    const { tabId, windowId } = currentTarget.dataset;
    if (!windowId) return;
    sendMessageToBackground({ tabId, windowId }, MessageLocation.Popup, EVENTS.JUMP_TAB)
  }
  const toggleExpand = ({ currentTarget }) => {
    currentTarget.parentElement.parentElement.classList.toggle('expand')
  }
  const handleNewBrowsing = (evt) => {
    evt.stopPropagation();
    const { roomId, winId, type } = evt.target.dataset;
    let urls = [];
    switch (type) {
      case 'current':
        urls = currentWindows.find(w => w.id == winId)?.tabs.map(({ url }) => url) || []
        break;

      case 'saved':
        urls = savedWindows.find(w => w.id == winId)?.tabs.map(({ url }) => url) || []
        break;
      default:
        break;
    }

    sendMessageToBackground({ roomId, winId, urls }, MessageLocation.Popup, EVENTS.NEW_WINDOW);
    window.close()
  }
  useEffect(() => {
    if (data && data.windows) {
      let newArr = data.windows.map(saved => {
        let live = !!windows.find(w => w.winId == saved.id);
        return { ...saved, live }
      })
      setSavedWindows(newArr)
    }
  }, [data, windows]);
  useEffect(() => {
    chrome.windows.getAll({ populate: true }, (wins) => {
      const tmps = wins.map(({ id, tabs }, idx) => {
        let browsingWindow = windows?.find(w => w.windowId == id)
        return {
          id,
          live: !!browsingWindow,
          title: browsingWindow?.title || `Window ${idx + 1}`,
          tabs: tabs.map(t => {
            const { favIconUrl, id, title, windowId, url } = t;
            return { favIconUrl, id, title, windowId, url }
          })
        }
      })
      setCurrentWindows(tmps)
    })
  }, [windows]);
  const handleTitleClick = (evt) => {
    const { target } = evt;
    if (!target.readOnly) return;
    tempTitle = target.value;
    target.readOnly = false;
    target.select();
  }
  const handleTitleBlur = (evt) => {
    const { target } = evt;
    target.readOnly = true;
    const { windowId } = target.dataset;
    const currVal = target.value;
    if (!currVal || tempTitle == currVal) return;
    sendMessageToBackground({ title: currVal, windowId }, MessageLocation.Popup, EVENTS.UPDATE_WIN_TITLE)
  }
  return (
    <>
      {currentWindows && currentWindows.length !== 0 && <StyledWrapper>
        <h2 className="title">{`Current Window${currentWindows.length == 1 ? '' : 's'}`}</h2>
        <div className={`block`}>
          {currentWindows.map(({ title, id, tabs, live }) => {
            return <div key={id} className="window">
              <h3 className="title" >
                <i className='arrow' onClick={toggleExpand}></i>
                <input className={`con ${live ? 'editable' : ''}`} data-window-id={id} onBlur={handleTitleBlur} onClick={live ? handleTitleClick : null} readOnly defaultValue={title} />
                <span className="num">{tabs.length} tabs</span>
                {live ? <span className="live">live</span> : <button data-type="current" data-win-id={id} onClick={handleNewBrowsing} className="start">cobrowse</button>}
              </h3>
              <ul className="tabs">
                {tabs.map(({ id, title, favIconUrl, windowId = '' }) => {
                  return <li onClick={handleJumpTab} data-window-id={windowId} data-tab-id={id} key={id} title={title} className="tab">
                    <img src={favIconUrl || "https://files.authing.co/authing-console/default-user-avatar.png"} alt="favicon" />
                    <span className="con">{title}</span>
                  </li>
                })}
              </ul>
            </div>
          })}
        </div>
      </StyledWrapper>}
      {savedWindows && <StyledWrapper>
        <h2 className="title">Saved Windows</h2>
        <div className={`block ${savedWindows.length == 0 ? 'empty' : ''}`}>
          {savedWindows.length == 0 && <div className="tip">You haven’t saved any windows yet. Start cobrowsing and save any window that you would like to share again!</div>}
          {savedWindows.map(({ title, id, live, room, tabs }) => {
            return <div key={id} className="window">
              <h3 className="title">
                <i className='arrow' onClick={toggleExpand}></i>
                <span className="con">
                  {title || "untitled window"}
                </span>
                <span className="num">{tabs.length} tabs</span>
                {live ? <span className="live">live</span> : <button data-type="saved" data-room-id={room} data-win-id={id} onClick={handleNewBrowsing} className="start">cobrowse</button>}
              </h3>
              <ul className="tabs">
                {tabs.map(({ id, title, icon, windowId = '' }) => {
                  return <li onClick={handleJumpTab} data-window-id={windowId} data-tab-id={id} key={id} title={title} className="tab">
                    <img src={icon || "https://files.authing.co/authing-console/default-user-avatar.png"} alt="favicon" />
                    <span className="con">{title}</span>
                  </li>
                })}
              </ul>
            </div>
          })}
        </div>
      </StyledWrapper>}
    </>
  )
}
