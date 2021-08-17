import { useState, useRef, useEffect } from 'react';
import Join from '../JoinBox';
import usePeer from '../hooks/usePeer';
import useUserMedia from '../hooks/useUserMedia';

import { getTranslateValues } from '../hooks/utils';
import StyledWrapper from './styled';
import Topbar from './Topbar';
import Info from './Info';
import Resize from './Resize';
import PermissionTip from './PermissionTip';

import Loading from '../Loading';
import CameraList from './CameraList';
import PlainDraggable from 'plain-draggable'

const quitConfirmTxt = chrome.i18n.getMessage('quitConfirm');

let draggable = null;
export default function Panel({
  users,
  sendSocketMessage,
  tempRoom,
  roomName,
  initializing,
  toggleInvitePanelVisible,
  // chatVisible = false,
  closePanel,
  // toggleChatVisible
}) {
  const { permissions } = useUserMedia();
  const { peer, shutdownPeer, dataConnections, mediaConnections, streams, status } = usePeer(sendSocketMessage);
  const [resizing, setResizing] = useState(false);
  const [panelSize, setPanelSize] = useState({ width: 440, height: 250 });
  const [movePosition, setMovePosition] = useState({ left: 0, top: 0 });
  const [layout, setLayout] = useState('hz');
  const panelRef = useRef(undefined);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined)

  const handleLayout = ({ currentTarget }) => {
    if (currentTarget.classList.contains('curr')) return;
    let tmp = currentTarget.getAttribute('layout');
    console.log('clicked layout', currentTarget, tmp);
    if (tmp == 'one' && remoteUsers.length == 0) {
      alert('No remote users.');
      return;
    }
    setLayout(tmp);
  };
  //更新过滤后的media connects
  useEffect(() => {
    if (peer) {
      console.log("update remote users", users);
      setRemoteUsers(users.filter((u) => {
        return u.peerId !== peer.id;
      }));
      setCurrentUser(users.find(u => u.peerId == peer.id))
    }
  }, [users, peer]);
  const initDraggable = () => {
    let dragEle = panelRef.current;
    let containment = document.querySelector('#VERA_FULLSCREEN_CONTAINER');
    draggable = new PlainDraggable(dragEle, {
      containment,
      // autoScroll: true,
      onMove: () => {
        // console.log({ pos, draggable });
        let { x, y } = getTranslateValues(dragEle);
        // let { left, top } = pos;
        setMovePosition({ left: x, top: y });
      }
    });
  };
  const handleResizeStop = () => {
    draggable.remove();
    initDraggable();
    setResizing(false);
  };
  const handleResizeStart = () => {
    setResizing(true);
  };
  // 拖拽
  useEffect(() => {
    if (!initializing && permissions == 'granted') {
      initDraggable();
    }
  }, [initializing, permissions]);
  const handleClose = () => {
    let letGo = Object.keys(dataConnections).length ? confirm(quitConfirmTxt) : true;
    if (letGo) {
      // 登录了  而且是临时room
      console.log({ currentUser });
      if (tempRoom && currentUser.uid) {
        let yes = confirm('do you want keep the temp room?');
        if (yes) {
          sendSocketMessage({ cmd: "KEEP_ROOM" })
        }
      }
      shutdownPeer();
      closePanel();
    }
  };
  const sendDataToPeers = (cmd) => {
    Object.entries(dataConnections).forEach(([, conn]) => {
      conn.send(cmd);
    });
  };
  let boxVisible = !currentUser?.meeting;
  let { width, height } = panelSize;
  // tip for permission
  if (['prompt', 'denied'].includes(permissions)) {
    return (
      <StyledWrapper>
        <PermissionTip type={permissions} />
      </StyledWrapper>
    );
  }
  // 还在初始化房间
  if (initializing)
    return (
      <StyledWrapper>
        <Loading />
      </StyledWrapper>
    );
  console.log('invite box visible vars', boxVisible, remoteUsers, currentUser);
  return (
    <StyledWrapper className={resizing ? 'resizing' : ''}>
      <div
        className={`panel ${layout}`}
        data-status={status}
        ref={panelRef}
        style={{ width: `${width}px`, height: `${height}px`, fontSize: `${(width / 440) * 10}px` }}
      >
        {/* camera list */}
        <CameraList
          joined={currentUser?.meeting}
          streams={streams}
          peerId={peer?.id}
          remoteUsers={remoteUsers}
          panelRef={panelRef}
          layout={layout}
          dataConnections={dataConnections}
          mediaConnections={mediaConnections}
        />
        {boxVisible ? <Join peerId={peer?.id} users={remoteUsers} roomName={roomName} sendSocketMessage={sendSocketMessage} /> : null}
        <Topbar
          close={handleClose}
          sendDataToPeers={sendDataToPeers}
          peerId={peer?.id}
          layout={layout}
          handleLayout={handleLayout}
          // chatVisible={chatVisible}
          toggleInvitePanelVisible={toggleInvitePanelVisible}
        // toggleChatBoxVisible={toggleChatVisible}
        />
        <Info />
      </div>
      {layout !== 'min' && (
        <Resize
          {...panelSize}
          {...movePosition}
          updateSize={setPanelSize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      )}
    </StyledWrapper>
  );
}
