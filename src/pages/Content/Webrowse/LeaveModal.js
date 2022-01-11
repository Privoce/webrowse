import { useState, useEffect } from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import EVENTS from '../../common/events'
import IconClose from './icons/Close';
import { TiWarningOutline } from 'react-icons/ti'
import { useWindow } from '../../common/hooks';
import { getWindowTabs, getWindowTitle } from '../../common/utils'
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
    .close{
      cursor: pointer;
      position: absolute;
      top:16px;
      right:24px;
      width: 12px;
      height: 12px;
    }
    .icon{
      margin-bottom: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #FEF0C7;
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
          background: none;
          color:#667085;
          border:none;
        }
      }
    }
  }
`;
const Title = {
  logined: chrome.i18n.getMessage('save_later'),
  guest: "Want to save this window?"
};
const Content = {
  logined: chrome.i18n.getMessage('save_later_tip'),
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
export default function LeaveModal({ winId = "", endAll = false, user, closeModal }) {
  const { saveWindow, saving } = useWindow(user?.uid)
  const [modalType, setModalType] = useState(null);
  useEffect(() => {
    console.log({ user });
    if (user?.uid) {
      setModalType('logined');
    } else {
      setModalType('guest');
    }
  }, [user])
  const handleSignup = () => {
    sendMessageToBackground({ scene: 'register' }, MessageLocation.Content, EVENTS.LOGIN);
  }
  const handleQuit = async (keepTabs) => {
    console.log("click quit", { keepTabs, endAll });
    if (keepTabs) {
      const tabs = await getWindowTabs();
      const title = await getWindowTitle() || 'Temporary Window';
      console.log("tab list", tabs);
      await saveWindow({ id: winId, title, tabs })
    }
    sendMessageToBackground({ endAll }, MessageLocation.Content, EVENTS.DISCONNECT_SOCKET);
    closeModal();
  }
  if (!modalType) return null;
  console.log({ winId, user });
  return (
    <StyledModal>
      <div className="modal">
        <div className="close" onClick={closeModal}>
          <IconClose color="#333" />
        </div>
        <div className="icon">
          <TiWarningOutline color="#DC6803" size={21} />
        </div>
        <h3 className="title">{Title[modalType]}</h3>
        <div className={`content ${modalType}`}>
          {Content[modalType]}
        </div>
        <div className="btns">
          <button onClick={handleQuit.bind(null, false)} className="btn ghost">{chrome.i18n.getMessage('quit')}</button>
          {modalType == 'logined' ?
            <button disabled={saving} onClick={handleQuit.bind(null, true)} className="btn">
              {saving ? `Saving` : chrome.i18n.getMessage('save')}
            </button> :
            <button onClick={handleSignup} className="btn">
              {chrome.i18n.getMessage('signup')}
            </button>}
        </div>
      </div>
    </StyledModal>
  )
}
