import { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { sendMessageToBackground, onMessageFromBackground, MessageLocation } from '@wbet/message-api'

import { getUser } from './hooks/utils';
import UsernameModal from './UsernameModal';
import LeaveModal from './LeaveModal';
import useSocketRoom from './hooks/useSocketRoom';
// import useUsername from './hooks/useUsername'
import { EVENTS } from '../../../common'
import Floater from './Floater';
import CobrowseStatus from './CobrowseStatus';
const StyledWrapper = styled.section`
  --webrowse-widget-bg-color: rgba(255,255,255);
  --font-color:#1C1C1E;
  --tab-status-bg-color:#FFF9EB;
  --tab-bg-color:#fff;
  --tab-hover-bg-color:#F1FDFF;
  --follow-mode-bg-color:#F0FBFC;
  @media (prefers-color-scheme: dark) {
      --webrowse-widget-bg-color: #1C1C1E;
      --font-color:#fff;
      --tab-status-bg-color:#65615C;
      --tab-bg-color:#32302E;
      --tab-hover-bg-color:#1C1C1E;
      --follow-mode-bg-color:#2F3A3C;
  }
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  background: none !important;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 1;
  &.cobrowsing{
    box-shadow: inset 6px 6px 0 0 #77a5f1, inset 0 0 6px 6px #77a5f1;
  }
  /* 通用设置 */
  input,textarea{
    caret-color:#056CF2;
  }
  button{
    cursor: pointer;
    border:none;
    outline: none;
    background: none;
  }
`;
const GlobalStyle = createGlobalStyle`
  /* 隐藏掉页面的滚动条 */
  body::-webkit-scrollbar{
    display: none !important;
  }
`;
export default function Webrowse() {
  const containerRef = useRef(null)
  const [floaterVisible, setFloaterVisible] = useState(false)
  const [nameModalVisible, setNameModalVisible] = useState(false)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [endAll, setEndAll] = useState(false)
  const [roomId, setRoomId] = useState(null);
  const [winId, setWinId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null)
  const { initializeSocketRoom } = useSocketRoom();
  const toggleNameModalVisible = () => {
    setNameModalVisible((prev) => !prev);
  };
  const toggleLeaveModalVisible = (endForAll = false) => {
    setLeaveModalVisible(prev => !prev);
    setEndAll(endForAll)
  }
  const startWithCustomName = (name) => {
    setCurrUser({ username: name })
  }
  const initUser = async () => {
    let curr = await getUser();
    if (curr) {
      let { id = "", username, photo = "" } = curr;
      setCurrUser({ uid: id, username, photo });
    }
  };

  useEffect(() => {
    if (!leaveModalVisible) {
      // 相当于每关掉一次leave modal 就检查一下
      sendMessageToBackground({}, MessageLocation.Content, EVENTS.CHECK_CONNECTION);
    }
  }, [leaveModalVisible]);
  useEffect(() => {
    console.log('workspace connect effect');
    // 监听workspace connect变化
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.CHECK_CONNECTION]: (connected = false) => {
        console.log("connection check", connected);
        setFloaterVisible(connected);
        if (!connected) {
          setRoomId(null)
          setWinId(null)
        }
      },
      [EVENTS.ROOM_WINDOW]: ({ roomId, winId }) => {
        console.log("background ids", roomId, winId);
        setRoomId(roomId);
        setWinId(winId);
        setLoading(false);
      }
    });
    // 初次初始化
    initUser();
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.CHECK_CONNECTION);
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.ROOM_WINDOW)
    const handleVisibleChange = () => {
      if (!document.hidden) {
        sendMessageToBackground({}, MessageLocation.Content, EVENTS.CHECK_CONNECTION);
        // 再次初始化用户信息
        // initUser();
      }
    }
    document.addEventListener('visibilitychange', handleVisibleChange, false);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibleChange, false)
    }
  }, []);
  useEffect(() => {
    // 只要roomId 和 winId 都没有，则不显示name录入弹窗
    setNameModalVisible(roomId && winId)
    if (roomId && winId && currUser) {
      console.log("initialize socket room");
      initializeSocketRoom({ roomId, winId, user: currUser });
    }
  }, [roomId, winId, currUser]);
  if (loading) return null;
  console.log({ currUser, nameModalVisible, floaterVisible });
  return (
    <StyledWrapper ref={containerRef} id="WEBROWSE_FULLSCREEN_CONTAINER" className={floaterVisible ? 'cobrowsing' : ''}>
      <GlobalStyle />
      {floaterVisible && <CobrowseStatus />}
      {floaterVisible && <Floater dragContainerRef={containerRef} showLeaveModal={toggleLeaveModalVisible} />}
      {/* 不存在或者未设置用户名的话，先设置 */}
      {!currUser && nameModalVisible && <UsernameModal roomId={roomId} closeModal={toggleNameModalVisible} startCoBrowse={startWithCustomName} />}
      {leaveModalVisible && <LeaveModal endAll={endAll} user={currUser} closeModal={toggleLeaveModalVisible} />}
    </StyledWrapper>
  );
}

