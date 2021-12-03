import React from 'react'
import styled from 'styled-components';
const StyledList = styled.ul`
  margin: 0;
  padding: 0 12px;
  list-style: none;
  display: none;
  flex-direction: column;
  gap: 6px;
  margin-left: 16px;
  overflow: scroll;
  &.empty{
    display: none !important;
  }
  .tab{
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    img{
      width:16px;
      height:16px;
    }
    .con{
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 280px;
      overflow: hidden;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
      color: var(--tab-title-color);
    }
    &:hover .con{
      color: var(--tab-title-hover-color);
    }
  }
`;
export default function TabList({ tabs = null, handleJumpTab }) {

  if (!tabs || tabs.length == 0) return null;
  return (
    <StyledList className={`tabs ${tabs.length == 0 ? 'empty' : ''}`}>
      {tabs.map(({ id, url, title, icon, windowId = '' }) => {
        return <li onClick={handleJumpTab} data-url={url} data-window-id={windowId} data-tab-id={id} key={id} title={title} className="tab">
          <img src={icon || "https://files.authing.co/authing-console/default-user-avatar.png"} alt="favicon" />
          <span className="con">{title}</span>
        </li>
      })}
    </StyledList>
  )
}
