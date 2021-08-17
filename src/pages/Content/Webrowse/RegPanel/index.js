import React from 'react'
import styled from 'styled-components';
import ClosePanel from '../ClosePanel'
const StyledWrapper = styled.div`
    pointer-events: all;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate3d(-50%,-50%,0);
    border-radius: var(--webrowse-panel-border-radius);
    background: radial-gradient( circle at top left, rgba(255,255,255,0.8) 20px, #ffffff90 100px ), radial-gradient( circle at top right, rgba(255,255,255,0.8) 20px, #ffffff90 104px ), radial-gradient( at bottom left, #a788f3 100px, transparent 411px ), radial-gradient( at bottom right, #8994f5 200px, transparent 400px );
    padding:74px 36px 35px 36px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    .title{
        font-weight: 800;
        font-size: 18px;
        color:var(--webrowse-theme-color);
    }
    .desc{
        margin-top: 18px;
        font-size: 14px;
        color:#000;
    }
    .btns{
        margin-top: 18px;
        display: flex;
        gap:22px;
        .btn{
            background: var(--webrowse-theme-color);
            font-size: 20px;
            color:#fff;
            padding:10px 26px;
            border-radius: var(--webrowse-border-radius);
            border: none;
            line-height: 1;
            &.ghost{
                color:var(--webrowse-theme-color);
                background: transparent;
                border:2px solid var(--webrowse-theme-color);
            }
        }
    }
`
export default function RegPanel({ closePanel }) {
  const handleLogin = () => {
    chrome.runtime.sendMessage({ action: 'LOGIN' }, function () {
      /* callback */
      console.log('send login message');
    });
  }
  return (
    <StyledWrapper>
      <ClosePanel close={closePanel} />
      <h2 className="title">Welcome to Webrowse!</h2>
      <p className="desc">To start a new meeting, please</p>
      <div className="btns">
        <button className="btn reg" onClick={handleLogin}>Sign Up</button>
        <button className="btn ghost login" onClick={handleLogin}>Log In</button>
      </div>
    </StyledWrapper>
  )
}
