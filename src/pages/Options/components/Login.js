import React from 'react'
import styled from 'styled-components';
import { sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import EVENTS from '../../common/events'
const StyledWrapper = styled.div`
  padding:20px 0;
  .btn{
    cursor:pointer;
    border-radius: 20px;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 4px 12px;
    text-decoration: none;
    border: none;
    outline: none;
    background: #52E9FB;
  }
`;
export default function Login() {
  const handleLogin = () => {
    sendMessageToBackground({}, MessageLocation.Options, EVENTS.LOGIN)
  }
  return (
    <StyledWrapper>
      <button className='btn' onClick={handleLogin}>Login</button>
    </StyledWrapper>
  )
}
