import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common';
const AniSlideToggle = keyframes`
  0% {
    opacity: 0.2;
    transform: translate3d(0, -100%, 0);
  }

  16% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  84%{
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  100%{
    opacity: 0.2;
    transform: translate3d(0, -100%, 0);
  }
`;
const StyledStatus = styled.div`
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: all;
    text-align: center;
    border-radius: 0px 0px 8px 8px;
    color:#fff;
    font-size: 12px;
    font-family: sans-serif;
    display: flex;
    .tip{
      background: linear-gradient(271.12deg, #056CF2 0.35%, #74D6D7 95.13%);
      white-space: nowrap;
      font-size: 12px;
      line-height:18px;
      &.overlay{
        position: absolute;
        left: 0;
        top: 0;
      }
      &.operation{
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre;
        width: -webkit-fill-available;
        height: -webkit-fill-available;
        z-index: 9;
        background: linear-gradient(271.12deg, #056CF2 0.35%, #74D6D7 95.13%);
        overflow: hidden;
        animation: ${AniSlideToggle} 6s;
        animation-fill-mode: both;
        strong{
          font-weight: bold;
          &.tab_title{
            width: fit-content;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 10px;
          }
        }
      }
    }
    .status{
      line-height:18px;
      display:inline-block;
      white-space: nowrap;
      background: linear-gradient(271.12deg, #056CF2 0.35%, #74D6D7 95.13%);
      .host{
        font-weight: 800;
      }
    }
    .tip,.status{
      position:relative;
      padding:4px 12px 4px 36px;
      &:before{
        position:absolute;
        left:12px;
        top: 50%;
        transform: translateY(-50%);
        display:block;
        content:"";
        background-image: url(${({ avatar = 'https://static.nicegoodthings.com/project/ext/webrowse.logo.white.png' }) => avatar} );
        width:16px;
        height:16px;
        border-radius: 50%;
        background-size:contain;
        background-repeat:no-repeat;
      }
    }
    .status_btn{
      line-height:18px;
      display:inline-block;
      white-space: nowrap;
      user-select: none;
      border:none;
      outline: none;
      font-size: inherit;
      color:inherit;
      margin: 0;
      padding:4px 12px 4px 24px;
      padding-left: 26px;
      &.follow,&.host,&.be_host{
        background-color:#52E9FB;
        background-image: url('https://static.nicegoodthings.com/works/vera/follow.icon.png') ;
        background-repeat: no-repeat;
        background-size: 11px auto;
        background-position: 8px;
        &.warning{
          padding-left: 32px;
          position: relative;
          background-image: none;
          background-color:#BA1B1B;
          &:before{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 12px;
            content: "";
            display: block;
            border-radius:2px;
            width: 12px;
            height: 12px;
            background-color: #fff;
          }
        }
      }
      &.be_host{
        background-color: #5C6065;
      }
    }
`;
const operations = {
  create: 'opened new tab',
  remove: 'closed tab'
}
export default function CobrowseStatus() {
  const [host, setHost] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [htmlTip, setHtmlTip] = useState(null)
  const handleBeHost = (enable) => {
    if (!currUser) return;
    sendMessageToBackground({
      data: {
        cmd: EVENTS.BE_HOST, payload: { enable }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    setHost(null);
  }
  const toggleFollow = () => {
    if (!currUser) return;
    sendMessageToBackground({
      data: {
        cmd: EVENTS.FOLLOW_MODE, payload: { follow: !currUser.follow }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    setCurrUser(prev => {
      return { ...prev, follow: !prev.follow }
    })
  }
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.UPDATE_FLOATER]: ({ users, userId }) => {
        console.log({ users, userId });
        let currUser = users.find(u => u.id == userId);
        let host = users.find(u => u.host) || null;
        setHost(host);
        setCurrUser(currUser)
      },
      [EVENTS.TAB_EVENT]: ({ username, type, tab }) => {
        console.log('receive tab event', username, type, tab);
        let htmlStr = `${username} ${operations[type]} <strong class="tab_title">${tab.title}</strong>`;
        setHtmlTip(htmlStr);
      }
    });
  }, []);
  const resetHtmlTip = () => {
    setHtmlTip(null)
  }
  if (!currUser) return null;
  if (!host) return <StyledStatus>
    {htmlTip ?
      <div className="tip operation" onAnimationEnd={resetHtmlTip} dangerouslySetInnerHTML={{ __html: htmlTip }}></div>
      :
      <>
        <div className="tip">
          {chrome.i18n.getMessage('cobrowsing_tip')}
        </div>
        <button className={`status_btn be_host`} onClick={handleBeHost.bind(null, true)}>{chrome.i18n.getMessage('be_host')}</button>
      </>
    }</StyledStatus>;
  const hostMyself = host.id == currUser.id;
  return (
    <StyledStatus avatar={hostMyself ? currUser.photo : host.photo}>
      {htmlTip && <div className="tip overlay operation" onAnimationEnd={resetHtmlTip} dangerouslySetInnerHTML={{ __html: htmlTip }}></div>}
      <div className="status">
        {hostMyself ? <span>You are now the host</span> : <span>{host.username} is now the host</span>}
      </div>
      {hostMyself ?
        <button className={`status_btn host warning`} onClick={handleBeHost.bind(null, false)}>{chrome.i18n.getMessage('stop_hosting')}</button>
        : <>
          <button className={`status_btn follow ${currUser.follow ? 'warning' : ''}`} onClick={toggleFollow}>{currUser.follow ? chrome.i18n.getMessage('stop_following') : chrome.i18n.getMessage('follow_host')}</button>
          <button className={`status_btn be_host`} onClick={handleBeHost.bind(null, true)}>{chrome.i18n.getMessage('be_host')}</button>
        </>}
    </StyledStatus>
  )
}
