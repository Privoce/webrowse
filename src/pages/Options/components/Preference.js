import React from 'react'
import styled from 'styled-components';
const StyledPreference = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .title{
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #44494F;
  }
  .themes{
    display: flex;
    flex-direction: column;
    padding: 0;
    list-style: none;
    gap: 18px;
    .theme{
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      .item{
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;

      }
    }
  }
`;
export default function Preference() {
  return (
    <StyledPreference>
      <div className="title">Theme</div>
      <ul className="themes">
        <li className="theme">
          <label className="item" htmlFor="light" >
            <input type="radio" name="theme" id="light" />
            Light
          </label>
        </li>
        <li className="theme">
          <label className="item" htmlFor="dark">
            <input type="radio" name="theme" id="dark" />
            Dark
          </label>
        </li>
        <li className="theme">
          <label className="item" htmlFor="sys">
            <input type="radio" name="theme" id="sys" />
            System Default
          </label>
        </li>
      </ul>
    </StyledPreference>
  )
}
