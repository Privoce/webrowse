// import { useState } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'

import IconClose from './icons/Close';
const StyledModal = styled.section`
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2,2,2,.6);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal{
    position: relative;
    margin-top: -30px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    padding:52px 40px 32px 40px;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    .close{
      cursor: pointer;
      position: absolute;
      top:16px;
      right:24px;
      width: 12px;
      height: 12px;
    }
    .title{
      font-weight: bold;
      font-size: 20px;
      line-height: 25px;
    }
    .content{
      margin: 12px 0 24px 0;
      font-size: 16px;
      line-height: 28px;
      color: #121212;
      text-align: left;
      &.guest ul{
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        li{
          position: relative;
          padding-left:20px ;
          &:before{
            content: "·";
            font-size: 50px;
            position: absolute;
            left: -5px;
          }
        }
      }
    }
    .btns{
      display: flex;
      align-items: center;
      gap: 20px;
      .btn{
        background: #056CF2;
        border-radius: 10px;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        color: #FFFFFF;
        padding:8px 20px;
        &.ghost{
          background: none;
          color:#056CF2;
          border:2px solid #056CF2;
        }
      }
    }
  }
`;
const Title = {
  creator: 'Save It for Later',
  guest: "Want to save this window?"
};
const Content = {
  creator: 'Would you like to save this window so you can cobrowse it again?',
  guest: <>
    <div>By signing up, you can:</div>
    <ul>
      <li>
        Save the window to cobrowse later
      </li>
      <li>
        Start your own cobrowse session
      </li>
    </ul>
  </>
}
export default function LeaveModal({ user = null, closeModal, type = 'guest' }) {
  const handleSave = () => {
    sendMessageToBackground({ keepTabs: true }, MessageLocation.Content, EVENTS.DISCONNECT_SOCKET);
    closeModal()
  }
  const handleSignup = () => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.LOGIN)
  }
  const handleQuit = () => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.DISCONNECT_SOCKET);
    closeModal()

  }

  // const handleStart = () => {
  //   chrome.storage.sync.set({ fakename: input }, () => {
  //     startCoBrowse(input)
  //   })
  // }
  const handleClose = () => {
    // to do
    closeModal()
  }
  return (
    <StyledModal>
      <div className="modal">
        <div className="close" onClick={handleClose}>
          <IconClose color="#333" />
        </div>
        <h3 className="title">{Title[type]}</h3>
        <div className={`content ${type}`}>
          {Content[type]}
        </div>
        <div className="btns">
          {(user && user.uid) ? <button onClick={handleSave} className="btn">Save</button> : <button onClick={handleSignup} className="btn">Sign Up</button>}
          <button onClick={handleQuit} className="btn ghost">Quit</button>
        </div>
      </div>
    </StyledModal>
  )
}
