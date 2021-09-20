import { useEffect, useState } from 'react';

import emitter, { VeraEvents } from './useEmitter';
import { EVENTS } from '../../../../common'
import { sendMessageToBackground, onMessageFromBackground, MessageLocation } from '@wbet/message-api'

import { Howl } from 'howler';
let joined = false;
var SoundEnterRoom = new Howl({
  src: [`chrome-extension://${chrome.runtime.id}/assets/sounds/enter.room.mp3`],
  volume: 1,
});
var SoundLeaveRoom = new Howl({
  src: [`chrome-extension://${chrome.runtime.id}/assets/sounds/leave.room.mp3`],
  volume: 1,
});
const useSocketRoom = () => {
  const [temp, setTemp] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [winId, setWinId] = useState('')
  const [user, setUser] = useState(null)
  const [roomName, setRoomName] = useState('')
  const [users, setUsers] = useState([]);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    console.log('io init', user, roomId);
    if (!user || !roomId) {
      return;
    }
    let finalRoomId = roomId;
    let temp = false;
    let link = '';
    if (roomId.endsWith('_temp')) {
      setTemp(true)
      temp = true;
      link = location.href;
      finalRoomId = roomId.split('_temp')[0]
    }
    // 给background发消息：初始化websocket
    sendMessageToBackground({
      roomId: finalRoomId, winId, link, temp, user
    }, MessageLocation.Content, EVENTS.ROOM_SOCKET_INIT);
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.CURRENT_USERS]: (data) => {
        console.log("current users", data);
        const { roomName, users } = data;
        setRoomName(roomName);
        setUsers(users);
        // 首次
        // if (!update) {
        // 拿到了房间当前人员列表，才算初始化完
        setInitializing(false);
        // }
      },
      [EVENTS.USER_ENTER]: (data) => {
        console.log("user enter room", data);
        const { user } = data;
        setUsers((users) => [...users, user]);
      },
      [EVENTS.USER_JOIN_MEETING]: (data) => {
        console.log("new user joined meeting", data);
        const { user } = data;
        // 过滤下
        if (user.peerId && joined) {
          emitter.emit(VeraEvents.NEW_PEER, user.peerId);
          SoundEnterRoom.play();
        }
      },
      [EVENTS.UPDATE_USERS]: ({ users }) => {
        setUsers(users);
      },
      [EVENTS.USER_LEAVE]: (data) => {
        const { user } = data;
        setUsers((users) => users.filter((u) => u.id !== user.id));
        SoundLeaveRoom.play();
      },
    })
    // return () => {
    //   console.log("io disconnect");
    //   sendMessageToBackground({}, MessageLocation.Content, EVENTS.DISCONNECT_SOCKET);
    // };
  }, [roomId, winId, user]);
  const sendSocketMessage = (data) => {
    sendMessageToBackground({ data }, MessageLocation.Content, EVENTS.SOCKET_MSG);
    joined = true;
  };
  const initializeSocketRoom = ({ roomId, winId, user }) => {
    console.log("from index ids", roomId, winId);
    setRoomId(roomId);
    setWinId(winId);
    setUser(user)
  };
  return {
    temp,
    roomName,
    sendSocketMessage,
    initializing,
    initializeSocketRoom,
    users,
  };
};

export default useSocketRoom;
