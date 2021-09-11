import { useEffect, useState } from 'react'
import styled from 'styled-components';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'

import Login from './Login';
import UserInfo from './UserInfo'
import NewWindow from './NewWindow'
import WindowList from './WindowList';
import { EVENTS } from '../../../common'

const StyledContainer = styled.section`
  min-width: 380px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background:#F8FBFF;
`;
export default function Container() {
  const [wins, setWins] = useState(null)
  const [user, setUser] = useState(null);
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Popup, {
      [EVENTS.POP_UP_DATA]: ({ user = null, windows = [] }) => {
        setUser(user);
        setWins(windows);
      }
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
      <UserInfo user={user} logout={logout} />
      <NewWindow />
      <WindowList windows={wins} roomId={user.id} />
    </StyledContainer>
  )
}
