import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
// import StyledBlock from './StyledBlock'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../../common'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  .block{
    position: relative;
    width: 100%;
    width:-webkit-fill-available;
    margin:0;
    .start{
      margin: 0 auto;
      display: block;
      cursor: pointer;
      align-self: center;
      font-weight: 600;
      font-size: 14px;
      line-height: 14px;
      border:none;
      color:#fff;
      padding:9px 16px;
      background: linear-gradient(271.12deg, #056CF2 0.35%, #74D6D7 95.13%);
      border-radius: 20px;
    }
    .opts{
      margin: 0;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background: #FFFFFF;
      box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2), 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
      border-radius: 8px;
      padding:10px 0;
      display: flex;
      list-style: none;
      flex-direction: column;
      align-items: flex-start;
      .opt{
        color: #001529B2;
        box-sizing: border-box;
        cursor: pointer;
        width: 226px;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        padding:8px 0 8px 48px;
        background-repeat: no-repeat;
        background-size: 20px;
        background-position: 14px 8px;
        &.new{
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/add.svg`});
        }
        &.cur{
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/copy.svg`});
        }
        &:hover{
          background-color:#E8F2FF ;
        }
      }
    }
  }
`;
export default function NewWindow() {
  const [subMenuVisible, setSubMenuVisible] = useState(false);
  const node = useRef(null)
  const showSubMenu = () => {
    setSubMenuVisible(true)
  }
  const handleNewBrowsing = (evt) => {
    const { type } = evt.currentTarget.dataset;
    switch (type) {
      case 'new':
        sendMessageToBackground({ currentWindow: false }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
        break;

      case 'current':
        sendMessageToBackground({ currentWindow: true }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
        break;

      default:
        break;
    }

  }
  const handleClickOutside = e => {
    console.log("clicking anywhere");
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setSubMenuVisible(false);
  };
  useEffect(() => {
    if (subMenuVisible) {
      document.addEventListener('mouseup', handleClickOutside, false);
    } else {
      document.removeEventListener('mouseup', handleClickOutside, false);
    }
  }, [subMenuVisible]);
  return (
    <StyledWrapper>
      <div className="block" ref={node}>
        <button onClick={showSubMenu} className="start">New Cobrowsing Session</button>
        {subMenuVisible && <ul className="opts" >
          <li className="opt new" data-type="new" onClick={handleNewBrowsing}>New Window</li>
          <li className="opt cur" data-type="current" onClick={handleNewBrowsing}>Current Window</li>
        </ul>}
      </div>
    </StyledWrapper>
  )
}
