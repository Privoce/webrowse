import { useState, useEffect } from 'react';
const videoStreamConfig = {
  video: {
    facingMode: 'user',
    width: { min: 200, ideal: 400, max: 720 },
    height: { min: 200, ideal: 400, max: 720 }
  },
  audio: false
};
const audioStreamConfig = {
  video: false,
  audio: {
    noiseSuppression: true, // 降噪
    echoCancellation: true // 回音消除
  }
};
const fullStreamConfig = {
  video: {
    facingMode: 'user',
    width: { min: 200, ideal: 400, max: 720 },
    height: { min: 200, ideal: 400, max: 720 }
  },
  audio: {
    noiseSuppression: true, // 降噪
    echoCancellation: true // 回音消除
  }
};
const Tips = {
  ['NotAllowedError']: 'Allow Webrowse to use your camera & microphone'
};
window.LOCAL_MEDIA_STREAM = window.LOCAL_MEDIA_STREAM || null;
export default function useUserMedia() {
  const [mediaStream, setMediaStream] = useState(window.LOCAL_MEDIA_STREAM);
  const [error, setError] = useState(null);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState(null);
  const [micPermissionStatus, setMicPermissionStatus] = useState(null);
  const getUserMedia = async (config = fullStreamConfig) => {
    // 一次性获取两个授权
    let devices = await navigator.mediaDevices.enumerateDevices();
    let hasCamera = devices.some((d) => {
      return d.kind == 'videoinput';
    });
    let hasAudio = devices.some((d) => {
      return d.kind == 'audioinput';
    });
    let mediaConfig =
      hasCamera && hasAudio
        ? fullStreamConfig
        : hasCamera
          ? videoStreamConfig
          : hasAudio
            ? audioStreamConfig
            : null;
    if (mediaConfig) {
      config.video = config.video ? {
        facingMode: 'user',
        width: { min: 200, ideal: 400, max: 720 },
        height: { min: 200, ideal: 400, max: 720 }
      } : config.video;
      let finalConfig = { ...mediaConfig, ...config };
      console.log({ finalConfig });
      const stream = await navigator.mediaDevices.getUserMedia(finalConfig);
      // window.LOCAL_MEDIA_STREAM = null;
      window.LOCAL_MEDIA_STREAM = stream;
      return stream;
    }
    // 既没有摄像头 也没有麦克风
    return null;
  };
  const enableStream = async () => {
    if (window.LOCAL_MEDIA_STREAM) return window.LOCAL_MEDIA_STREAM;
    try {
      const st = await getUserMedia();
      setMediaStream(st);
      return st;
    } catch (error) {
      let { name } = error;
      console.log(error, { name });
      setError({
        type: name,
        tip: Tips[name]
      });
      return null;
    }
  };
  useEffect(() => {
    const getAllPermissions = async () => {
      // We use Promise.all to wait until all the permission queries are resolved
      let ps = await Promise.all(
        ['camera', 'microphone'].map(async (permissionName) => {
          let p = navigator.permissions.query({ name: permissionName });
          return p;
          // allPermissions.push({ permissionName, state: permission.state });
        })
      );
      ps.forEach((p, idx) => {
        const __setStatus = idx == 0 ? setCameraPermissionStatus : setMicPermissionStatus;
        __setStatus(p.state);
        if (p.status !== 'granted') {
          p.onchange = ({ target: { state } }) => {
            __setStatus(state);
          };
        }
      });
      console.log({ ps });
    };
    getAllPermissions();
  }, []);
  // 更新到全局变量
  useEffect(() => {
    window.LOCAL_MEDIA_STREAM = mediaStream;
  }, [mediaStream]);

  const stopStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  let ps = [cameraPermissionStatus, micPermissionStatus];
  let permissions = ps.includes('prompt')
    ? 'prompt'
    : ps.includes('denied')
      ? 'denied'
      : ps.filter((p) => p == 'granted').length == 2
        ? 'granted'
        : 'error';
  useEffect(() => {
    if (permissions == 'prompt') {
      getUserMedia();
    }
  }, [permissions]);
  return {
    getUserMedia,
    mediaStream,
    permissions,
    enableStream,
    stopStream,
    error
  };
}
