import { useEffect, useState } from 'react';
import Setting from './Setting'
import HangUp from './HangUp'
import Arrange from './Arrange'
import IconCursor from '../../icons/Cursor';
// import IconInvite from '../../icons/Invite';
import IconSync from '../../icons/Sync';
import usePagePlayer from '../../hooks/usePagePlayer';
import emitter, { VeraEvents, VeraStatus } from '../../hooks/useEmitter';
import useDarkTheme from '../../hooks/useDarkTheme';
import StyledBar from './styled'
export default function Topbar({
  close,
  peerId,
  sendDataToPeers,
  layout,
  handleLayout,
}) {
  const { dark, updateDarkTheme } = useDarkTheme();
  const { player, setPlayTime, setPlay, setPause } = usePagePlayer();
  const [cursor, setCursor] = useState(true);
  const [videoSync, setVideoSync] = useState(true);
  const toggleVideoSync = () => {
    setVideoSync((prev) => !prev);
  };
  const toggleCursor = () => {
    let cmd = {
      type: VeraEvents.TOGGLE_CURSOR,
      data: {
        peer: peerId,
        enable: !cursor
      }
    };
    sendDataToPeers(cmd);
    setCursor((prev) => !prev);
  };

  const syncPlayerToPeers = (payload) => {
    let cmd = {
      type: VeraEvents.SYNC_PLAYER,
      data: {
        peer: peerId,
        payload
      }
    };
    sendDataToPeers(cmd);
  };
  useEffect(() => {
    const handlePlayerEvent = ({ target, type }) => {
      console.log('seek time', type);
      let time = target.currentTime;
      switch (type) {
        case 'seeked':
          if (time > 1) {
            syncPlayerToPeers({ type: 'time', content: { time } });
          }
          break;
        case 'play':
          syncPlayerToPeers({ type: 'play', content: { time } });
          break;
        case 'pause':
          syncPlayerToPeers({ type: 'pause' });
          break;
        default:
          break;
      }
    };
    const clearEvents = () => {
      player.onseeked = null;
      player.onplay = null;
      player.onpause = null;
    };
    const attachEvents = () => {
      player.onseeked = handlePlayerEvent;
      player.onplay = handlePlayerEvent;
      player.onpause = handlePlayerEvent;
    };
    const listener = ({ data }) => {
      clearEvents();
      let {
        payload: { type, content }
      } = data;
      switch (type) {
        case 'time':
          setPlayTime(content.time);
          break;
        case 'play':
          setPlay(content.time);
          break;
        case 'pause':
          setPause();
          break;
        default:
          break;
      }

      setTimeout(() => {
        attachEvents();
      }, 500);
    };
    if (player) {
      if (videoSync) {
        emitter.on(VeraEvents.SYNC_PLAYER, listener);
        attachEvents();
      } else {
        emitter.off(VeraEvents.SYNC_PLAYER, listener);
        clearEvents();
      }
    }
    return () => {
      if (player) {
        emitter.off(VeraEvents.SYNC_PLAYER, listener);
        clearEvents();
      }
    };
  }, [player, videoSync]);
  return (
    <StyledBar className="topbar">
      <div className="left">
        <div className="rect cursor" onClick={toggleCursor}>
          <IconCursor enable={cursor} />
        </div>

        {/*<div className={`rect invite`} onClick={toggleInvitePanelVisible}>
          <IconInvite visible={inviteVisible} />
        </div>*/}
        <div className={`rect setting`} >
          <Setting
            logoutVisible={status !== VeraStatus.STREAMING}
            dark={dark}
            updateDarkTheme={updateDarkTheme}
          />
        </div>
        {player && (
          <div className={`rect sync`} onClick={toggleVideoSync}>
            <IconSync enable={videoSync} />
          </div>
        )}
      </div>
      <div className="right">
        <Arrange handleLayout={handleLayout} layout={layout} />
        <HangUp handleClose={close} />
      </div>
    </StyledBar>
  );
}
