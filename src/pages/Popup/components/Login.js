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
    color: #000;
    padding-left: 40px;
    background-image: url('https://static.nicegoodthings.com/works/vera/webrowse.logo.png');
    background-size: 32px 30px;
    background-repeat: no-repeat;
    background-position: 0;
  }
  .desc{
    font-size: 16px;
    line-height: 22px;
    color:#616161;
    max-width: 268px;
  }
  .login{
    cursor: pointer;
    color:#fff;
    border:none;
    background: #056CF2;
    border-radius: 10px;
    padding:8px 16px;
    font-size: 16px;
    line-height: 22px;
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
