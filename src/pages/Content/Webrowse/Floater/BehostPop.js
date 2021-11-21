import { useState } from 'react'
import styled, { keyframes } from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../../common'
const AniPopup = keyframes`
  from{
    transform: translateY(0);
  }
  to{
    transform: translateY(-110%);
  }
`;
const StyledWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    width: 380px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    padding:12px 16px;
    animation:${AniPopup} .5s forwards;
    .desc{
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }
    >.opts{
      display: flex;
      justify-content: space-between;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
      color: #000000CC;
      label {
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        input{
          cursor: pointer;
          margin-right: 5px;
        }
      }
      .btns{
        cursor: pointer;
        display: flex;
        align-items: center;
        .btn{
          color: inherit;
          border-radius: 15px;
          background: none;
          padding: 4px 12px;
          &.yes{
            background: #52EDFF;
            color: #fff;
          }

        }
      }
    }
`;
export default function BehostPop({ handleCancelHostPop }) {
  const [askChecked, setAskChecked] = useState(false)
  const handleBecomeHost = () => {
    sendMessageToBackground({
      data: {
        cmd: EVENTS.BE_HOST,
        payload: {
          enable: true
        }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    if (askChecked) {
      chrome.storage.sync.set({ 'BECOME_HOST_ASK': true })
    }
    handleCancelHostPop();
  }
  const handleAskChange = ({ target }) => {
    setAskChecked(target.checked)
  }
  return (
    <StyledWrapper className="host_pop">
      <p className="desc">You will take over as host, people will follow your browser windows, continue?</p>
      <div className="opts">
        <label htmlFor="naa"><input onChange={handleAskChange} value={askChecked} type="checkbox" name="naa" id="naa" />Never ask again</label>
        <div className="btns">
          <button onClick={handleCancelHostPop} className="btn cancel">Cancel</button>
          <button onClick={handleBecomeHost} className="btn yes">Yes</button>
        </div>
      </div>
    </StyledWrapper>
  )
}
