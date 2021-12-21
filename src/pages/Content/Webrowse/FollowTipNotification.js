import { useState } from 'react'
import styled from 'styled-components';
import { MessageLocation, onMessageFromBackground, sendMessageToBackground } from '@wbet/message-api'
import { IoWarningOutline } from 'react-icons/io5'
import { EVENTS } from '../../../common';
import { AniBounceIn } from '../../common/animates'

const StyledWrapper = styled.div`
    box-sizing: border-box;
    z-index: 10;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 392px;
    display: flex;
    align-items: flex-start;
    padding: 16px;
    border-radius: 8px;
    background: var(--webrowse-widget-bg-color);
    box-shadow:  0px 8px 24px -8px var(--shadow-color);
    gap: 16px;
    visibility: hidden;
    &.visible{
      animation: ${AniBounceIn} 1s both;
      visibility: visible;
      pointer-events:all;
    }
    .left{
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      padding: 10px;
      background-color: #FEF0C7;
      border-radius: 50%;
    }
    .right{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      .head{
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: var(--font-color);
        margin-bottom: 4px;
      }
      .desc{
        font-size: 14px;
        line-height: 20px;
        color: #667085;
        padding-right: 28px;
        margin-bottom: 16px;
      }
      .opts{
        width: 100%;
        display: flex;
        align-items:center;
        justify-content: space-between;
        .dismiss{
          padding:0;
          color: var(--font-color);
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          opacity: .7;
        }
        .btn{
          padding: 4px 12px;
          background: #52E9FB;
          border-radius: 20px;
        }
      }
    }
`;
export default function FollowTipNotification() {
  const [visible, setVisible] = useState(false)
  onMessageFromBackground(MessageLocation.Content, {
    [EVENTS.FOLLOW_MODE_TIP]: () => {
      console.log("show follow mode notification");
      setVisible(true)
    },
  });
  const handleDismiss = () => {
    setVisible(false)
  }
  const handleStopFollowing = () => {
    sendMessageToBackground({
      data: {
        cmd: EVENTS.FOLLOW_MODE, payload: { follow: false }
      }
    }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    setVisible(false)
  }
  return (
    <StyledWrapper className={`${visible ? 'visible' : ''} notification`}>
      <div className="left">
        <IoWarningOutline size={21} color='#B54708' />
      </div>
      <div className="right">
        <div className="head">You’re on Follow Mode</div>
        <div className="desc">Follow mode automatically keeps you on the hots’s active tab. To view tab by yourself, click on “Stop Following” on the top bar.</div>
        <div className="opts">
          <button className="dismiss" onClick={handleDismiss}>Dismiss</button>
          <button className='btn' onClick={handleStopFollowing}>Stop Following</button>
        </div>
      </div>
    </StyledWrapper>
  )
}
