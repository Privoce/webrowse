import React from 'react'
import styled from 'styled-components';
const StyledProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .item{
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    .title{
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #44494F;
    }
    .img{
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .name{
      padding: 10px 16px;
      background: #EBEBEC;
      color: #A0A2A5;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      border-radius: 6px;
      border: none;
      outline: none;
    }
    .tip{
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      color: #A0A2A5;
      em{
        font-style: normal;
        color: #333;
      }
    }
  }
  .btn{
    border-radius: 20px;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 4px 12px;
    text-decoration: none;
    border: none;
    outline: none;
    &.update{
      background: #52E9FB;
      margin-bottom: 48px;
    }
    &.logout{
      background: #E42222;
    }
  }
`;
export default function Profile() {
  return (
    <StyledProfile>
      <div className="item">
        <div className="title">Avatar</div>
        <img src="https://static.nicegoodthings.com/project/ext/webrowse.logo.png" alt="avatar" className="img" />
      </div>
      <div className="item">
        <div className="title">Name</div>
        <input readOnly className="name" value="dingyi" />
      </div>
      <a href="#" className="btn update">Update</a>
      <div className="item">
        <div className="title">Authentication</div>
        <span className="tip">Your Google account is connected with <em>dingyi@privoce.com</em></span>
        <button className="btn logout">Log Out</button>
      </div>

    </StyledProfile>
  )
}
