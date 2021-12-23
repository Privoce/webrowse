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
  padding:32px;
  .logo{
    width: 32px;
    height: 32px;
  }
  .desc{
    text-align: center;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color:var(--window-title-color);
    max-width: 237px;
  }
  .login{
    cursor: pointer;
    color:var(--main-btn-txt-color);
    border:none;
    background: var(--main-btn-bg-color);
    border-radius: 15px;
    padding:4px 12px;
    font-size: 12px;
    line-height: 16px;
    &:hover{
      background: var(--main-btn-hover-bg-color);
    }
  }
`;
export default function Login() {
  const handleLogin = () => {
    sendMessageToBackground({}, MessageLocation.Popup, EVENTS.LOGIN)
  }
  return (
    <StyledWrapper>
      <img className="logo" src="https://static.nicegoodthings.com/project/ext/webrowse.logo.png" />
      <p className="desc">{chrome.i18n.getMessage('login_desc')}</p>
      <button onClick={handleLogin} className="login">{chrome.i18n.getMessage('login')}</button>
    </StyledWrapper>
  )
}
