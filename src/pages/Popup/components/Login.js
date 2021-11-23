import React from 'react';
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../common'

const StyledWrapper = styled.div`
    min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding:16px;
  .title{
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    color: var(--window-title-color);
    padding-left: 40px;
    background-image: url('https://static.nicegoodthings.com/project/ext/webrowse.logo.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 0;
  }

  .desc{
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color:#616161;
    max-width: 237px;
  }
  .login{
    cursor: pointer;
    color:#fff;
    border:none;
    background: #52EDFF;
    border-radius: 15px;
    padding:4px 12px;
    font-size: 12px;
    line-height: 16px;
  }
`;
export default function Login() {
  const handleLogin = () => {
    sendMessageToBackground({}, MessageLocation.Popup, EVENTS.LOGIN)
  }
  return (
    <StyledWrapper>
      <h2 className="title">Webrowse</h2>
      <p className="desc">Log in to Webrowse to cobrowse any websites with your teammates!</p>
      <button onClick={handleLogin} className="login">Log in</button>
    </StyledWrapper>
  )
}
