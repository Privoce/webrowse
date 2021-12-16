import { useEffect, useState } from 'react'
import styled from 'styled-components';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import Login from './Login';
import TopInfo from './TopInfo'
import WindowList from './WindowList';
import { EVENTS } from '../../../common'
import { useUser, useTheme } from '../../common/hooks'
const StyledContainer = styled.section`
  min-width: 380px;
  height:calc(100vh + 30px);
  display: flex;
  flex-direction: column;
  background:var(--popup-bg-color);
`;

export default function Container() {
  const { theme } = useTheme()
  const { uid, initialUser } = useUser()
  const [titles, setTitles] = useState({})
  const [wins, setWins] = useState(null)
  const [user, setUser] = useState(null);
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Popup, {
      [EVENTS.POP_UP_DATA]: ({ user = null, windows = [] }) => {
        // alert(JSON.stringify(windowTitles))
        setUser(user);
        setWins(windows);
      },
      [EVENTS.WINDOW_TITLES]: ({ titles }) => {
        setTitles(titles)
      },
    });
    sendMessageToBackground({}, MessageLocation.Popup, EVENTS.POP_UP_DATA)
  }, []);
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = theme == 'default' ? (isDark ? 'dark' : 'light') : theme;
  }, [theme]);
  useEffect(() => {
    if (user) {
      // 初始化数据库中的user
      initialUser(user)
    }
  }, [user]);
  const logout = () => {
    setUser(null);
    sendMessageToBackground({}, MessageLocation.Popup, EVENTS.LOGOUT);
  }
  if (!user) return <Login />;
  return (
    <StyledContainer>
      <TopInfo user={user ? { ...user, uid } : null} logout={logout} />
      <WindowList titles={titles} windows={wins} uid={uid} />
    </StyledContainer>
  )
}
