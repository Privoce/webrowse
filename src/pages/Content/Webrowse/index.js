import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { sendMessageToBackground, onMessageFromBackground, MessageLocation } from '@wbet/message-api'
import { getUser } from './hooks/utils';
import Panel from './Panel';
import UsernameModal from './UsernameModal';
import LeaveModal from './LeaveModal';
import useSocketRoom from './hooks/useSocketRoom';
// import useUsername from './hooks/useUsername'
import { EVENTS } from '../../../common'
import Floater from './Floater';
import CobrowseStatus from './CobrowseStatus';
const StyledWrapper = styled.section`
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
`;
const GlobalStyle = createGlobalStyle`
button{
  cursor: pointer;
  border:none;
  outline: none;
  background: none;
}
/* 隐藏掉页面的滚动条 */
  body::-webkit-scrollbar{
    display: none !important;
  }
  :root {
      --webrowse-widget-bg-color: #056CF2;
      --webrowse-theme-color:#056CF2;

      --webrowse-control-disable-color:#d2d2d2;
      --webrowse-popup-bg-color:#fff;
      --webrowse-panel-bg-color: radial-gradient( circle at top left, rgba(255,255,255,0.8) 20px, #ffffff90 100px ), radial-gradient( circle at top right, rgba(255,255,255,0.8) 20px, #ffffff90 104px ), radial-gradient( at bottom left, #a788f3 100px, transparent 411px ), radial-gradient( at bottom right, #8994f5 200px, transparent 400px );
      --webrowse-panel-border-radius: 15px;
      --webrowse-box-bg-color:#fff;
      --webrowse-button-bg-color: #056CF2;
      --webrowse-button-font-color: #fff;
      --webrowse-layout-bg-color: #5D6063;
      --webrowse-hr-bg-color:#DEE1E6;
      --webrowse-font-color: #464646;
      --webrowse-camera-bg-color: #fff;
      --webrowse-border-radius: 20px;
    }
  .webrowse-dark-theme{
    --webrowse-theme-color:#85d4db;
    --webrowse-panel-bg-color: #000;
    --webrowse-box-bg-color:#616161;

    --webrowse-popup-bg-color:#DBE2EB;
    --webrowse-button-bg-color: #68D6DD;
    --webrowse-button-font-color: #000;
    --webrowse-layout-bg-color: #fff;
    --webrowse-hr-bg-color:#DEE1E6;
    --webrowse-camera-bg-color: #5D6063;
    --webrowse-font-color: #fff;
  }

`;
export default function Webrowse() {
  const [floaterVisible, setFloaterVisible] = useState(false)
  const [nameModalVisible, setNameModalVisible] = useState(false)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [endAll, setEndAll] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [winId, setWinId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null)
  const { temp: tempRoom, roomName, initializing, users, sendSocketMessage, initializeSocketRoom } = useSocketRoom();
  const hideVeraPanel = () => {
    setPanelVisible(false);
  };
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
  const showVeraPanel = async () => {
    if (panelVisible) return;
    const currentActiveTab = await sendMessageToBackground({}, MessageLocation.Content, EVENTS.CURRENT_TAB);
    const { active: isActiveTab } = currentActiveTab;
    if (!isActiveTab) return;
    setPanelVisible(true);
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
  }, [leaveModalVisible])
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
      },
      [EVENTS.LOAD_VERA]: () => {
        showVeraPanel();
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
    <StyledWrapper id="WEBROWSE_FULLSCREEN_CONTAINER" className={floaterVisible ? 'cobrowsing' : ''}>
      <GlobalStyle />
      {floaterVisible && <CobrowseStatus />}
      {floaterVisible && <Floater showLeaveModal={toggleLeaveModalVisible} />}
      {/* 主panel */}
      {panelVisible && (
        <>
          <Panel
            initializing={initializing}
            users={users}
            tempRoom={tempRoom}
            sendSocketMessage={sendSocketMessage}
            roomName={roomName}
            closePanel={hideVeraPanel}
          />
        </>
      )}
      {/* 不存在或者未设置用户名的话，先设置 */}
      {!currUser && nameModalVisible && <UsernameModal roomId={roomId} closeModal={toggleNameModalVisible} startCoBrowse={startWithCustomName} />}
      {leaveModalVisible && <LeaveModal endAll={endAll} user={currUser} closeModal={toggleLeaveModalVisible} />}
    </StyledWrapper>
  );
}

