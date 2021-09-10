import React from 'react'
import styled from 'styled-components';
import Avator from './Avator'
const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:16px 24px;
  border-bottom: 1px solid #C4C4C4;
  .info{
    display: flex;
    align-items: center;
    gap:10px ;
    .avator{
      width:36px;
      height:36px;
      border-radius: 50%;
      border:2px solid #68D6DD;
      padding:2px;
    }
    .username{
      color:#000;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .logout{
    cursor: pointer;
    background:none;
    border-radius: 15px;
    border:1px solid #616161;
    color:#616161;
    padding:2px 15px;
    font-size: 12px;
    line-height: 22px;
  }
`;

export default function UserInfo({ user, logout }) {
  const handleLogout = () => {
    logout()
  }
  if (!user) return null;
  const { id, username, photo } = user;
  return (
    <StyledWrapper>
      <div className="info" data-id={id}>
        <div className="avator">
          <Avator photo={photo} username={username} alt="user avator" />
        </div>
        <span className="username">{username}</span>
      </div>
      <button onClick={handleLogout} className="logout">Log out</button>
    </StyledWrapper>
  )
}
