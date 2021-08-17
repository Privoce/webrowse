import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getUser } from '../../hooks/utils';

import IconSetting from '../../icons/Setting';
import IconFeedback from '../../icons/Feedback';
import IconSun from '../../icons/Sun';
import IconMoon from '../../icons/Moon';
import IconLogout from '../../icons/Logout';
const logoutTip = chrome.i18n.getMessage('logout');
const tipSendFeedback = chrome.i18n.getMessage('tipSendFeedback');
const modeTip = chrome.i18n.getMessage('mode');
const StyledWrapper = styled.div`
  position: relative;
  z-index: 9;
  .icon {
    cursor: pointer;
    width: 1.5em;
    height: 1.5em;
    > svg {
      width: 100%;
      height: 100%;
    }
  }
  .list {
    position: absolute;
    left: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    padding: 4px 10px;
    border-radius: 5px;
    background-color: var(--vera-popup-bg-color);
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
        width: 16px !important;
        height: 16px !important;
        margin-right: 6px;
      }
    }
  }
`;
export default function Setting({ logoutVisible, dark, updateDarkTheme }) {
  const [logined, setLogined] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const node = useRef();
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
  const toggleList = () => {
    setExpanded((prev) => !prev);
  };
  const toggleThemeMode = () => {
    updateDarkTheme(!dark);
  };
  const handleLogout = () => {
    chrome.storage.sync.remove('user', () => {
      console.log('user removed');
    });
    setExpanded(false);
  };
  useEffect(() => {
    const checkLogin = async () => {
      let user = await getUser();
      setLogined(!!user);
    };
    if (expanded) {
      checkLogin();
    }
  }, [expanded]);
  return (
    <StyledWrapper className="setting" ref={node}>
      <div className="icon" onClick={toggleList}>
        <IconSetting />
      </div>
      {expanded && (
        <ul className="list" >
          <li className="item fb">
            <IconFeedback />
            <a
              href="https://www.surveymonkey.com/r/RMGZDW8"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tipSendFeedback}
            </a>
          </li>
          {logoutVisible && logined && (
            <li className="item logout" onClick={handleLogout}>
              <IconLogout />
              {logoutTip}
            </li>
          )}
          <li className="item mode" onClick={toggleThemeMode}>
            {dark ? <IconSun /> : <IconMoon />}
            {dark ? 'Light' : 'Dark'} {modeTip}
          </li>
        </ul>
      )}
    </StyledWrapper>
  );
}
