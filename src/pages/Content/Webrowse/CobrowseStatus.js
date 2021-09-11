import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'
const StyledStatus = styled.div`
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: all;
    background-color: #056CF2;
    background-image:url("https://static.nicegoodthings.com/works/vera/white.logo.png");
    background-repeat: no-repeat;
    text-align: center;
    background-position: 5px;
    background-size: 18px;
    border-radius: 0px 0px 10px 10px;
    min-width: 300px;
    color:#fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    .tip{
      padding:5px 0;
      white-space: nowrap;
      font-size: 12px;
    }
    .status{
      flex: 1;
      padding:5px 10px 5px 30px;
      white-space: nowrap;
      .host{
        font-weight: 800;
      }
    }
    .status_btn{
      user-select: none;
      border:none;
      outline: none;
      color:inherit;
      flex:1;
      margin: 0;
      padding:5px 25px 5px 24px;
      padding-left: 20px;
      &.follow,&.host{
        background-color:#68D6DD;
        background-image: url('https://static.nicegoodthings.com/works/vera/follow.icon.png') ;
        background-repeat: no-repeat;
        background-size: 11px auto;
        background-position: 8px;
        &.warning{
          position: relative;
          background-image: none;
          background-color:#B63546;
          &:before{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 16px;
            content: "";
            display: block;
            width: 8px;
            height: 8px;
            background-color: #fff;
          }
        }
      }
    }
`;

export default function CobrowseStatus() {
  const [host, setHost] = useState(null);
  const [currUser, setCurrUser] = useState(null)
  const stopBeHost = () => {
    if (!currUser) return;
    sendMessageToBackground({
      data: {
        cmd: EVENTS.BE_HOST, payload: { enable: false }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    setHost(null)
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
      }
    });
  }, []);
  if (!currUser) return null;
  if (!host) return <StyledStatus>
    <div className="tip">
      You are cobrowsing this window
    </div></StyledStatus>;
  const hostMyself = host.id == currUser.id;
  return (
    <StyledStatus>
      <div className="status">
        {hostMyself ? <span><strong className="host">You</strong> are now the host</span> : <span><strong className="host">{host.username}</strong> is now the host</span>}
      </div>
      {hostMyself ?
        <button className={`status_btn host warning`} onClick={stopBeHost}>Stop Hosting</button>
        :
        <button className={`status_btn follow ${currUser.follow ? 'warning' : ''}`} onClick={toggleFollow}>{currUser.follow ? 'Stop Following' : 'Follow Host'}</button>}
    </StyledStatus>
  )
}
