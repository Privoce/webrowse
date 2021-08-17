import { useState } from 'react';
import styled from 'styled-components';
import emitter, { VeraEvents } from '../hooks/useEmitter';
import useUserMedia from '../hooks/useUserMedia';
const tipVideo = chrome.i18n.getMessage('tipDisableVideo');
const tipAudio = chrome.i18n.getMessage('tipDisableAudio');
const tipRemoveBg = chrome.i18n.getMessage('tipRemoveBg');

const StyledWrapper = styled.div`
  z-index: 7;
  position: absolute;
  bottom: 3em;
  left: 50%;
  padding: 0.5em;
  display: flex;
  transform: translateX(-50%);
  gap: 0.8em;
  .opt {
    padding: 0;
    border: none;
    border-radius: 50%;
    height: 2.2em !important;
    width: 2.2em !important;
    min-width: unset;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    background-color: transparent;
    &:hover {
      background-color: var(--vera-panel-bg-color);
    }
    &.bg {
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/bg.rm.svg`});
      &[data-status='false'] {
        background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/bg.rm.off.svg`});
      }
    }
    &.video {
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/video.on.svg`});
      &[data-status='false'] {
        background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/video.off.svg`});
      }
    }
    &.audio {
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/audio.on.svg`});
      &[data-status='false'] {
        background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/audio.off.svg`});
      }
    }
  }
`;
export default function Controls({
  controls = {},
  setControls,
  videoRef = {},
  dataConnections
}) {
  const { getUserMedia } = useUserMedia()
  const [requesting, setRequesting] = useState(false);
  // 音视频
  const setMedia = async ({ type = 'video', enable = true }) => {
    console.log('start toggle media');
    let videoEle = videoRef.current;
    let oldStream = videoEle?.srcObject;
    let oppositeKey = type == 'video' ? 'audio' : 'video';
    let oppositeValue = controls[oppositeKey]
    let config = {
      [oppositeKey]: oppositeValue,
      [type]: enable
    }
    console.log({ config });
    const mediable = oppositeValue || enable;
    if (mediable) {
      setRequesting(true);
      let newStream = await getUserMedia()
      newStream.getTracks().forEach(t => {
        switch (t.kind) {
          case 'video': {
            if (!config.video) {
              t.stop();
              t.enabled = false;
            }
          }
            break
          case 'audio': {
            if (!config.audio) {
              t.stop();
              t.enabled = false;
            }
          }
            break;
        }
      })
      oldStream.getTracks().forEach(t => {
        t.stop();
      })
      videoEle.srcObject = null;
      videoEle.srcObject = newStream;
      // 重新赋值全局stream变量
      window.LOCAL_MEDIA_STREAM = newStream
      setRequesting(false);
    } else {
      oldStream.getTracks().forEach(t => {
        t.stop();
      })
      // videoEle.srcObject = null;
    }
    setControls((prev) => {
      console.log('controls update');
      return { ...prev, [type]: enable };
    });
    // 如果是host，则同步给每个连接
    if (dataConnections) {
      let cmd = { type: `CC_${type.toUpperCase()}_${enable ? 'ON' : 'OFF'}` };
      Object.entries(dataConnections).forEach(([, conn]) => {
        console.log('send msg to connection', conn.peer);
        conn.send(cmd);
        // 更新stream
        emitter.emit(VeraEvents.UPDATE_STREAM, conn.peer);
      });
    }
  };
  // 背景
  const setBackground = ({ keep = true }) => {
    setControls((prev) => {
      return { ...prev, bg: keep };
    });
    // 如果是host，则同步给每个连接
    if (dataConnections) {
      let cmd = { type: `CC_BG_${keep ? 'ON' : 'OFF'}` };
      Object.entries(dataConnections).forEach(([, conn]) => {
        console.log('send msg to connection', conn.peer);
        conn.send(cmd);

      });
    }
  };
  const handleMediaControl = ({ target }) => {
    // if (remote) return;
    const { type, status } = target.dataset;
    let isOn = status == 'true';
    setMedia({ type, enable: !isOn });
  };
  const handleBgControl = ({ target }) => {
    const { video } = controls;
    if (!video) return;
    const { status } = target.dataset;
    setBackground({ keep: status !== 'true' });
  };
  const { video, audio, bg } = controls;
  return (
    <StyledWrapper className="opts">
      <button
        className="opt audio"
        onClick={handleMediaControl}
        data-type={'audio'}
        data-status={audio}
        title={tipAudio}
      ></button>
      <button
        disabled={requesting}
        className="opt video"
        onClick={handleMediaControl}
        data-type={'video'}
        data-status={video}
        title={tipVideo}
      ></button>
      <button
        className="opt bg"
        onClick={handleBgControl}
        data-status={bg}
        title={tipRemoveBg}
      ></button>

    </StyledWrapper>
  );
}
