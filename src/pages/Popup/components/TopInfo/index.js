import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components';
import Avator from './Avator';
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
    }
    .droplist{
      list-style: none;
      position: absolute;
      left: 0;
      top:26px;
      background-color:var(--window-bg-color);
      box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2), 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
      border-radius: 8px;
      padding: 8px;
      .item{
        display: flex;
        align-items: center;
        gap:5px;
        padding: 8px 17px;
        color:var(--option-item-color);
        border-radius: 5px;
        white-space: nowrap;
        transition: all .5s ease-in-out;
        a{
          text-decoration: none;
          color: inherit;
        }
        &:hover{
          background-color:var(--option-item-bg-hover-color);
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
  const { id, username, photo } = user;
  return (
    <StyledWrapper>
      <div className="info" ref={node} data-id={id} onClick={toggleDropListVisible}>
        <div className="avator">
          <Avator photo={photo} username={username} alt="user avator" />
          <Triangle direction="down" />
        </div>
        {droplistVisible && <ul className="droplist">
          <li className="item">
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
