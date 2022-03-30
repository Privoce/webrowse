/**
 * @author: laoona
 * @date:  2022-03-19
 * @time: 17:33
 * @contact: laoona.com
 * @description: #
 */

import React, {useEffect, useState} from 'react';
import StyledVoice from "./styles";
import {AudioClose, Audio as Mic, Video, VideoClose} from './Icons';
import config from "../../../../../config";
import {MessageLocation, sendMessageToBackground, onMessageFromBackground} from "@wbet/message-api";
import EVENTS from "../../../../common/events";
import styled from "styled-components";
import {stringToHexColor} from "../../../../common/utils";

const StyledLetterHead = styled.div`
  //border: 1px solid #EBEBEC;
  border-radius: 50%;
  width:20px;
  height: 20px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  color:#fff;
  background: ${({ color }) => color};
  font-size: 12px;
  font-weight: 800;
  &[data-border='none']{
    border:none
  }
`;
// 会议连接状文案
const statusMap = new Map([
  ['connecting', 'Connecting...'],
  ['connected', 'Connected!'],
])

const Audio = (props) => {
  const {
    visible = true, closeBlock, users = [], winId, voiceStatus, remoteUsers: _remoteUsers, tabs,
    currUser: localUser = {},
  } = props;

  const [status, setStatus] = useState(undefined);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const uri = new URL(config.MESSAGE_TARGET_ORIGIN);
  const meetingUri = `${config.MESSAGE_TARGET_ORIGIN}/voice`

  /**
   * 向 webrow.se 发送消息
   * @param event
   * @param payload
   */
  const sendMessage = (event, payload = {}) => {
    const message = {
      source: 'webrowse.ext',
      payload,
      event,
    };

    // 当前 tab location host === MESSAGE_TARGET_ORIGIN
    // 向 MESSAGE_TARGET_ORIGIN 发送消息
    if (location.host === uri.host) {
      window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
    }
  };

  useEffect(() => {
    sendMessage('webrowse_users', {
      users,
      currentUser: localUser
    });
  }, [users, localUser]);

  useEffect(() => {
    const handleMessage = async (ev) => {
      const {
        source,
        event,
        payload,
      } = ev.data || {};

      const {status, remoteUsers} = payload || {};

      // 监听来自 webrow.se/voice 的消息
      if (source !== 'webrow.se/voice') return;

      switch (event) {
        case 'connect':
          setStatus(status);
          break;

        case 'remote_users':
          setRemoteUsers(remoteUsers);
          break;

        default:
          break;
      }
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    }
  }, []);

  // status 变化时更新 voiceStatus
  useEffect(() => {
    if (status === undefined) return;

    (async () => {
      await sendMessageToBackground(
        {status},
        MessageLocation.Content,
        EVENTS.UPDATE_VOICE_STATUS,
      )
    })()
  }, [status]);

  // remoteUsers 变化时更新扩展的 remoteUsers
  useEffect(() => {
    if (status === undefined) return;

    (async () => {
      await sendMessageToBackground(
        {remoteUsers},
        MessageLocation.Content,
        EVENTS.UPDATE_REMOTE_USERS,
      )
    })()
  }, [remoteUsers]);

  /**
   * 加入房间
   */
  const handleJoin = async () => {
    await sendMessageToBackground({action: 'join'}, MessageLocation.Content, EVENTS.VOICE_ACTION);
  }
  /**
   * 离开房间
   */
  const handleLeave = async () => {
    await sendMessageToBackground({action: 'leave'}, MessageLocation.Content, EVENTS.VOICE_ACTION);
  }

  useEffect(() => {
    // 监听由 content script 触发的后台 FIRE_VOICE_ACTION 事件
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.FIRE_VOICE_ACTION]: async (data = {}) => {
        const {action, payload = {}} = data;
        const {tabs = [], type = ''} = payload;

        console.log(action, type, 'action message');

        // 是否已经打开了 meeting tab
        const _isOpenMeeting = !!tabs?.find(tab => tab?.url?.indexOf(meetingUri) > -1);

        if (action === 'join' && !_isOpenMeeting) {
          // 打开 meeting tab
          return window.open(`${config.MESSAGE_TARGET_ORIGIN}/voice?cid=${winId}`);
        }

        sendMessage(action, {type});
      },
    });
  }, []);

  useEffect(() => {
    // 是否已经打开了 meeting tab
    const tab = tabs.find(tab => tab?.url?.indexOf(meetingUri) > -1);

    const handlePinned = async () => {
      await sendMessageToBackground({
        tabId: tab?.id
      },
        MessageLocation.Content,
        EVENTS.SET_PINNED)
    }

    if (tab) {
      (async () => await handlePinned())();
    }
    return () => {
    };
  }, [tabs]);

  // 关闭设备采集
  const handleMute = async (type) => {
    await sendMessageToBackground({action: 'mute', type}, MessageLocation.Content, EVENTS.VOICE_ACTION);
  }

  const renderUser = (user = {}) => {
    const _user = user?.intUid ? user : users.find(item => item.intUid === user?.uid);
    const username = _user?.username || 'Guest';

    const color = stringToHexColor(username);
    const letter = username[0];

    return (
      <li key={user?.uid} className={`voiceItem ${user?.current ? "current" : ""}`}>
        <div className="main">
          <div className="avatarBox">
            {
              _user?.photo ?
                <img src={_user?.photo} className="avatar"/>
                :
                <StyledLetterHead color={color} className="head letter">{letter}</StyledLetterHead>
            }
          </div>
          <div className="name">{_user?.username}</div>
        </div>
        <div className="buttons">
          <button
            disabled={!user?.current}
            className="button" onClick={() => handleMute('video')}>
            <div className="speaker">{user?.hasVideo ? <Video/> : <VideoClose/>}</div>
          </button>
          <button
            disabled={!user?.current}
            className="button" onClick={() => handleMute('audio')}>
            <div className="mic">{user?.hasAudio ? <Mic/> : <AudioClose/>}</div>
          </button>
        </div>
      </li>
    )
  }

  if (!visible) return <></>;

  return <StyledVoice>
    <div className="title">
      <span>Voice Channel</span><span className="status">{statusMap.get(voiceStatus)}</span>
    </div>
    <div
      title="minimize"
      className="close"
      data-type="audio"
      onClick={closeBlock}
    />
    <section className="wrapper">
      <ul className="voiceItems">
        {
          _remoteUsers?.map(user => renderUser(user))
        }
      </ul>
      <div className="footer">
        {
          voiceStatus === 'connected' ? <button
              onClick={handleLeave}
              className="button leave">Leave</button>
            : <button disabled={voiceStatus === 'connecting'} className="button join" onClick={handleJoin}>Join</button>
        }
      </div>
    </section>
  </StyledVoice>
};

export default Audio;
