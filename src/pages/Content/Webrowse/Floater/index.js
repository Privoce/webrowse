import { useState, useEffect } from "react";
import {
  onMessageFromBackground,
  sendMessageToBackground,
  MessageLocation,
} from "@wbet/message-api";
import { motion, useDragControls } from "framer-motion";
import { IoLinkOutline } from "react-icons/io5";
import { MdOutlineRefresh } from "react-icons/md";
import { ImStarEmpty, ImStarFull } from "react-icons/im";
import EVENTS from "../../../common/events";
import { useWindow, useInviteLink, useCopy } from "../../../common/hooks";
import { getWindowTitle, getWindowTabs } from "../../../common/utils";
import StyledWidget from "./styled";
import Tabs from "./Tabs";
import Dots from "./Dots";
// import Chat from "./Chat";
// import Audio from "./Audio";

import config from "../../../../config";

// const mock_data = [{ id: 1, host: true, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }, { id: 2, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }]
const DefaultTitle = "Temporary Window";
let tempTitle = "";
export default function Floater({
  roomId,
  uid,
  winId,
  showLeaveModal,
  dragContainerRef = null,
}) {
  const { link } = useInviteLink({ roomId, winId });
  const {
    updateWindowTitle,
    checkFavorite,
    toggleFavorite,
    saveWindow,
  } = useWindow(uid);
  const [faving, setFaving] = useState(false);
  const [editable, setEditable] = useState(false);
  const [fav, setFav] = useState(false);
  const [users, setUsers] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [title, setTitle] = useState("");
  const [activeTabId, setActiveTabId] = useState(null);
  const [currUser, setCurrUser] = useState(undefined);
  const [host, setHost] = useState(undefined);
  const [visible, setVisible] = useState({
    tab: true,
    follow: false,
    audio: false,
    chat: false,
  });
  const [voiceStatus, setVoiceStatus] = useState("disconnected");
  const [popup, setPopup] = useState(false);
  // const [badged, setBadged] = useState(false);
  const { copied, copy } = useCopy();
  const [remoteUsers, setRemoteUsers] = useState([]);
  const toggleVisible = ({ target }) => {
    const { type } = target.dataset;
    // setVisible({tab:false,follow:false})
    const value = !visible[type];
    sendMessageToBackground(
      { tab: type, visible: value },
      MessageLocation.Content,
      EVENTS.CHANGE_FLOATER_TAB
    );
  };
  const handleCopyLink = async () => {
    if (copied || !link) return;
    // 先save一下
    const title = (await getWindowTitle()) || DefaultTitle;
    const tabs = await getWindowTabs();
    saveWindow({ id: winId, title, tabs, onlySave: true });
    copy(link);
  };
  const togglePopup = () => {
    setPopup((prev) => !prev);
  };
  const handleAllLeave = () => {
    showLeaveModal(true);
    setPopup(false);
  };
  const handleLeave = () => {
    showLeaveModal();
    setPopup(false);
  };
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.UPDATE_FLOATER]: ({
        fav,
        title = "",
        floaterTabVisible,
        users,
        tabs,
        userId,
        voiceStatus,
        remoteUsers,
      }) => {
        console.log({ floaterTabVisible, users, tabs, userId });
        setVisible(floaterTabVisible);
        setUsers(users);
        setTabs(tabs);
        setVoiceStatus(voiceStatus);
        setRemoteUsers(remoteUsers);

        let tmp = users.find((u) => u.id == userId);
        let tmp2 = users.find((u) => u.host);
        setCurrUser(tmp);
        setHost(tmp2);
        setTitle(title || DefaultTitle);
        setFav(fav);
      },
    });
    // 初次初始化
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.UPDATE_TABS);
  }, []);
  useEffect(() => {
    if (host && tabs && tabs.length) {
      let activeTab = tabs.find((t) => t.index == host.activeIndex);
      if (activeTab) {
        setActiveTabId(activeTab.id);
      }
    }
  }, [host, tabs]);
  useEffect(() => {
    if (currUser?.follow) {
      // 立即同步
      sendMessageToBackground(
        { tabId: activeTabId },
        MessageLocation.Content,
        EVENTS.JUMP_TAB
      );
    }
  }, [currUser, activeTabId]);
  const closeBlock = (evt) => {
    const { type } = evt.target.dataset;
    if (!type) return;
    sendMessageToBackground(
      { tab: type, visible: false },
      MessageLocation.Content,
      EVENTS.CHANGE_FLOATER_TAB
    );
  };
  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  };
  const handleTitleClick = (evt) => {
    if (editable) return;
    tempTitle = evt.target.value;
    setEditable(true);
    evt.target.select();
  };
  const handleTitleBlur = () => {
    setEditable(false);
    if (tempTitle == title) return;
    let tmp = title || DefaultTitle;
    updateWindowTitle({ id: winId, title: tmp });
    sendMessageToBackground(
      { title: tmp },
      MessageLocation.Content,
      EVENTS.UPDATE_WIN_TITLE
    );
  };
  const handleEnterKey = (evt) => {
    if (evt.keyCode == 13) {
      evt.target.setSelectionRange(0, 0);
      evt.target.blur();
    }
  };
  const toggleOptsVisible = (evt) => {
    evt.stopPropagation();
    const { currentTarget } = evt;
    currentTarget.classList.toggle("expand");
  };
  const handleItemsMouseLeave = ({ currentTarget }) => {
    currentTarget.parentElement.classList.remove("expand");
  };
  const handleSaveWindow = async (winId) => {
    const title = (await getWindowTitle()) || DefaultTitle;
    const tabs = await getWindowTabs();
    saveWindow({ id: winId, title, tabs });
  };

  // const handleUpdateMessage = (type) => {
  //   setBadged(type === "new");
  // };

  const toggleFav = async () => {
    setFaving(true);
    await toggleFavorite({ wid: winId, fav: !fav });
    setFaving(false);
  };
  useEffect(() => {
    if (winId && uid) {
      checkFavorite(winId);
    }
  }, [winId, uid]);

  useEffect(() => {
    const handleMessage = async (ev) => {
      const { source, event } = ev.data || {};

      // 监听来自 webrow.se 的消息 且 event = copy
      if (!(source === "webrow.se" && event === "copy")) return;

      const title = (await getWindowTitle()) || DefaultTitle;
      const tabs = await getWindowTabs();
      await saveWindow({ id: winId, title, tabs, onlySave: true });
      copy(link);

      const message = {
        source: "webrowse.ext",
        payload: {},
        event: "copied",
      };

      // 发送消息
      window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [link, winId, title, tabs]);

  useEffect(() => {
    const meetingUri = `${config.MESSAGE_TARGET_ORIGIN}/voice`;

    // 是否已经打开了 meeting tab
    const tab = !!tabs.find((tab) => tab?.url?.indexOf(meetingUri) > -1);

    // 没有找到 meeting tab 并且已经在线时，重置连接状态和用户列表
    if (!tab && voiceStatus === "connected") {
      (async () => {
        await sendMessageToBackground(
          {
            status: "",
          },
          MessageLocation.Content,
          EVENTS.UPDATE_VOICE_STATUS
        );

        await sendMessageToBackground(
          {
            remoteUsers: [],
          },
          MessageLocation.Content,
          EVENTS.UPDATE_REMOTE_USERS
        );
      })();
    }

    return () => {};
  }, [tabs, remoteUsers, voiceStatus]);

  const { tab } = visible;
  console.log({ users, host, currUser });
  const dragControls = useDragControls();
  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={dragContainerRef}
        whileDrag={{ scale: 1.12 }}
        style={{ position: "fixed", right: "24px", bottom: "24px" }}
        dragControls={dragControls}
        onDragStart={(e, info) => {
          if (!e.path?.[0]) return;

          if (e.path[0].classList.contains("drag-disabled")) {
            // Stop the drag
            dragControls.componentControls.forEach((entry) => {
              entry.stop(e, info);
            });
          }
        }}
      >
        <StyledWidget>
          <div className="drag">
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="top">
            <div className={`title`}>
              <input
                className={"drag-disabled"}
                onKeyDown={handleEnterKey}
                onBlur={handleTitleBlur}
                onClick={handleTitleClick}
                readOnly={!editable}
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="right">
              <div className="star" onClick={toggleFav}>
                {faving ? (
                  <MdOutlineRefresh className="tip" />
                ) : fav ? (
                  <ImStarFull size="13" color="#FFD400" />
                ) : (
                  <ImStarEmpty size="13" color="#78787C" />
                )}
              </div>
              <div className="others" onClick={toggleOptsVisible}>
                <Dots />
                <ul className="items" onMouseLeave={handleItemsMouseLeave}>
                  <li className="item" onClick={handleCopyLink}>
                    {chrome.i18n.getMessage("invite")}
                  </li>
                  <li
                    className="item"
                    onClick={handleSaveWindow.bind(null, winId)}
                  >
                    {chrome.i18n.getMessage("save_window")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="opts">
            <div className="btns">
              <button
                data-tooltip={chrome.i18n.getMessage("tab_status")}
                className={`btn tab tooltip ${tab ? "curr" : ""}`}
                data-type="tab"
                onClick={toggleVisible}
              />
              {/* <button title="Follow Mode" className={`btn follow ${follow ? 'curr' : ''}`} data-type='follow' onClick={toggleVisible}></button> */}

              <button
                disabled={!currUser}
                data-tooltip={"Coming soon!"}
                className={`btn chat tooltip`}
                data-type="chat"
              >
                <span className={`badge`} />
              </button>
              <button
                disabled={!currUser}
                data-tooltip={"Coming soon!"}
                className={`btn audio tooltip`}
                data-type="audio"
              />
            </div>
            {link && (
              <div className="cmds">
                <div
                  className="cmd copy tooltip"
                  data-tooltip={chrome.i18n.getMessage("copy_link_tip")}
                  onClick={handleCopyLink}
                >
                  <IoLinkOutline className="icon" size={16} />
                  <button className={`btn ${copied ? "copied" : ""}`}>
                    {copied
                      ? chrome.i18n.getMessage("copied")
                      : chrome.i18n.getMessage("invite")}
                  </button>
                </div>

                <button
                  onClick={currUser?.host ? togglePopup : handleLeave}
                  className="btn"
                >
                  {popup
                    ? chrome.i18n.getMessage("cancel")
                    : chrome.i18n.getMessage("leave")}
                </button>
              </div>
            )}
          </div>
          {tab && <Tabs tabs={tabs} users={users} closeBlock={closeBlock} />}
          {/* {currUser && (
            <Chat
              currUser={currUser}
              visible={chat}
              closeBlock={closeBlock}
              winId={winId}
              onUpdateMessage={handleUpdateMessage}
            />
          )} */}
          {/* {currUser && (
            <Audio
              visible={audio}
              users={users}
              remoteUsers={remoteUsers}
              currUser={currUser}
              closeBlock={closeBlock}
              voiceStatus={voiceStatus}
              tabs={tabs}
              winId={winId}
            />
          )} */}
          {popup && (
            <div className="leave_pop">
              {currUser?.creator && (
                <button className="select" onClick={handleAllLeave}>
                  {chrome.i18n.getMessage("end_for_all")}
                </button>
              )}
              <button className="select" onClick={handleLeave}>
                {chrome.i18n.getMessage("leave_session")}
              </button>
            </div>
          )}
        </StyledWidget>
      </motion.div>
    </>
  );
}
