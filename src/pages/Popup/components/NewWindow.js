import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components';
// import StyledBlock from './StyledBlock'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding:16px 24px;
  .block{
    position: relative;
    width: 100%;
    width:-webkit-fill-available;
    margin:12px 14px;
    .start{
      margin: 0 auto;
      display: block;
      cursor: pointer;
      align-self: center;
      font-size: 14px;
      line-height: 22px;
      border:none;
      color:#fff;
      padding:8px 16px;
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
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      padding:10px 0;
      display: flex;
      list-style: none;
      flex-direction: column;
      align-items: flex-start;
      .opt{
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
        sendMessageToBackground({ newWindow: true }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
        break;

      case 'current':
        sendMessageToBackground({ newWindow: false }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
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
        <button onClick={showSubMenu} className="start">Start a New Cobrowsing Session</button>
        {subMenuVisible && <ul className="opts" >
          <li className="opt new" data-type="new" onClick={handleNewBrowsing}>New Window</li>
          <li className="opt cur" data-type="current" onClick={handleNewBrowsing}>Current Window</li>
        </ul>}
      </div>
    </StyledWrapper>
  )
}
