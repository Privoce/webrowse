import React from 'react'
import styled from 'styled-components';
import Avatar from './Avatar'
const StyledWrapper = styled.div`
      display: flex;
      align-items: center;
      .head{
        display: flex;
        position: relative;
        margin-left: -4px;
        .username{
          color: #fff;
          display: none;
          position: absolute;
          left:50%;
          top:24px;
          transform: translateX(-50%);
          padding:2px 4px;
          background: #000;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 5px;
          font-weight: 600;
          font-size: 10px;
          line-height: 13px;
        }
        &:hover .username{
          display: inline-block;
        }
      }
      .more{
        position: relative;
        .tip{
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 10px;
          line-height: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #FFBD2E;
          color: #fff;
          margin-left: -4px;
        }
        .pop{
          z-index: 80;
          display: none;
          max-width: 120px;
          background-color: var(--webrowse-widget-bg-color);
          position: absolute;
          right: 0;
          bottom: 50%;
          padding: 8px;
          box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2), 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
          border-radius: 8px;
          transform: translateY(50%);
          .items{
            padding:0;
            list-style: none;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            .item{
              display: flex;
              position: relative;
              .username{
                white-space: nowrap;
                color: #fff;
                display: none;
                position: absolute;
                left:50%;
                bottom:20px;
                transform: translateX(-50%);
                padding:2px 4px;
                background: #000;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 5px;
                font-weight: 600;
                font-size: 10px;
                line-height: 13px;
              }
              &:hover .username{
                display: inline-block;
              }
            }
          }
        }
        &.pop .pop{
          display: flex;
        }
      }
`;

export default function AvatarList({ users = null, limit = 5 }) {
  const handleMoreMouseOver = (evt) => {
    evt.currentTarget.classList.add('pop');
  }
  const handleMoreMouseLeave = (evt) => {
    evt.currentTarget.classList.remove('pop');
  }
  if (!users || users.length == 0) return null;
  const lastMembers = users.splice(users.length > limit ? (limit - 1) : limit);
  return (
    <StyledWrapper className="members">
      {users.map((u, i) => {
        const { username = '', photo = '', id } = u;
        return <div className="head" style={{ zIndex: users.length - i }} key={id}>
          <Avatar photo={photo} username={username} alt="member head" />
          <span className="username">{username}</span>
        </div>
      })}
      {lastMembers.length ? <div className="more" onMouseOver={handleMoreMouseOver} onMouseLeave={handleMoreMouseLeave}>
        <div className="tip">
          +{lastMembers.length}
        </div>
        <div className="pop">
          <ul className="items">
            {lastMembers.map(u => {
              const { username = '', photo = '', id } = u;
              return <li className="item" key={id}>
                <Avatar photo={photo} username={username} alt="member head" />
                <span className="username">{username}</span>
              </li>
            })}
          </ul>
        </div>
      </div> : null}
    </StyledWrapper>
  )
}
