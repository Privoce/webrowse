import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components';
import userSWR from 'swr'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS, SOCKET_SERVER_DOMAIN } from '../../../common'
const AniDot = keyframes`
  from{
    opacity:0.2;
  }
  to{
    opacity:1;
  }
`;
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding:0 24px 16px 24px ;
  >.title{
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: #121212;
  }
  >.block{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    width: 326px;
    max-height: 240px;
    background:#fff;
    border-radius: 10px;
    padding:8px 0;
    overflow: overlay;
    &.empty{
      align-items: center;
      justify-content: center;
      height: 238px;
      .tip{
        text-align: center;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: #aaa;
        padding:0 52px;
      }
    }
    .window{
      width:-webkit-fill-available;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding:0;
      margin-bottom: 10px;
      .title{
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #000;
        padding:10px 12px;
        margin: 0;
        .arrow{
          width:20px;
          height:20px;
          border-radius: 50%;
          background-color:#EAEAEA;
          background-size: 16px;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/arrow.down.svg`});
          background-repeat: no-repeat;
          background-position: center;
          transform: rotate(-90deg);
        }
        .con{
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          color: inherit;
          white-space: nowrap;
          width: 152px;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .num{
          padding:3px 6px;
          border: 1px solid #757575;
          border-radius: 15px;
          font-size: 10px;
          line-height: 13px;
          color: #757575;
        }
        .live{
          position: absolute;
          top:50%;
          transform: translateY(-50%);
          right:10px;
          background: rgba(57, 255, 20, 0.1);
          border-radius: 5px;
          padding:4px 8px 4px 21px;
          font-weight: bold;
          font-size: 10px;
          line-height: 13px;
          color: #606368;
          text-transform: uppercase;
          &:before{
            content: "";
            position: absolute;
            left: 8px;
            top:50%;
            transform: translateY(-50%);
            width: 8px ;
            height: 8px;
            border-radius: 50%;
            background-color: #39FF14;
            animation: ${AniDot} 1s ease-in-out infinite alternate;
          }
        }
        .start{
          display: none;
          cursor: pointer;
          border: none;
          padding:0 8px;
            position: absolute;
            top:50%;
            transform: translateY(-50%);
            right:10px;
            color:#fff;
            background: #056CF2;
            border-radius: 25px;
            font-weight: bold;
            font-size: 10px;
            line-height: 22px;
            text-align: center;
          }

      }
      .tabs{
        margin: 0;
        padding: 0 12px;
        list-style: none;
        display: none;
        flex-direction: column;
        gap: 8px;
        border-left: 2px solid #EAEAEA;
        padding-left: 12px;
        margin-left: 28px;
        margin-bottom: 10px;
        .tab{
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 8px;
          img{
            width:24px;
            height:24px;
          }
          .con{
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 300px;
            overflow: hidden;
            font-size: 14px;
            line-height: 18px;
            color: #000;
          }

        }
      }
      &.expand{
        .tabs{
          display: flex;
        }
        .title .arrow{
          transform: rotate(0);
        }
      }
      &:hover{
        .title{
          background: #E8F2FF;
          .start{
            display: block;
          }
        }
      }
    }
  }
`;

const fetcher = (...args) => fetch(...args).then(res => res.json());
const prefix = SOCKET_SERVER_DOMAIN.indexOf('localhost') > -1 ? 'http:' : 'https:';
export default function WindowList({ windows = null, roomId = "" }) {
  const [savedWindows, setSavedWindows] = useState(null);
  const [unsavedWindows, setUnsavedWindows] = useState([])
  const { data, } = userSWR(`${prefix}//${SOCKET_SERVER_DOMAIN}/webrowse/window/list/${roomId}`, fetcher)
  const handleJumpTab = ({ currentTarget }) => {
    const { tabId, windowId } = currentTarget.dataset;
    if (!windowId) return;
    sendMessageToBackground({ tabId, windowId }, MessageLocation.Popup, EVENTS.JUMP_TAB)
  }
  const toggleExpand = ({ currentTarget }) => {
    currentTarget.parentElement.classList.toggle('expand')
  }
  const handleNewBrowsing = (evt) => {
    evt.stopPropagation();
    const { roomId, winId } = evt.target.dataset;
    const urls = savedWindows.find(w => w.winId == winId)?.tabs.map(({ url }) => url) || []
    sendMessageToBackground({ roomId, winId, urls }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
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
    if (windows && windows.length) {
      setUnsavedWindows(windows.filter(w => w.winId.endsWith('_temp')));
    }
  }, [windows])
  return (
    <>
      {unsavedWindows && unsavedWindows.length !== 0 && <StyledWrapper>
        <h2 className="title">Unsaved Windows</h2>
        <div className={`block`}>
          {unsavedWindows.map(({ title, winId, tabs }) => {
            return <div key={winId} className="window">
              <h3 className="title" onClick={toggleExpand}>
                <i className='arrow'></i>
                <span className="con">
                  {title || "untitled window"}
                </span>
                <span className="num">{tabs.length} tabs</span>
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
              <h3 className="title" onClick={toggleExpand}>
                <i className='arrow'></i>
                <span className="con">
                  {title || "untitled window"}
                </span>
                <span className="num">{tabs.length} tabs</span>
                {live ? <span className="live">live</span> : <button data-room-id={room} data-win-id={id} onClick={handleNewBrowsing} className="start">cobrowse</button>}
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
