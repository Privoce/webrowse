import React from "react";
import styled from "styled-components";

import Login from "./Login";
import useLocalUser from "../useLocalUser";
const StyledProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .item {
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    .title {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #44494f;
    }
    .img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .name {
      padding: 10px 16px;
      background: #ebebec;
      color: #a0a2a5;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      border-radius: 6px;
      border: none;
      outline: none;
    }
    .tip {
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      color: #a0a2a5;
      em {
        font-style: normal;
        color: #333;
      }
    }
  }
  .btn {
    cursor: pointer;
    border-radius: 20px;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 4px 12px;
    text-decoration: none;
    border: none;
    outline: none;
    &.update {
      background: #52e9fb;
      margin-bottom: 48px;
    }
    &.logout {
      background: #e42222;
      &:hover {
        background: #ba1b1b;
      }
    }
  }
`;
export default function Profile({ user }) {
  const { user: localUser } = useLocalUser();
  const handleLogout = () => {
    chrome.storage.sync.remove("user");
  };
  if (!user || !localUser) return <Login />;
  console.log("user", user);
  const isGoogle = localUser.registerSource?.length
    ? localUser.registerSource.includes("social:google")
    : false;

  return (
    <StyledProfile>
      <div className="item">
        <div className="title">Avatar</div>
        <img src={user.avatar} alt="avatar" className="img" />
      </div>
      <div className="item">
        <div className="title">Name</div>
        <input readOnly className="name" value={user.username} />
      </div>
      <a
        href="https://webrowse.authing.cn/u"
        target="_blank"
        className="btn update"
      >
        Edit
      </a>
      <div className="item">
        {isGoogle && (
          <>
            <div className="title">Authentication</div>
            <span className="tip">
              Your Google account is connected with <em>{user.email}</em>
            </span>
          </>
        )}
        <button onClick={handleLogout} className="btn logout">
          Log Out
        </button>
      </div>
    </StyledProfile>
  );
}
