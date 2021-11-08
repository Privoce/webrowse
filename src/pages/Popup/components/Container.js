import { useEffect, useState } from 'react'
import styled from 'styled-components';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'

import Login from './Login';
import TopInfo from './TopInfo'
import WindowList from './WindowList';
import { EVENTS } from '../../../common'

const StyledContainer = styled.section`
  min-width: 380px;
  height:calc(100vh + 30px);
  display: flex;
  flex-direction: column;
  background:var(--popup-bg-color);
`;
export default function Container() {
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
  const logout = () => {
    setUser(null);
    sendMessageToBackground({}, MessageLocation.Popup, EVENTS.LOGOUT);
  }
  if (!user) return <Login />;
  return (
    <StyledContainer>
      <TopInfo user={user} logout={logout} />
      <WindowList titles={titles} windows={wins} roomId={user.id} />
    </StyledContainer>
  )
}
