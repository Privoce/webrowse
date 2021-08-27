// import { useEffect } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../../common'
import StyledBlock from './StyledBlock'
const StyledWrapper = styled(StyledBlock)`
  background:#F0FBFC;
  .block{
    font-size: 16px;
    width: 100%;
    .pf{
      line-height: 20px;
      font-weight: bold;
      padding-left:27px;
      background-position: left center;
      background-repeat: no-repeat;
    }
    &.toggle{
      display: flex;
      flex-direction:column;
      user-select: none;
      gap:10px;
      padding-bottom: 12px;
      .up{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        gap:10px;
        .cb{
          appearance: auto;
        }
        .pf{
          background-size: 18.5px auto;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/follow.svg`});
        }
        >.tip{
          font-size: 12px;
          line-height: 15px;
          color: #00CA72;
          padding:3px 6px;
          border-radius:6px;
          border:1px solid #00CA72;
          font-weight: bold;
        }
      }
      .down{
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
        font-size:12px;
        color:#000;
        .stop,.enable{
          align-self: flex-end;
        }
        >.tip{
          font-size:12px;
          color:#000;
          line-height: 15px;
          text-align: left;
        }
      }
    }
    &.host{
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(104, 214, 221, 0.5);
      .current{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color:#000;
        .pf{
          background-size: 20px auto;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/host.svg`});
        }
        .prefix{
          margin-right: 68px;
        }
        .member{
          display: flex;
          align-items: center;
          gap: 8px;
          .head{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 2px solid #68D6DD;
          }
          .name{

          }
        }
      }
      .takeover{
        align-self: flex-end;
      }
    }
    .btn{
      font-size:16px;
      width: fit-content;
      padding: 5px 12px;
      background: none;
      outline: none;
      white-space: nowrap;
      border: none;
      box-sizing: border-box;
      border-radius: 20px;
      color: #fff;
      background: #68D6DD;
      height: auto;
      line-height: 1;
    }
  }
`;
export default function FollowMode({ host = null, currUser = {}, closeBlock }) {
  const toggleCheck = () => {
    let cked = !!currUser.follow;
    sendMessageToBackground({
      data: {
        cmd: EVENTS.FOLLOW_MODE, payload: { follow: !cked }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
  }
  const handleBeHost = (evt) => {
    const { beHost } = evt.target.dataset;
    let enable = beHost == 'yes';
    // 成为host
    sendMessageToBackground({
      data: {
        cmd: EVENTS.BE_HOST,
        payload: {
          enable
        }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG)
  }

  if (!host) {
    return <StyledWrapper>
      <div className="close" data-type='follow' onClick={closeBlock}></div>
      <div className="block toggle" >
        <div className="up">
          <span className="pf">Follow Mode</span>
        </div>
        <div className="down">
          <span className="tip">
            {`Become host to enable follow mode. Other users will automatically follow the host's active tab.`}
          </span>
          <button className="btn enable" data-be-host="yes" onClick={handleBeHost}>Become Host</button>
        </div>
      </div>
    </StyledWrapper>
  }
  const { username, photo } = host;
  const checked = !!currUser.follow;
  const hostMyself = host.id == currUser.id;
  return (
    <StyledWrapper>
      <div className="close" data-type='follow' onClick={closeBlock}></div>
      <div className="block toggle" onClick={hostMyself ? null : toggleCheck}>
        <div className="up">
          <span className="pf">Follow Mode</span>
          {hostMyself ? <span className="tip">You are now the host</span> : <input className="cb" checked={checked} readOnly type="checkbox" name="toggle" id="toggle" />}
        </div>
        <div className="down">
          <span className="tip">
            {hostMyself ? `Other users can follow your active tab.` : `Automatically follow the host's active tab.`}
          </span>
          {hostMyself && <button className="btn stop" data-be-host="no" onClick={handleBeHost}>Stop Being Host</button>}
        </div>
      </div>
      {!hostMyself && <div className="block host">
        <div className="current">
          <span className="pf prefix">Host</span>
          <div className="member">
            <img src={photo || 'https://files.authing.co/authing-console/default-user-avatar.png'} alt="host head image" className="head" />
            <div className="name">{username}</div>
          </div>
        </div>
        <button className="btn takeover" data-be-host="yes" onClick={handleBeHost}>Take Over as Host</button>
      </div>}
    </StyledWrapper>
  )
}
