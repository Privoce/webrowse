import { useState, useEffect } from 'react'
import styled from 'styled-components';
import { RiErrorWarningLine } from 'react-icons/ri'
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import EVENTS from '../../common/events'
import { AniBounceIn } from '../../common/animates'
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
  .modal {
    width: 392px;
    position: relative;
    margin-top: -30px;
    background: var(--list-bg-color);
    box-shadow: 0px 8px 24px -8px var(--shadow-color);
    border-radius: 12px;
    padding:24px 16px;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${AniBounceIn} 1s both;
    .icon{
      margin-bottom: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #FEE4E2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title{
      margin: 0;
      color:var(--modal-title-color);
      font-weight: 600;
      font-size: 18px;
      line-height: 28px;
    }
    .content{
      margin: 8px 0 35px 0;
      font-size: 14px;
      line-height: 20px;
      color: var(--modal-content-color);
      text-align: center;
    }
    .btns{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn{
        background: #52E9FB;
        border-radius: 20px;
        font-weight: bold;
        font-size: 12px;
        line-height: 18px;
        color: #FFFFFF;
        padding:4px 12px;
        &.ghost{
          font-weight: 200;
          background: none;
          color:#667085;
          border:none;
        }
      }
    }
  }
`;
export default function TabLimitTipModal({ user, closeModal }) {
  const [modalType, setModalType] = useState(null);
  useEffect(() => {
    console.log({ user });
    if (user?.uid) {
      setModalType('logined');
    } else {
      setModalType('guest');
    }
  }, [user]);
  const handleOpenNewWindow = (url) => {
    sendMessageToBackground({ url }, MessageLocation.Content, EVENTS.NEW_ACTIVE_WINDOW)
  }
  if (!modalType) return null;
  console.log({ user });
  return (
    <StyledModal>
      <div className="modal">
        <div className="icon">
          <RiErrorWarningLine color="#D92D20" size={21} />
        </div>
        <h3 className="title">Can not open new Tab</h3>
        <div className={`content ${modalType}`}>
          You have reach the limit tabs (10 tabs), remove some tabs or upgrade your plan.
        </div>
        <div className="btns">
          <button onClick={closeModal} className="btn ghost">Dismiss</button>
          <div className="group">
            <button onClick={handleOpenNewWindow.bind(null, `https://webrow.se/pricing`)} className="btn ghost">View Plans</button>
            <button className="btn" onClick={handleOpenNewWindow.bind(null, `https://webrow.se/pricing`)}>Upgrade</button>
          </div>
        </div>
      </div>
    </StyledModal>
  )
}
