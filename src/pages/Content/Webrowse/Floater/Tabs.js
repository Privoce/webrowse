import { useEffect } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import StyledBlock from './StyledBlock';
import Avator from './Avator'
import { EVENTS } from '../../../../common'
const StyledWrapper = styled(StyledBlock)`
    padding:12px 0;
    background:var(--tab-status-bg-color);
    .tabs{
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 70vh;
      overflow: scroll;
      width: -webkit-fill-available;
      margin:0;
      padding:16px;
      .tab{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:11px 12px;
        border-radius: 8px;
        background-color: var(--tab-bg-color);
        cursor:pointer;
        &:hover{
          background-color: var(--tab-hover-bg-color);
        }
        &.host{
          position:relative;
          box-shadow: inset 0 0 0px 2px #68d6dd;
          &:after{
            content:attr(data-host);
            font-size:8px;
            color:#fff;
            background:#68D6DD;
            padding:2px 4px;
            position:absolute;
            top:0;
            right:0;
            border-top-right-radius: 8px;
          }
        }
        .ico{
          display: flex;
          width: -webkit-fill-available;
          max-width: 24px;
          height: 24px;
          border-radius: 5px;
          margin-right: 8px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .title{
          width: -webkit-fill-available;
          text-align: left;
          font-size: 14px;
          color:var(--font-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .members{
          display: flex;
          gap: 4px;
          .head{
            display: flex;
            position: relative;
            .username{
              color: #fff;
              display: none;
              position: absolute;
              left:50%;
              bottom:-20px;
              transform: translateX(-50%);
              padding:2px 4px;
              background: #000;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              border-radius: 5px;
              font-weight: 600;
              font-size: 10px;
              line-height: 13px;
            }
            &:hover .username{
              display: inline-block;
            }
          }
        }
      }
  }
`;
export default function Tabs({ tabs, users, closeBlock }) {
  const handleTabClick = (evt) => {
    const { tabId } = evt.currentTarget.dataset;
    console.log({ tabId, evt });
    sendMessageToBackground({ tabId }, MessageLocation.Content, EVENTS.JUMP_TAB)
  }
  useEffect(() => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.UPDATE_TABS)
  }, [])
  console.log('tabs users', { users });
  return (
    <StyledWrapper >
      <div className="close" data-type='tab' onClick={closeBlock}></div>
      <div className="title">Tab Status</div>
      <ul className="tabs">
        {tabs.filter(t => t.url.startsWith('http')).map(tab => {
          const { id, title, favIconUrl, index } = tab;
          const activeUsers = users.filter(u => u.activeIndex == index);
          const host = activeUsers.find(u => u.host);
          return <li key={id} data-tab-id={id} onClick={handleTabClick} data-host={host?.username} className={`tab ${host ? 'host' : ''}`} title={title}>
            <div className="ico">
              <img src={favIconUrl || `chrome-extension://${chrome.runtime.id}/assets/icon/tab.svg`} alt="favicon" />
            </div>
            <span className="title">{title}</span>
            <div className="members">
              {activeUsers.map(u => {
                const { username = '', photo = '', id } = u;
                return <div className="head" key={id}>
                  <Avator photo={photo} username={username} alt="member head" />
                  <span className="username">{username}</span>
                </div>
              })}
            </div>
          </li>
        })}
      </ul>
    </StyledWrapper>
  )
}
