import React from 'react'
import Dots from '../Dots';
import styled from 'styled-components';
const StyledOptions = styled.div`
    display: flex;
    cursor: pointer;
    position: absolute;
    top:50%;
    right:6px;
    width: 20px;
    height: 100%;
    align-items: center;
    justify-content: center;
    transform: translate3d(0, -50%, 0);
    z-index: 9999;
    .items{
      display: none;
      padding: 8px;
      list-style: none;
      border:var(--box-border);
      box-shadow: 0px 8px 24px -8px var(--popup-bg-color);
      border-radius: 8px;
      position: absolute;
      right: 5px;
      bottom: 0;
      white-space: nowrap;
      background-color:var(--window-bg-color);
      .item{
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        color: var(--option-item-color);
        padding: 8px 16px;
        border-radius: 4px;
        /* transition: all .5s ease-in-out; */
        &:hover{
          background: var(--option-item-bg-hover-color);
        }
      }
    }
    &.expand {
      svg path{
        fill:#C4C4C4;
      }
      .items{
        display: block;
      }
    }
`;
export default function Options({ children }) {

  const toggleOptsVisible = (evt) => {
    evt.stopPropagation();
    const { currentTarget } = evt;
    currentTarget.classList.toggle('expand')
  }
  const handleItemsMouseLeave = ({ currentTarget }) => {
    currentTarget.parentElement.classList.remove('expand')
  }
  return (
    <StyledOptions className="opts" onClick={toggleOptsVisible}>
      <Dots />
      <ul className="items" onMouseLeave={handleItemsMouseLeave}>
        {children}
      </ul>
    </StyledOptions>
  )
}
