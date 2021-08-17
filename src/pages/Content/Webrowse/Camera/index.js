import { useState, useEffect, useRef, memo } from 'react';
import emitter, { VeraEvents, VeraStatus } from '../hooks/useEmitter';
import Username from '../Username';
import { stringToHexColor } from '../hooks/utils';
import { initCursor, bindCursorSync, destoryCursor } from '../Cursor';

import ErrorMask from './ErrorMask';
import OffMask from './CameraOffMask';
import BgOffMask from './BgRemoveMask';
import useUserMedia from '../hooks/useUserMedia';
import StyledWrapper from './styled';
import Controls from './Controls';
import Pin from './Pin';
const Tips = {
  [VeraStatus.WAITING]: 'waiting',
  [VeraStatus.JOINING]: 'joining'
};
// const tipProcessing = chrome.i18n.getMessage('tipProcessing');
// status: loading ready error
function Camera({
  status,
  username = { value: 'Guest', fake: true },
  peerId,
  remote = true,
  mediaStream = null,
  dataConnection = null,
  dataConnections = null
}) {
  const [loaded, setLoaded] = useState(false);
  const [controls, setControls] = useState({ pin: false, video: true, audio: true, bg: true });
  const { enableStream, error } = useUserMedia();
  const videoRef = useRef(null);
  const updateControls = (st) => {
    console.log("update control by stream status");
    let tmp = { audio: false, video: false };
    let hasAudio = !!st.getAudioTracks().length;
    let hasVideo = !!st.getVideoTracks().length;
    tmp.audio = hasAudio;
    tmp.video = hasVideo;
    setControls((prev) => {
      return { ...prev, ...tmp };
    });
  };
  useEffect(() => {
    let videoEle = videoRef.current;
    const attachLocalStream = async () => {
      // if (videoEle.srcObject) return;
      let st = await enableStream();
      if (st) {
        updateControls(st);
        videoEle.srcObject = st;
      }
    };

    if (!remote) {
      attachLocalStream();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote, peerId]);
  useEffect(() => {
    return () => {
      // 及时销毁鼠标
      if (peerId) {
        destoryCursor({ id: peerId });
      }
    };
  }, [peerId]);
  useEffect(() => {
    let videoEle = videoRef.current;
    if (mediaStream) {
      console.log("media stream changed", mediaStream);
      videoEle.srcObject = mediaStream;
      updateControls(mediaStream);
    }
  }, [mediaStream]);

  useEffect(() => {
    const createCursor = () => {
      // 同时初始化鼠标
      let inited = initCursor({
        id: peerId,
        username: username.value,
        color: stringToHexColor(peerId)
      });
      if (inited) {
        bindCursorSync({ conn: dataConnection });
      }
    };
    if (dataConnection) {
      // 已经建立datachannel连接
      createCursor();
    }
  }, [peerId, username, dataConnection]);
  useEffect(() => {
    if (remote) {
      // 来自远程对方的消息
      const maps = {
        CC_VIDEO_ON: {
          key: 'video',
          value: true
        },
        CC_VIDEO_OFF: {
          key: 'video',
          value: false
        },
        CC_AUDIO_ON: {
          key: 'audio',
          value: true
        },
        CC_AUDIO_OFF: {
          key: 'audio',
          value: false
        },
        CC_BG_ON: {
          key: 'bg',
          value: true
        },
        CC_BG_OFF: {
          key: 'bg',
          value: false
        },
      }
      emitter.on(VeraEvents.CAMERA_CONTROL, ({ pid, type }) => {
        console.log('data connection msg in camra', pid, peerId, type);
        if (pid !== peerId) return;
        switch (type) {
          case 'CC_VIDEO_ON':
          case 'CC_VIDEO_OFF':
          case 'CC_AUDIO_ON':
          case 'CC_AUDIO_OFF':
          case 'CC_BG_ON':
          case 'CC_BG_OFF':
            setControls(prev => {
              return { ...prev, [maps[type].key]: maps[type].value }
            })
            break;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId, remote]);
  const handleLoad = () => {
    setLoaded(true);
  };
  const handlePause = ({ target }) => {
    // 保持播放
    target.play()
  };
  if (error) return <ErrorMask tip={error.tip} />;

  const { video, bg } = controls;
  const color = stringToHexColor(peerId);
  console.log({ video, loaded });
  return (
    <StyledWrapper data-peer={peerId} className={remote ? 'remote' : 'local'} color={color}>
      <div className={`video ${!bg ? 'hide_video' : ''}`}>
        <div className="name">
          <Username local={!remote} readonly={remote} name={username.value} />
        </div>

        {[VeraStatus.WAITING, VeraStatus.JOINING].includes(status) && (
          <OffMask style={{ backgroundColor: color }} tip={Tips[status]} peerId={peerId} />
        )}
        {(!video || !loaded) && <OffMask style={{ backgroundColor: color }} />}
        {!bg && <BgOffMask video={videoRef.current} color={color} />}
        <video
          controls={false}
          onPause={handlePause}
          ref={videoRef}
          onPlay={handleLoad}
          playsInline
          autoPlay
          muted={remote ? false : 'muted'}
        ></video>
        {remote ? <Pin videoEle={videoRef.current} /> : <Controls
          videoRef={videoRef}
          dataConnections={dataConnections}
          controls={controls}
          setControls={setControls}
          peerId={peerId}
        />}
      </div>
    </StyledWrapper>
  );
}
export default memo(Camera);
