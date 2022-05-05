import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  sendMessageToBackground,
  onMessageFromBackground,
  MessageLocation,
  onMessageFromContentScript,
} from "@wbet/message-api";

import { getUser } from "./hooks/utils";
import UsernameModal from "./UsernameModal";
import LeaveModal from "./LeaveModal";
import TabLimitTipModal from "./TabLimitTipModal";
import useSocketRoom from "./hooks/useSocketRoom";
// import useUsername from './hooks/useUsername'
import EVENTS from "../../common/events";
import { useUser, useTheme } from "../../common/hooks";
import Floater from "./Floater";
import NewEnterNotification from "./NewEnterNotification";
import AccessNotification from "./AccessNotification";
import FollowTipNotification from "./FollowTipNotification";
import CobrowseStatus from "./CobrowseStatus";
import Cursor from "./Cursor";

const StyledWrapper = styled.section`
  --main-btn-txt-color: #273f43;
  --main-btn-bg-color: #52e9fb;
  --main-btn-hover-bg-color: #56ccda;
  --webrowse-widget-bg-color: #fff;
  --font-color: #010409;
  --shadow-color: rgba(0, 0, 0, 0.16);
  --tab-status-bg-color: #fff8e8;
  --tab-bg-color: #fff;
  --tab-hover-bg-color: rgba(0, 0, 0, 0.08);
  /* --follow-mode-bg-color:#F0FBFC; */
  --list-bg-color: #fafafa;
  --tab-title-color: #78787c;
  --option-item-color: #001529b2;
  --option-item-bg-hover-color: #52edff;
  --icon-color: #333;
  --icon-btn-color: #44494f;
  --icon-btn-hover-bg: #f0fbfc;
  --icon-hover-bg: #ebebec;
  --tab-icon-selected-bg: #ffbd2e;
  --modal-title-color: #44494f;
  --modal-content-color: #707478;
  --color-border: #a0a2a5;

  --icon-floater-tab: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab.svg`});
  --icon-floater-tab-curr: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab-curr.svg`});

  --icon-floater-audio: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mic.svg`});
  --icon-floater-audio-curr: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mic-curr.svg`});

  --icon-floater-chat: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/chat.svg`});
  --icon-floater-chat-curr: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/chat-curr.svg`});

  &[data-theme="dark"] {
    --icon-floater-tab: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab-dark.svg`});
    --icon-floater-audio: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mic-dark.svg`});
    --icon-floater-chat: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/chat-dark.svg`});
    --webrowse-widget-bg-color: #010409;
    --color-border: #fff;
    --font-color: #fff;
    --shadow-color: rgba(230, 230, 230, 0.16);
    --tab-status-bg-color: #413e3a;
    --tab-bg-color: #0d1117;
    --tab-hover-bg-color: #1a222e;
    /* --follow-mode-bg-color:#2F3A3C; */
    --list-bg-color: #161b22;
    --tab-title-color: rgba(255, 255, 255, 0.5);
    --option-item-color: #fff;
    --option-item-bg-hover-color: #52edff;
    --icon-color: #eee;
    --icon-btn-color: rgba(255, 255, 255, 0.5);
    --icon-btn-hover-bg: rgba(255, 255, 255, 0.08);
    --icon-hover-bg: #1a222e;
    --tab-icon-selected-bg: #413e3a;
    --modal-title-color: #fff;
    --modal-content-color: #667085;
  }
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999999;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 1;
  /* 通用设置 */
  input,
  textarea {
    caret-color: #056cf2;
  }
  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }
