import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import IconClose from '../icons/Close';
import { AniBounceIn } from '../../../common/animates'
const StyledWrapper = styled.div`
  position: absolute;
  top:35%;
  left:50%;
  margin-left: -190px;
  pointer-events: all;
  font-family: sans-serif;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding:45px 50px 42px 50px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  box-sizing: border-box;
  width: 380px;
  animation: ${AniBounceIn} 1s both;
  .close{
      cursor: pointer;
      position: absolute;
      top:16px;
      right:24px;
      width: 12px;
      height: 12px;
    }
  >.title{
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    color: #056CF2;
    margin-bottom: 20px;
  }
  .details{
    color: #333;
    display: flex;
    flex-direction: column;
    gap:25px;
    font-weight: normal;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 26px;
  }
  .dont{
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 20px;
    font-size: inherit;
    input{
      width: 14px;
      height: 14px;
      margin:0;
    }
    input,label{
      color: #333;
      user-select: none;
      cursor: pointer;
    }
  }
`;
export default function FollowModeTipModal({ closeModal }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    chrome.storage.sync.get(['disable_follow_tip_modal'], ({ disable_follow_tip_modal = false }) => {
      setVisible(!disable_follow_tip_modal)
    })
  }, [])
  const handleChange = (evt) => {
    let ckd = evt.target.checked;
    console.log("ckd", ckd);
    if (ckd) {
      chrome.storage.sync.set({ disable_follow_tip_modal: true })
    } else {
      chrome.storage.sync.remove('disable_follow_tip_modal')
    }
  }
  const handleClose = () => {
    closeModal()
  }
  if (!visible) return null;
  return (
    <StyledWrapper>
      <div className="close" onClick={handleClose}>
        <IconClose color="#333" />
      </div>
      <h3 className="title">You’re on Follow Mode</h3>
      <div className="details">
        <p>Follow mode automatically keeps you on the host’s active tab.</p>
        <p>To view tabs by yourself, click on “Stop Following” on the top bar.</p>
      </div>
      <div className="dont">
        <input type="checkbox" onChange={handleChange} name="dont" id="dont" />
        <label htmlFor="dont">Don’t show me this again</label>
      </div>
    </StyledWrapper>
  )
}
