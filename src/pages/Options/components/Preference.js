import React from 'react'
import styled from 'styled-components';
import useTheme from '../../common/hooks/useTheme'
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
        input{
          cursor: pointer;
        }
      }
    }
  }
`;
const themes = [
  {
    key: 'default',
    title: "System Default"
  },
  {
    key: 'light',
    title: "Light"
  },
  {
    key: 'dark',
    title: "Dark"
  },
]
export default function Preference() {
  const { theme, updateTheme } = useTheme();
  console.log(theme);
  const handleThemeChange = ({ target }) => {
    updateTheme(target.value)
  }
  return (
    <StyledPreference>
      <div className="title">Theme</div>
      <ul className="themes">
        {/* <form> */}
        {themes.map(({ key, title }) => {

          return <li key={key} className="theme">
            <label className="item" htmlFor={key} >
              <input onChange={handleThemeChange} checked={theme == key} value={key} type="radio" name="theme" id={key} />
              {title}
            </label>
          </li>
        })}
        {/* </form> */}
      </ul>
    </StyledPreference>
  )
}
