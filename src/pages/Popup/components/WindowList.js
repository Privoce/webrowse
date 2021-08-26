import React from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding:0 24px 16px 24px ;
  >.title{
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: #121212;
  }
  .window{
    width: 100%;
    width:-webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding:0;
    background:#fff;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 10px;
    .title{
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
        transition: transform .5s ease-in;
      }
      .con{
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        color: inherit;
        white-space: nowrap;
      }

      .num{
        padding:3px 6px;
        border: 1px solid #757575;
        border-radius: 15px;
        font-size: 10px;
        line-height: 13px;
        color: #757575;
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
        transform: rotate(180deg);
      }
    }
    &:hover{
      background:#EBF3FE;
      .title{
        color:#fff;
        background: #056CF2;
        .num{
          color: #DBE2EB;
          border-color: #DBE2EB;
        }
      }
    }
  }
`;
export default function WindowList({ windows = [{
  roomId: 'dddd', roomName: "test", tabs: [{
    id: 222, title: 'ceshi', windowId: 33333
  }]
}] }) {
  console.log("window list", windows);
  const handleJumpTab = ({ currentTarget }) => {
    const { tabId, windowId } = currentTarget.dataset;
    sendMessageToBackground({ tabId, windowId }, MessageLocation.Popup, EVENTS.JUMP_TAB)
  }
  const toggleExpand = ({ currentTarget }) => {
    currentTarget.parentElement.classList.toggle('expand')
  }
  if (!windows || windows.length == 0) return null;
  return (
    <StyledWrapper>
      <h2 className="title">Active Windows</h2>
      {windows.map(({ roomId, roomName, tabs }) => {
        return <div key={roomId} className="window">
          <h3 className="title" onClick={toggleExpand}>
            <i className='arrow'></i>
            <span className="con">
              {roomName}
            </span>
            <span className="num">{tabs.length} tabs</span>
          </h3>
          <ul className="tabs">
            {tabs.map(({ id, title, favIconUrl, windowId }) => {
              return <li onClick={handleJumpTab} data-window-id={windowId} data-tab-id={id} key={id} title={title} className="tab">
                <img src={favIconUrl || "https://files.authing.co/authing-console/default-user-avatar.png"} alt="favicon" />
                <span className="con">{title}</span>
              </li>
            })}
          </ul>
        </div>
      })}
    </StyledWrapper>
  )
}
