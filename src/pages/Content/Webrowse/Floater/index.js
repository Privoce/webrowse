import { useState, useEffect } from 'react';
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../../common'
import StyledWidget from './styled';
import Tabs from './Tabs';
import FollowMode from './FollowMode';
import useCopy from '../hooks/useCopy';
// const mock_data = [{ id: 1, host: true, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }, { id: 2, username: "杨二", photo: "https://files.authing.co/user-contents/photos/9be86bd9-5f18-419b-befa-2356dd889fe6.png" }]
export default function Floater({ showLeaveModal }) {
  const [users, setUsers] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [title, setTitle] = useState("")
  const [activeTabId, setActiveTabId] = useState(null)
  const [currUser, setCurrUser] = useState(undefined);
  const [host, setHost] = useState(undefined)
  const [visible, setVisible] = useState({ tab: false, follow: true, audio: false });
  const [inviteLink, setInviteLink] = useState('');
  const [popup, setPopup] = useState(false)
  const { copied, copy } = useCopy();
  const toggleVisible = ({ target }) => {
    const { type } = target.dataset;
    // setVisible({tab:false,follow:false})
    const value = !visible[type];
    sendMessageToBackground({ tab: type, visible: value }, MessageLocation.Content, EVENTS.CHANGE_FLOATER_TAB)
  }
  const handleCopyLink = () => {
    if (copied) return;
    copy(inviteLink);
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
      [EVENTS.GET_INVITE_LINK]: (url) => {
        console.log("get link", url);
        setInviteLink(url)
      },
      [EVENTS.UPDATE_FLOATER]: ({ roomName, floaterTabVisible, users, tabs, userId }) => {
        console.log({ floaterTabVisible, users, tabs, userId });
        setVisible(floaterTabVisible);
        setUsers(users);
        setTabs(tabs);
        let tmp = users.find(u => u.id == userId);
        let tmp2 = users.find(u => u.host);
        setCurrUser(tmp);
        setHost(tmp2);
        setTitle(roomName)
      }
    });
    // 初次初始化
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.UPDATE_TABS);
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.GET_INVITE_LINK);
  }, []);
  useEffect(() => {
    if (host && tabs && tabs.length) {
      let activeTab = tabs.find(t => t.index == host.activeIndex);
      if (activeTab) {
        setActiveTabId(activeTab.id)
      }
    }
  }, [host, tabs]);
  useEffect(() => {
    if (currUser?.follow) {
      // 立即同步
      sendMessageToBackground({ tabId: activeTabId }, MessageLocation.Content, EVENTS.JUMP_TAB);
    }
  }, [currUser, activeTabId]);
  const closeBlock = (evt) => {
    const { type } = evt.target.dataset;
    if (!type) return;
    sendMessageToBackground({ tab: type, visible: false }, MessageLocation.Content, EVENTS.CHANGE_FLOATER_TAB)
  }
  const showVeraPanel = () => {
    sendMessageToBackground({}, MessageLocation.Content, EVENTS.LOAD_VERA)
  }
  const { tab, follow, audio } = visible;
  console.log({ users, host, currUser });
  return (
    <StyledWidget >
      {title && <div className="quit">
        {popup && <div className="selects">
          {currUser?.creator && <button className="select" onClick={handleAllLeave}>End Session For All</button>}
          <button className="select" onClick={handleLeave}>Leave Session</button>
        </div>}
        <button onClick={togglePopup} className="btn">
          {popup ? 'Cancel' : (currUser?.creator ? 'End' : 'Leave')}
        </button>
      </div>}
      {title && <div className="title">{title}</div>}
      <div className="opts">
        <div className="btns">
          <button title="Tab Status" className={`btn tab ${tab ? 'curr' : ''}`} data-type='tab' onClick={toggleVisible}></button>
          <button title="Follow Mode" className={`btn follow ${follow ? 'curr' : ''}`} data-type='follow' onClick={toggleVisible}></button>
          <button title="Audio Channel" className={`btn audio ${audio ? 'curr' : ''}`} data-type='audio' onClick={showVeraPanel}></button>
        </div>
        {inviteLink && <div className="copy">
          <button className={`btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>{copied ? `Link Copied` : `Copy Link to Invite`}</button>
        </div>}
      </div>
      {tab && <Tabs tabs={tabs} users={users} closeBlock={closeBlock} />}
      {follow && <FollowMode host={host} currUser={currUser} closeBlock={closeBlock} />}
    </StyledWidget>
  );
}
