import { useState } from 'react'
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
  >.title{
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    color: #121212;
  }
  .block{
    width: 100%;
    width:-webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap:12px;
    background: #fff;
    border-radius: 5px;
    padding:12px 14px;
    .dup{
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      font-size: 14px;
      color:#3B4256;
      line-height: 140%;
      gap:10px;
      .check{
        cursor: pointer;
      }
    }
    .start{
      cursor: pointer;
      align-self: center;
      font-size: 14px;
      line-height: 22px;
      border:none;
      color:#fff;
      background: #056CF2;
      border-radius: 20px;
      padding:8px 14px 8px 42px;
      background-size: 22px;
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/add.svg`});
      background-repeat: no-repeat;
      background-position: 14px 8px;
    }
  }
`;
export default function NewWindow() {
  const [dupChecked, setDupChecked] = useState(false);
  const toggleDupCheckChange = () => {
    setDupChecked(prev => !prev)
  }
  const handleNewBrowsing = () => {
    sendMessageToBackground({ currentTab: dupChecked }, MessageLocation.Popup, EVENTS.NEW_WINDOW)
  }
  return (
    <StyledWrapper>
      <h2 className="title">New Window</h2>
      <div className="block">
        <div className="dup" onClick={toggleDupCheckChange}>
          <input className="check" readOnly checked={dupChecked} type="checkbox" name="dup" id="dup" />
          <span>
            Duplicate tabs in current window
          </span>
        </div>
        <button onClick={handleNewBrowsing} className="start">Start Cobrowsing</button>
      </div>
    </StyledWrapper>
  )
}
