import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import Avatar from '../../../common/Avatar';
import { MdInfoOutline } from 'react-icons/md'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { HiOutlineLogout } from 'react-icons/hi'
import NewWindow from './NewWindow'
import Triangle from '../Triangle'
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
        background: rgba(0, 0, 0, 0.08);
      }
      @media (prefers-color-scheme: dark) {
        &:hover{
          background: rgba(255, 255, 255, 0.08);
        }
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
          text-decoration: none;
          color: inherit;
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
            {level == 1 && <span className="pro">PRO</span>}
          </li>
          <li className="item first">
            <MdInfoOutline size={14} />
            <a href="http://webrow.se" target="_blank" rel="noopener noreferrer">About</a>
          </li>
          <li className="item">
            <AiOutlineQuestionCircle size={14} />
            <a href="http://webrow.se" target="_blank" rel="noopener noreferrer">FAQ</a>
          </li>
          <li className="item" onClick={handleLogout}>
            <HiOutlineLogout size={14} />
            <span>Sign Out</span>
          </li>
        </ul>}
      </div>
      <NewWindow uid={user.uid} />
    </StyledWrapper>
  )
}
