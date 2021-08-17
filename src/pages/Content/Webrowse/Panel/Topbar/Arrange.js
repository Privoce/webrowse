import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import IconArrange from '../../icons/Arrange';
import IconMini from '../../icons/Mini';
const StyledWrapper = styled.div`
position: relative;
  .icons {
    display: flex;
    gap: 4px;
    .item{
      cursor: pointer;
      width: 1.8em;
      height: 1.8em;
      > svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  .list {
    z-index: 10;
    position: absolute;
    left: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    padding: 4px 10px;
    border-radius: 5px;
    background-color: var(--webrowse-popup-bg-color);
    color: #000;
    .item {
      cursor: pointer;
      padding: 6px 0;
      font-size: 12px;
      display: flex;
      align-items: center;
      a {
        color: inherit;
        text-decoration: none;
      }
      svg {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }
      &.curr{
        color:#056CF2
      }
    }
  }
`;
const layouts = {
  one: 'Speaker Only',
  vt: 'Vertical',
  hz: 'Horizontal'
};
export default function Arrange({ layout, handleLayout }) {
  const [expanded, setExpanded] = useState(false);
  const node = useRef()
  const toggleList = () => {
    setExpanded((prev) => !prev);
  };
  const handleLayoutClick = (evt) => {
    handleLayout(evt);
    // toggleList()
  }
  const handleClickOutside = e => {
    console.log("clicking anywhere");
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setExpanded(false);
  };
  useEffect(() => {
    if (expanded) {
      document.addEventListener('mouseup', handleClickOutside, false);
    } else {
      document.removeEventListener('mouseup', handleClickOutside, false);
    }
  }, [expanded]);
  return (
    <StyledWrapper className="arrange" ref={node}>
      <div className="icons" >
        <div className="item" onClick={toggleList}>
          <IconArrange />
        </div>
        <div className="item" layout={'min'} onClick={handleLayout}>
          <IconMini />
        </div>
      </div>
      {expanded && (
        <ul className="list">
          {Object.entries(layouts).map(([key, title]) => {

            return <li onClick={handleLayoutClick} layout={key} key={key} className={`item ${key == layout ? 'curr' : ''}`}>
              {title}
            </li>
          })}
        </ul>
      )}
    </StyledWrapper>
  );
}
