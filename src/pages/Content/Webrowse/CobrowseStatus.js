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
    .tip{
      padding:5px 0;
      white-space: nowrap;
    }
  .status{
    flex: 1;
    padding:5px 10px 5px 30px;
    white-space: nowrap;
    .host{
      font-weight: 800;
    }
  }
  .follow{
    border:none;
    outline: none;
    color:inherit;
    flex:1;
    background-color:#68D6DD;
    padding-left: 20px;
    background-image: url('https://static.nicegoodthings.com/works/vera/follow.icon.png') ;
    background-repeat: no-repeat;
    background-size: 11px auto;
    background-position: 8px;
    padding:5px 25px 5px 24px;
    &.following{
      background-color:#B63546;
    }
  }
`;

export default function CobrowseStatus() {
  const [host, setHost] = useState(null);
  const [follow, setFollow] = useState(false)
  const toggleFollow = () => {
    sendMessageToBackground({
      data: {
        cmd: EVENTS.FOLLOW_MODE, payload: { follow: !follow }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    setFollow(!follow)
  }
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.UPDATE_FLOATER]: ({ users, userId }) => {
        console.log({ users, userId });
        let currUser = users.find(u => u.id == userId);
        let host = users.find(u => u.host && u.id !== userId) || null;
        setHost(host);
        setFollow(currUser.follow)
      }
    });
  }, []);
  if (!host) return <StyledStatus>
    <div className="tip">
      You are cobrowsing this window
    </div></StyledStatus>
  return (
    <StyledStatus>
      <div className="status"> <strong className="host">{host.username}</strong> become the host</div>
      <button className={`follow ${follow ? 'following' : ''}`} onClick={toggleFollow}>{follow ? 'Stop Following' : 'Follow Host'}</button>
    </StyledStatus>
  )
}