`;
export default function Webrowse() {
  const { theme } = useTheme();
  const { initialUser, uid } = useUser();
  const containerRef = useRef(null);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [tabLimitModalVisible, setTabLimitModalVisible] = useState(false);
  const [endAll, setEndAll] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [winId, setWinId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);
  const { initializeSocketRoom } = useSocketRoom();
  const toggleNameModalVisible = () => {
    setNameModalVisible((prev) => !prev);
  };
  const toggleLeaveModalVisible = (endForAll = false) => {
    setLeaveModalVisible((prev) => !prev);
    setEndAll(endForAll);
  };
  const toggleTabLimitModalVisible = () => {
    setTabLimitModalVisible((prev) => !prev);
  };
  const startWithCustomName = (name) => {
    setCurrUser({ username: name });
  };
  const initUser = async () => {
    let curr = await getUser();
    if (curr) {
      let { id = "", username, photo = "", intUid } = curr;
      // 初始化数据库中的user
      initialUser(id);
      setCurrUser({ aid: id, username, photo, intUid });
    }
  };
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const inter = setTimeout(() => {
      if (containerRef && containerRef.current) {
        console.log({ containerRef });
        containerRef.current.dataset.theme =
          theme == "default" ? (isDark ? "dark" : "light") : theme;
      }
    }, 300);
    return () => {
      clearTimeout(inter);
    };
  }, [theme, containerRef]);
  useEffect(() => {
    if (uid) {
      setCurrUser((prev) => {
        return { ...prev, uid };
      });
    }
  }, [uid]);
  useEffect(() => {
    if (!leaveModalVisible) {
      // 相当于每关掉一次leave modal 就检查一下
      sendMessageToBackground(
        {},
        MessageLocation.Content,
        EVENTS.CHECK_CONNECTION
      );
    }
  }, [leaveModalVisible]);
  useEffect(() => {
    console.log("workspace connect effect");
    // 监听workspace connect变化
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.CHECK_CONNECTION]: (connected = false) => {
        console.log("connection check", connected);
        if (!connected) {
          setRoomId(null);
          setWinId(null);
        }
      },
      [EVENTS.ROOM_WINDOW]: ({ roomId, winId }) => {
        console.log("background ids", roomId, winId);
        setRoomId(roomId);
        setWinId(winId);
        setLoading(false);
      },

      [EVENTS.TAB_LIMIT]: () => {
        setTabLimitModalVisible(true);
      },
    });
    onMessageFromContentScript(MessageLocation.Content, {
      [EVENTS.LOGIN]: ({ user: loginedUser }) => {
        console.log("logined user", loginedUser);
        if (loginedUser.id) {
          initUser(loginedUser.id);
        }
      },
    });
    // 初次初始化
    initUser();
    sendMessageToBackground(
      {},
      MessageLocation.Content,
      EVENTS.CHECK_CONNECTION
    );
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.ROOM_WINDOW);
  }, []);

  useEffect(() => {
    // 只要roomId 和 winId 都没有，则不显示name录入弹窗
    setNameModalVisible(roomId && winId);
    if (roomId && winId && currUser) {
      console.log("initialize socket room");
      initializeSocketRoom({ roomId, winId, user: currUser });
    }
  }, [roomId, winId, currUser]);
  if (loading) return null;
  console.log({ currUser, nameModalVisible });
  return (
    <StyledWrapper ref={containerRef} id="WEBROWSE_FULLSCREEN_CONTAINER">
      <CobrowseStatus />
      <Floater
        roomId={roomId}
        winId={winId}
        uid={currUser?.uid}
        dragContainerRef={containerRef}
        showLeaveModal={toggleLeaveModalVisible}
      />
      {/* 不存在或者未设置用户名的话，先设置 */}
      {!currUser && nameModalVisible && (
        <UsernameModal
          roomId={roomId}
          closeModal={toggleNameModalVisible}
          startCoBrowse={startWithCustomName}
        />
      )}
      {leaveModalVisible && (
        <LeaveModal
          winId={winId}
          endAll={endAll}
          user={currUser}
          closeModal={toggleLeaveModalVisible}
        />
      )}
      {tabLimitModalVisible && (
        <TabLimitTipModal
          user={currUser}
          closeModal={toggleTabLimitModalVisible}
        />
      )}
      <NewEnterNotification />
      <AccessNotification />
      <FollowTipNotification />
      <Cursor />
    </StyledWrapper>
  );
}
