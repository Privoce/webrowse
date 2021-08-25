import React from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  padding:16px 24px;
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
    padding:10px 12px;
    background:#fff;
    border-radius: 15px;
    .title{
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      .arrow{
        width:20px;
        height:20px;
        border-radius: 50%;
        background:#EAEAEA;
      }
      .con{
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        color: #000;
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
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-left: 2px solid #EAEAEA;
      padding-left: 12px;
      margin-left: 28px;
      .tab{
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 300px;
        overflow: hidden;
        cursor: pointer;
        img{
          width:24px;
          height:24px;
        }
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        line-height: 18px;
        color: #000000;
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
export default function WindowList({ windows = [] }) {
  console.log("window list", windows);
  const handleJumpTab = ({ currentTarget }) => {
    const { tabId, windowId } = currentTarget.dataset;
    sendMessageToBackground({ tabId, windowId }, MessageLocation.Popup, EVENTS.JUMP_TAB)
  }
  if (!windows || windows.length == 0) return null;
  return (
    <StyledWrapper>
      <h2 className="title">Active Windows</h2>
      {windows.map(({ roomId, roomName, tabs }) => {

        return <div key={roomId} className="window">
          <h3 className="title">
            <div className={`arrow`}></div>
            <span className="con">
              {roomName}
            </span>
            <span className="num">{tabs.length} tabs</span></h3>
          <ul className="tabs">
            {tabs.map(({ id, title, favIconUrl, windowId }) => {
              return <li onClick={handleJumpTab} data-window-id={windowId} data-tab-id={id} key={id} title={title} className="tab">
                <img src={favIconUrl || "https://files.authing.co/authing-console/default-user-avatar.png"} alt="favicon" />
                {title}
              </li>
            })}
          </ul>
        </div>
      })}
    </StyledWrapper>
  )
}
