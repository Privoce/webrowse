import { useState, useEffect, useCallback, useRef } from 'react';
import Peer from 'peerjs';
import emitter, { VeraEvents, VeraStatus } from './useEmitter';
import { EVENTS } from '../../../../common'
import { destoryCursor } from '../Cursor';
import { preventCloseTabHandler, stopVideoStreams } from './utils';
const peerConfig = {
  host: 'r.nicegoodthings.com',
  // port: '80',
  path: '/ngt',
  config: {
    iceServers: [
      { urls: 'stun:47.93.119.186:3478' },
      {
        urls: 'turn:47.93.119.186:3478',
        username: 'a',
        credential: 'b'
      }
    ]
  }
  // debug: 3
};
const usePeer = (sendSocketMessage) => {
  const [myPeer, setMyPeer] = useState(null);
  const [status, setStatus] = useState('waiting');
  const [error, setError] = useState(null);
  const [dataConns, setDataConns] = useState({});
  const dataConnsRef = useRef({});
  const [mediaConns, setMediaConns] = useState({});
  const mediaConnsRef = useRef({});
  const [streams, setStreams] = useState({});
  const updateConns = ({ conn, remove = false, type = 'media' }) => {
    let current = type == 'media' ? mediaConnsRef.current : dataConnsRef.current;
    let _setState = type == 'media' ? setMediaConns : setDataConns;
    if (remove) {
      // remove
      delete current[conn.peer];
      _setState((prev) => {
        delete prev[conn.peer];
        return { ...prev };
      });
      // 如果移除的是视频连接 则把stream也去掉
      if (type == 'media') {
        setStreams((prev) => {
          delete prev[conn.peer];
          return { ...prev };
        });
      }
    } else {
      // add
      current = { ...current, [conn.peer]: conn };
      _setState((prev) => {
        prev[conn.peer] = conn;
        return { ...prev };
      });
    }
    // update to ref
    if (type == 'media') {
      mediaConnsRef.current = current;
    } else {
      dataConnsRef.current = current;
    }
  };
  // 初始化Peer
  useEffect(() => {
    if (!myPeer) {
      let newPeerClient = new Peer(peerConfig);
      setMyPeer(newPeerClient);
      // 有新加入者
      emitter.on(VeraEvents.NEW_PEER, (pid) => {
        console.log('new peer added', pid);
        // 建立datachannel连接
        let dataConn = newPeerClient.connect(pid);
        initDataChannel(dataConn);
        // 建立音视频连接
        let newMediaConn = newPeerClient.call(pid, window.LOCAL_MEDIA_STREAM);
        console.log({ newMediaConn });
        addMediaConnection(newMediaConn);
      });
      //stream有更新
      emitter.on(VeraEvents.UPDATE_STREAM, (pid) => {
        const currMediaConn = mediaConnsRef.current[pid];
        console.log("update stream event", mediaConnsRef.current, mediaConns, currMediaConn);
        if (currMediaConn) {
          // 更新音视频track
          const localStream = window.LOCAL_MEDIA_STREAM;
          const senders = currMediaConn.peerConnection.getSenders();
          console.log("replace tracks", { senders });
          senders.forEach(s => {
            let rt = localStream.getTracks().find(function (track) {
              return track.kind === s.track?.kind;
            });
            console.log("replace tracks", rt);
            s.replaceTrack(rt);
          })
          // audioSender.replaceTrack(newAudioTrack)
          // videoSender.replaceTrack(newVideoTrack)
        }
      });
    }
  }, [myPeer]);
  const clearUpConnect = (conn = null) => {
    if (!conn) return;
    // 删掉data&media连接，去掉名字
    updateConns({ conn, type: 'data', remove: true });
    updateConns({ conn, type: 'media', remove: true });
  };
  const initDataChannel = useCallback(
    (conn) => {
      conn.on('close', () => {
        console.log('peer data connection close');
        clearUpConnect(conn);
      });
      conn.on('error', (err) => {
        console.log('peer data connection error', err);
        clearUpConnect(conn);
      });
      conn.on('open', async () => {
        console.log('peer data connection open');
        console.log('new dataChannel added:', conn.peer);
        // 开始监听消息
        conn.on('data', (obj) => {
          // console.log("peer dataChannel data", obj);
          const { type = '', data } = obj;
          if (type == VeraEvents.SYNC_PLAYER) {
            emitter.emit(VeraEvents.SYNC_PLAYER, { data });
          }
          if (type.startsWith('CC_')) {
            emitter.emit(VeraEvents.CAMERA_CONTROL, { pid: conn.peer, type });
          }
          if (type.startsWith('CURSOR')) {
            emitter.emit(type, { pid: conn.peer, data });
          }
        });
        // 更新到dataConnections集合里
        updateConns({ conn, type: 'data' });
        // dataChannel ready
        setStatus(VeraStatus.READY);
      });
    },
    [myPeer]
  );
  const addMediaConnection = (mediaConn) => {
    // console.log({ mediaConns });
    mediaConn.on('close', () => {
      console.log('peer media connection close');
      clearUpConnect(mediaConn);
    });
    mediaConn.on('error', (err) => {
      console.log('peer media connection error', err);
      clearUpConnect(mediaConn);
    });
    mediaConn.on('stream', (st) => {
      setStatus(VeraStatus.STREAMING);
      console.log('peer media connection stream', st);
      setStreams((prev) => {
        prev[mediaConn.peer] = st;
        return { ...prev };
      });
    });
    // 更新到mediaConnections集合里
    updateConns({ conn: mediaConn, type: 'media' });
  };
  useEffect(() => {
    if (myPeer) {
      myPeer.on('open', () => {
        // 此时，peerId就有值了
        sendSocketMessage({ cmd: 'PEER_ID', payload: { peerId: myPeer.id } })
        console.log('peer connection open');
        setStatus(VeraStatus.OPEN);
        // 有连接请求过来
        myPeer.on('connection', (conn) => {
          window.addEventListener('beforeunload', preventCloseTabHandler);
          console.log('peer data connection incoming', conn);
          setStatus(VeraStatus.CONNECTED);
          initDataChannel(conn);
        });
      });
      myPeer.on('call', (mediaCon) => {
        // 有人呼叫
        console.log('peer connection call from the other');
        setStatus(VeraStatus.CALLING);
        // 回应
        // if (mediaConns[mediaCon.peer]) {
        //   mediaCon.answer()
        // } else {
        mediaCon.answer(window.LOCAL_MEDIA_STREAM);
        addMediaConnection(mediaCon);
        // }
      });
      myPeer.on('disconnected', () => {
        console.log('peer connection disconnected');
        setStatus(VeraStatus.DISCONNECTED);
        // 更新服务器端的状态
        sendSocketMessage({ cmd: EVENTS.USER_LEAVE_MEETING })
      });
      myPeer.on('close', () => {
        console.log('peer connection close');
        setStatus(VeraStatus.CLOSE);
        // 更新服务器端的状态
        sendSocketMessage({ cmd: EVENTS.USER_LEAVE_MEETING })
      });
      myPeer.on('error', (err) => {
        console.log('peer connection error', { err });
        setStatus(VeraStatus.ERROR);
        setError(err.type);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPeer, sendSocketMessage]);
  //关闭peer连接
  const shutdownPeer = useCallback(() => {
    window.removeEventListener('beforeunload', preventCloseTabHandler);
    // 关闭每个mediaConn
    Object.entries(mediaConnsRef.current).forEach(([pid, conn]) => {
      destoryCursor({ id: pid });
      conn.close();
    });
    myPeer.destroy();
    stopVideoStreams();
  }, [myPeer, streams]);
  return {
    shutdownPeer,
    peer: myPeer,
    dataConnections: dataConns,
    mediaConnections: mediaConns,
    addMediaConnection,
    addDatachannelConnection: initDataChannel,
    streams,
    status,
    error
  };
};

export default usePeer;
