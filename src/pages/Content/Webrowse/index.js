import { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { sendMessageToBackground, onMessageFromBackground, MessageLocation } from '@wbet/message-api'

import Panel from './Panel';
import InvitePanel from './InvitePanel'
import RegPanel from './RegPanel'
// import ChatBox from './Chat';
import useSocketRoom from './hooks/useSocketRoom';
import useUsername from './hooks/useUsername'
// import { getUser } from './hooks/utils';
import { EVENTS } from '../../../common'
import Floater from './Floater';
const StyledWrapper = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 1;
`;
const GlobalStyle = createGlobalStyle`
  ol, ul {
    list-style: none;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
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
  // const [chatVisible, setChatVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [winId, setWinId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username, fake } = useUsername();
  const [regPanelVisible, setRegPanelVisible] = useState(!username || fake);
  const [invitePanelVisible, setInvitePanelVisible] = useState(username && !fake);
  const { temp: tempRoom, roomName, initializing, users, sendSocketMessage, initializeSocketRoom } = useSocketRoom();
  const togglePanelVisible = async () => {
    if (!panelVisible) {
      //由不可见转为可见 设置临时room
      setRoomId(`${Math.random().toString(36).substring(7)}_temp`);
      // 新起个window
      console.log("new window from panelVisibleToggle");
      sendMessageToBackground({}, MessageLocation.Content, EVENTS.NEW_WINDOW)
    } else {
      //由可见转为不可见：重置room id为空
      setRoomId(null);
    }
    setPanelVisible((prev) => !prev);
  };
  // const toggleChatVisible = () => {
  //   setChatVisible((prev) => !prev);
  // };
  const toggleRegPanelVisible = () => {
    console.log("toggle reg panel visible");
    setRegPanelVisible(prev => !prev);
  }
  const toggleInvitePanelVisible = () => {
    setInvitePanelVisible(prev => !prev);
  }
  const showVeraPanel = async () => {
    if (panelVisible) return;
    const currentActiveTab = await sendMessageToBackground({}, MessageLocation.Content, EVENTS.CURRENT_TAB);
    const { active: isActiveTab } = currentActiveTab;
    if (!isActiveTab) return;
    setPanelVisible(true);
  }
  useEffect(() => {
    if (!roomId) {
      setRegPanelVisible(false);
    }
  }, [roomId]);
  useEffect(() => {
    if (roomId) {
      initializeSocketRoom({ roomId, winId });
    }
  }, [roomId, winId]);
  useEffect(() => {
    // 监听workspace connect变化
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.CHECK_CONNECTION]: (connected = false) => {
        setFloaterVisible(connected);
      },
      [EVENTS.ROOM_WINDOW]: ({ roomId, winId }) => {
        console.log("background ids", roomId, winId);
        setRoomId(roomId);
        setWinId(winId);
        setLoading(false);
      },
      [EVENTS.LOAD_VERA]: () => {
        showVeraPanel();
      },
    });
    // 初次初始化
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.CHECK_CONNECTION);
  }, []);
  useEffect(() => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.ROOM_WINDOW)
  }, []);
  if (loading) return null;
  console.log({ floaterVisible });
  return (
    <StyledWrapper id="WEBROWSE_FULLSCREEN_CONTAINER">
      <GlobalStyle />
      {floaterVisible && <Floater />}
      {/* 未登录/注册panel */}
      {regPanelVisible && <RegPanel closePanel={toggleRegPanelVisible} />}
      {/* 邀请panel */}
      {invitePanelVisible && <InvitePanel closePanel={toggleInvitePanelVisible} username={username} />}
      {/* 主panel */}
      {panelVisible && (
        <>
          <Panel
            initializing={initializing}
            users={users}
            tempRoom={tempRoom}
            sendSocketMessage={sendSocketMessage}
            roomName={roomName}
            closePanel={togglePanelVisible}
            // chatVisible={chatVisible}
            // toggleChatVisible={toggleChatVisible}
            toggleInvitePanelVisible={toggleInvitePanelVisible}
          />
          {/* <ChatBox channelId={roomId} visible={chatVisible} toggleVisible={toggleChatVisible} /> */}
        </>
      )}
    </StyledWrapper>
  );
}

