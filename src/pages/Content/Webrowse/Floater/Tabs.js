import { useEffect } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import StyledBlock from './StyledBlock';
import Avator from './Avator'
import { EVENTS } from '../../../../common'
const StyledWrapper = styled(StyledBlock)`
    background:#FFF9EB;
    >.title{
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab.svg`});
    }
    .tabs{
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 80vh;
      overflow: auto;
      width: 100%;
      padding-left: 0;
      .tab{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:11px 12px;
        border-radius: 5px;
        background-color: #fff;
        cursor:pointer;
        &:hover{
          background-color: #F1FDFF;
        }
        &.host{
          position:relative;
          border: 2px solid #68D6DD;
          &:after{
            content:attr(data-host);
            font-size:8px;
            color:#fff;
            background:#68D6DD;
            padding:2px 4px;
            position:absolute;
            top:0;
            right:0;
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
          color:#000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .members{
          display: flex;
          gap: 4px;
          .head{
            font-size: 12px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
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
                return <Avator title={username} key={id} photo={photo} letter={username[0]} alt="member head" />
              })}
            </div>
          </li>
        })}
      </ul>
    </StyledWrapper>
  )
}
