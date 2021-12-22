import React from 'react'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import TimeAgo from 'timeago-react'
import StyledWindow from './styled'
import Options from '../Options'
import TabList from '../TabList'
import Triangle from '../../Triangle';
import ActiveUsers from '../ActiveUsers';
import { useInviteLink, useCopy } from '../../../../common/hooks';
import { EVENTS } from '../../../../../common';
export default function Window({ data = null, handleTitleClick, handleTitleBlur, handleSaveWindow, handleRemoveWindow, handleNewBrowsing }) {
  const { getInviteLink } = useInviteLink({});
  const { copy } = useCopy({ from: "popup" });
  const toggleExpand = (evt) => {
    evt.stopPropagation();
    const { currentTarget } = evt;
    currentTarget.querySelector('.triangle')?.classList.toggle('down')
    currentTarget.parentElement.parentElement.classList.toggle('expand')
  }
  const handleOpenTabs = (urls) => {
    console.log({ urls });
    chrome.windows.create({ url: urls })
    // window.close()
  }
  const handleEnterKey = (evt) => {
    if (evt.keyCode == 13) {
      evt.target.setSelectionRange(0, 0)
      evt.target.blur();
    }
  }
  const handleJumpTab = ({ currentTarget }) => {
    const { tabId = "", windowId, url } = currentTarget.dataset;
    if (url) {
      chrome.tabs.create({ url, active: false })
      return
    }
    if (!windowId) return;
    sendMessageToBackground({ tabId, windowId }, MessageLocation.Popup, EVENTS.JUMP_TAB)
  }

  const handleCopyLink = async (wid, roomId) => {
    if (!wid) return;
    const link = await getInviteLink({ roomId, winId: wid });
    console.log("generate link", link);
    if (link) {
      copy(link)
    }
  }

  if (!data) return null;
  const { local = false } = data;
  if (local) {
    const { title, id, winId, room, tabs, live } = data;
    return <StyledWindow key={id} className={`window ${live ? 'live' : ''}`}>
      <h3 className={`title openable`} key={title} data-window-id={id} onClick={handleJumpTab} >
        <div className="arrow" onClick={toggleExpand}>
          <Triangle />
        </div>
        <div className="con" data-tab-count={`${tabs.length} ${chrome.i18n.getMessage('tabs')}`} >
          <input onKeyDown={handleEnterKey} data-window-id={id} onBlur={handleTitleBlur} onClick={handleTitleClick} readOnly defaultValue={title} />
        </div>
        {!live && <button data-type="current" data-room={room} data-win-id={id} onClick={handleNewBrowsing} className="start">{chrome.i18n.getMessage('start')}</button>}
        <Options>
          {live && <li className="item" onClick={handleCopyLink.bind(null, winId, room)}>{chrome.i18n.getMessage('copy_link')}</li>}
          <li className="item" onClick={handleSaveWindow.bind(null, { id, winId })}>{chrome.i18n.getMessage('save')}</li>
        </Options>
      </h3>
      <TabList tabs={tabs.map(({ id, title, url, favIconUrl, windowId }) => {
        return { id, title, url, icon: favIconUrl, windowId }
      })} handleJumpTab={handleJumpTab} />
      <div className="btm openable" data-window-id={id} onClick={handleJumpTab}>
        {live ? <span className="live">LIVE</span> : <span className="unsave">{chrome.i18n.getMessage('unsaved')}</span>}
      </div>
    </StyledWindow>
  } else {
    const { relation_id, title, id, room, tabs, active, live, windowId, updated_at } = data;
    return (
      <StyledWindow className={`window`}>
        <h3 className={`title openable ${live ? 'live' : ''}`} data-window-id={windowId} onClick={live ? handleJumpTab : handleOpenTabs.bind(null, tabs.map(t => t.url))} >
          <div className="arrow" onClick={toggleExpand}>
            <Triangle />
          </div>
          <div className="con" data-tab-count={`${tabs.length} ${chrome.i18n.getMessage('tabs')}`} >
            <input onKeyDown={handleEnterKey} data-type="saved" className={`${live ? 'editable' : ''}`} data-window-id={id} onBlur={handleTitleBlur} onClick={handleTitleClick} readOnly defaultValue={title} />
          </div>

          {!live && <button data-type="saved" data-room-id={room} data-win-id={id} onClick={handleNewBrowsing} className="start">{active ? chrome.i18n.getMessage('join') : chrome.i18n.getMessage('start')}</button>}
          <Options>
            <li className="item" onClick={handleOpenTabs.bind(null, tabs.map(t => t.url))}>{chrome.i18n.getMessage('open_privately')}</li>
            <li className="item" onClick={handleCopyLink.bind(null, id, room)}>{chrome.i18n.getMessage('copy_link')}</li>
            <li className="item" onClick={handleRemoveWindow.bind(null, relation_id)}>{chrome.i18n.getMessage('remove')}</li>
          </Options>
        </h3>
        <TabList tabs={tabs} handleJumpTab={handleJumpTab} />
        <div className="btm openable" onClick={live ? handleJumpTab : handleOpenTabs.bind(null, tabs.map(t => t.url))}>
          <TimeAgo
            locale={navigator.language == 'zh' ? "zh_CN" : 'en'}
            className="time"
            datetime={new Date(updated_at)}
          />
          <ActiveUsers wid={id} />
        </div>
      </StyledWindow>)
  }
}
