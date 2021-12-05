import { useState, useEffect } from 'react';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api';
import { motion } from 'framer-motion';
import { IoLinkOutline } from 'react-icons/io5';
import { MdOutlineRefresh } from 'react-icons/md';
import { RiUserReceived2Fill, RiUserStarFill } from 'react-icons/ri';
import { ImStarEmpty, ImStarFull } from 'react-icons/im';
import { EVENTS } from '../../../../common';
import { useWindow, useInviteLink } from '../../../common/hooks';
import { getWindowTitle, getWindowTabs } from '../../../common/utils'
import StyledWidget from './styled';
import Tabs from './Tabs';
import Dots from './Dots';
import BehostPop from './BehostPop';
import FollowModeTipModal from './FollowModeTipModal';
// import FollowMode from './FollowMode';
import useCopy from '../hooks/useCopy';
// const mock_data = [{ id: 1, host: true, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }, { id: 2, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }]
let followModalClosed = false;
let tempTitle = '';
export default function Floater({ roomId, uid, winId, showLeaveModal, dragContainerRef = null }) {
  const { link } = useInviteLink({ roomId, winId })
  const { updateWindowTitle, checkFavorite, toggleFavorite, saveWindow, saving, updating, removing } = useWindow(uid)
  const [editable, setEditable] = useState(false);
  const [followTipModalVisible, setFollowTipModalVisible] = useState(false);
  const [behostPopoverVisible, setBehostPopoverVisible] = useState(false);
  const [fav, setFav] = useState(false)
  const [users, setUsers] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [title, setTitle] = useState("")
  const [activeTabId, setActiveTabId] = useState(null)
  const [currUser, setCurrUser] = useState(undefined);
  const [host, setHost] = useState(undefined)
  const [visible, setVisible] = useState({ tab: true, follow: false, audio: false });
  const [popup, setPopup] = useState(false)
  const { copied, copy } = useCopy();
  const toggleVisible = ({ target }) => {
    const { type } = target.dataset;
    // setVisible({tab:false,follow:false})
    const value = !visible[type];
    sendMessageToBackground({ tab: type, visible: value }, MessageLocation.Content, EVENTS.CHANGE_FLOATER_TAB)
  }
  const handleCopyLink = async () => {
    if (copied || !link) return;
    // 先save一下
    const title = await getWindowTitle() || "Temporary Window";
    const tabs = await getWindowTabs();
    saveWindow({ id: winId, title, tabs, onlySave: true })
    copy(link);
  }
  const togglePopup = () => {
    setPopup(prev => !prev)
  }
  const handleAllLeave = () => {
    showLeaveModal(true);
    setPopup(false)
  }
  const handleLeave = () => {
    showLeaveModal();
    setPopup(false)
  }
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.UPDATE_FLOATER]: ({ fav, title = "", floaterTabVisible, users, tabs, userId }) => {
        console.log({ floaterTabVisible, users, tabs, userId });
        setVisible(floaterTabVisible);
        setUsers(users);
        setTabs(tabs);
        let tmp = users.find(u => u.id == userId);
        let tmp2 = users.find(u => u.host);
        setCurrUser(tmp);
        setHost(tmp2);
        setTitle(title);
        setFav(fav)
      }
    });
    // 初次初始化
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.UPDATE_TABS);
  }, []);
  useEffect(() => {
    if (host && tabs && tabs.length) {
      let activeTab = tabs.find(t => t.index == host.activeIndex);
      if (activeTab) {
        setActiveTabId(activeTab.id);
      }
    }
  }, [host, tabs]);
  useEffect(() => {
    if (currUser?.follow) {
      // 立即同步
      sendMessageToBackground({ tabId: activeTabId }, MessageLocation.Content, EVENTS.JUMP_TAB);
    }
    setFollowTipModalVisible(!!currUser?.follow);

  }, [currUser, activeTabId]);
  const closeBlock = (evt) => {
    const { type } = evt.target.dataset;
    if (!type) return;
    sendMessageToBackground({ tab: type, visible: false }, MessageLocation.Content, EVENTS.CHANGE_FLOATER_TAB);
  }
  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  }
  const handleTitleClick = (evt) => {
    if (editable) return;
    tempTitle = evt.target.value;
    setEditable(true);
    evt.target.select();
  }
  const handleTitleBlur = () => {
    setEditable(false);
    if (!title || tempTitle == title) return;
    updateWindowTitle({ id: winId, title })
    sendMessageToBackground({ title }, MessageLocation.Content, EVENTS.UPDATE_WIN_TITLE);
  }
  const handleEnterKey = (evt) => {
    if (evt.keyCode == 13) {
      evt.target.setSelectionRange(0, 0);
      evt.target.blur();
    }
  }
  const handleCancelHostPop = () => {
    setBehostPopoverVisible(false);
  }

  const handleBeHost = () => {
    chrome.storage.sync.get(['BECOME_HOST_ASK'], (res) => {
      let enable = (host && host.id == currUser?.id) ? false : true;
      if (!res.BECOME_HOST_ASK && enable) {
        setBehostPopoverVisible(true);
        return;
      } else {
        // 成为host
        sendMessageToBackground({
          data: {
            cmd: EVENTS.BE_HOST,
            payload: {
              enable
            }
          }
        }, MessageLocation.Content, EVENTS.SOCKET_MSG)
      }
    });
  }
  const toggleOptsVisible = (evt) => {
    evt.stopPropagation();
    const { currentTarget } = evt;
    currentTarget.classList.toggle('expand')
  }
  const handleItemsMouseLeave = ({ currentTarget }) => {
    currentTarget.parentElement.classList.remove('expand')
  }
  const handleSaveWindow = async (winId) => {
    const title = await getWindowTitle() || "Temporary Window";
    const tabs = await getWindowTabs();
    saveWindow({ id: winId, title, tabs })
  }
  useEffect(() => {
    if (winId && uid) {
      checkFavorite(winId)
    }
  }, [winId, uid])
  const { tab } = visible;
  const isHost = host && host.id == currUser?.id;
  console.log({ users, host, currUser });
  const faving = saving || updating || removing;
  return (
    <>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={dragContainerRef}
        whileDrag={{ scale: 1.12 }}
        style={{ position: 'absolute', right: '24px', bottom: '24px' }}
      >
        <StyledWidget >
          <div className="top">
            <div className={`title`}>
              <input onKeyDown={handleEnterKey} onBlur={handleTitleBlur} onClick={handleTitleClick} readOnly={!editable} value={title || 'Temporary Window'} onChange={handleTitleChange} />
            </div>
            <div className="right">
              <div className="star" onClick={toggleFavorite.bind(null, { wid: winId, fav: !fav })}>
                {faving ? <MdOutlineRefresh className="tip" /> : (fav ? <ImStarFull size="13" color="#FFD400" /> : <ImStarEmpty size="13" color="#78787C" />)}
              </div>
              <div className="others" onClick={toggleOptsVisible}>
                <Dots />
                <ul className="items" onMouseLeave={handleItemsMouseLeave}>
                  <li className="item" onClick={handleCopyLink}>{chrome.i18n.getMessage('copy_link')}</li>
                  <li className="item" onClick={handleSaveWindow.bind(null, winId)}>{chrome.i18n.getMessage('save_window')}</li>
                  <li className="item" onClick={handleLeave}>{chrome.i18n.getMessage('end_meeting')}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="opts">
            <div className="btns">
              <button data-tooltip={chrome.i18n.getMessage('tab_status')} className={`btn tab tooltip ${tab ? 'curr' : ''}`} data-type='tab' onClick={toggleVisible}></button>
              {/* <button title="Follow Mode" className={`btn follow ${follow ? 'curr' : ''}`} data-type='follow' onClick={toggleVisible}></button> */}
              <button data-tooltip={chrome.i18n.getMessage('voice_coming_soon')} className={`btn audio tooltip`} data-type='audio' onClick={null}></button>
            </div>
            {link && <div className="cmds">
              <div className="cmd host tooltip" data-tooltip={chrome.i18n.getMessage('host_tip')} onClick={handleBeHost}>
                {isHost ? <RiUserStarFill size={16} color="#68D6DD" /> : <RiUserReceived2Fill className="icon" size={16} />}
                <button className={`btn`} >{isHost ? chrome.i18n.getMessage('stop_hosting') : chrome.i18n.getMessage('be_host')}</button>
              </div>
              <div className="cmd copy tooltip" data-tooltip={chrome.i18n.getMessage('copy_link_tip')} onClick={handleCopyLink}>
                <IoLinkOutline className="icon" size={16} />
                <button className={`btn ${copied ? 'copied' : ''}`}>{copied ? chrome.i18n.getMessage('copiid') : chrome.i18n.getMessage('copy_link')}</button>
              </div>

              <button onClick={currUser?.host ? togglePopup : handleLeave} className="btn">
                {popup ? chrome.i18n.getMessage('cancel') : chrome.i18n.getMessage('leave')}
              </button>

            </div>}
          </div>
          {tab && <Tabs tabs={tabs} users={users} closeBlock={closeBlock} />}
          {popup && <div className="leave_pop">
            {currUser?.creator && <button className="select" onClick={handleAllLeave}>{chrome.i18n.getMessage('end_for_all')}</button>}
            <button className="select" onClick={handleLeave}>{chrome.i18n.getMessage('leave_session')}</button>
          </div>}
          {/* {follow && <FollowMode host={host} currUser={currUser} closeBlock={closeBlock} />} */}
          {behostPopoverVisible && <BehostPop handleCancelHostPop={handleCancelHostPop} />}
        </StyledWidget>
      </motion.div>
      {followTipModalVisible && !followModalClosed && <FollowModeTipModal closeModal={() => {
        setFollowTipModalVisible(false);
        followModalClosed = true;
      }} />}
    </>
  );
}
