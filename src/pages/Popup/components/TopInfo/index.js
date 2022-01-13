import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import Avatar from '../../../common/Avatar';
import { MdInfoOutline } from 'react-icons/md'
import { AiOutlineQuestionCircle, AiOutlineSetting } from 'react-icons/ai'
import { HiOutlineLogout } from 'react-icons/hi'
import NewWindow from './NewWindow'
import Triangle from '../Triangle'
import EVENTS from '../../../common/events'
const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:16px ;
  border-bottom: 1px solid rgba(0,0,0,.08);
  z-index: 999;
  .info{
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap:10px ;
    .avator{
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 4px 8px;
      border-radius: 16px;
      &:hover{
        background: var(--userinfo-hover-bg);
      }
    }
    .droplist{
      list-style: none;
      position: absolute;
      left: 0;
      top:26px;
      background-color:var(--dropdown-bg-color);
      box-shadow: var(--dropdown-shadow);
      border:var(--box-border);
      border-radius: 8px;
      padding: 0 0 8px 0;
      .info{
        display: flex;
        justify-content: space-between;
        padding:8px 14px;
        border-bottom: var(--box-border);
        .username{
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          color: var(--option-item-color);
        }
        .pro{
          padding:3px 4px;
          font-weight: bold;
          font-size: 8px;
          line-height: 6px;
          color: #52E9FB;
          border: 1px solid #52E9FB;
          border-radius: 20px;
        }
        .upgrade{
          color: #52E9FB;
          cursor:pointer;
          background:none;
          border:none;
          font-weight: 600;
          font-size: 10px;
          line-height: 6px;
          &:hover{
            color:#56CCDA;
          }
        }
      }
      .item{
        min-width: 130px;
        display: flex;
        align-items: center;
        gap:5px;
        margin: 0 8px;
        padding: 8px 11px;
        color:var(--option-item-color);
        border-radius: 5px;
        white-space: nowrap;
        a{
          width: 100%;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        &:hover{
          background-color:var(--option-item-bg-hover-color);
        }
        &.first{
          margin-top: 5px;
        }
      }
    }
  }
`;

export default function UserInfo({ user, logout }) {
  const node = useRef(null)
  const [droplistVisible, setDroplistVisible] = useState(false)
  const handleLogout = () => {
    logout()
  }
  const toggleDropListVisible = () => {
    setDroplistVisible(prev => !prev)
  }
  const handleClickOutside = e => {
    console.log("clicking anywhere");
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setDroplistVisible(false);
  };
  const handleUpgrade = () => {
    sendMessageToBackground({ url: `https://webrow.se/pricing` }, MessageLocation.Popup, EVENTS.NEW_ACTIVE_WINDOW)
  }
  const handleOpenSettingPage = () => {
    chrome.runtime.openOptionsPage()
  }
  useEffect(() => {
    if (droplistVisible) {
      document.addEventListener('mouseup', handleClickOutside, false);
    } else {
      document.removeEventListener('mouseup', handleClickOutside, false);
    }
  }, [droplistVisible]);
  if (!user) return null;
  const { id, username, photo, level = 0 } = user;
  return (
    <StyledWrapper>
      <div className="info" ref={node} data-id={id} onClick={toggleDropListVisible}>
        <div className="avator">
          <Avatar photo={photo} username={username} alt="user avator" border="none" />
          <Triangle direction="down" />
        </div>
        {droplistVisible && <ul className="droplist">
          <li className="info">
            <span className="username">{username}</span>
            {level == 1 ? <span className="pro">PRO</span> : <button onClick={handleUpgrade} className="upgrade">Upgrade</button>}
          </li>
          <li className="item first" onClick={handleOpenSettingPage}>
            <AiOutlineSetting size={14} />
            <a href="#" >{chrome.i18n.getMessage('setting')}</a>
          </li>
          <li className="item">
            <a href="http://webrow.se" target="_blank" rel="noopener noreferrer">
              <MdInfoOutline size={14} />
              {chrome.i18n.getMessage('about')}
            </a>
          </li>
          <li className="item">
            <a href="http://webrow.se/pricing/#faq" target="_blank" rel="noopener noreferrer">
              <AiOutlineQuestionCircle size={14} />
              FAQ
            </a>
          </li>
          <li className="item" onClick={handleLogout}>
            <HiOutlineLogout size={14} />
            <span>{chrome.i18n.getMessage('signout')}</span>
          </li>
        </ul>}
      </div>
      <NewWindow uid={user.uid} />
    </StyledWrapper>
  )
}
