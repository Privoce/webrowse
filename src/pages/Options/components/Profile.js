import React from 'react'
import styled from 'styled-components';

import Login from './Login'
import useLocalUser from '../useLocalUser'
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
  const { user } = useLocalUser();
  const handleLogout = () => {
    chrome.storage.sync.remove('user')
  }
  if (!user) return <Login />;
  console.log("user", user);
  const isGoogle = user.registerSource?.length ? user.registerSource.includes("social:google") : false

  return (
    <StyledProfile>
      <div className="item">
        <div className="title">Avatar</div>
        <img src={user.photo} alt="avatar" className="img" />
      </div>
      <div className="item">
        <div className="title">Name</div>
        <input readOnly className="name" value={user.username} />
      </div>
      <a href="https://portal-china.authing.cn/u" target="_blank" className="btn update">Update</a>
      <div className="item">
        {isGoogle && <>
          <div className="title">Authentication</div>
          <span className="tip">Your Google account is connected with <em>{user.email}</em></span>
        </>
        }
        <button onClick={handleLogout} className="btn logout">Log Out</button>
      </div>
    </StyledProfile>
  )
}
