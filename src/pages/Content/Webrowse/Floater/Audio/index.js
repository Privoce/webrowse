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
import useLocalUser from "../../../../Options/useLocalUser";
import {MessageLocation, sendMessageToBackground, onMessageFromBackground} from "@wbet/message-api";
import EVENTS from "../../../../common/events";

// 会议连接状文案
const statusMap = new Map([
  ['connecting', 'Connecting...'],
  ['connected', 'Connected!'],
])

const Audio = (props) => {
  const {visible = true, closeBlock, users = [], winId, voiceStatus, remoteUsers: _remoteUsers, tabs} = props;
  const [status, setStatus] = useState(undefined);
  const {user: localUser} = useLocalUser();
  const [remoteUsers, setRemoteUsers] = useState([]);
  const uri = new URL(config.MESSAGE_TARGET_ORIGIN);
  const meetingUri = `${config.MESSAGE_TARGET_ORIGIN}/voice`

  useEffect(() => {
    const message = {
      source: 'webrowse.ext',
      payload: {
        users,
        currentUser: localUser
      },
      event: 'webrows_users',
    };

    // 向指定 HOST 发送消息
    if (location.host === uri.host) {
      window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
    }
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

      console.log(status, 'haha status')
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
      [EVENTS.FIRE_VOICE_ACTION]: async (data) => {
        const {action, tabs = []} = data;
        console.log(action, 'action message');

        // 是否已经打开了 meeting tab
        const _isOpenMeeting = !!tabs.find(tab => tab?.url?.indexOf(meetingUri) > -1);

        const message = {
          source: 'webrowse.ext',
          payload: {},
          event: action,
        };

        switch (action) {
          case 'join':
            // 打开 meeting tab
            if (!_isOpenMeeting) {
              return window.open(`${config.MESSAGE_TARGET_ORIGIN}/voice?cid=${winId}`);
            }

            break;

          case 'leave':
            break;

          default:
            break;
        }

        // 当前 tab location host 不是 MESSAGE_TARGET_ORIGIN 直接退出
        if (location.host !== uri.host) return;

        // 向 MESSAGE_TARGET_ORIGIN 发送消息
        window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
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

  const renderUser = (user) => {
    const _user = user?.intUid ? user : users.find(item => item.intUid === user?.uid);

    return (
      <li key={user?.uid} className={`voiceItem ${user.current ? "current" : ""}`}>
        <div className="main">
          <div className="avatarBox">
            <img src={_user?.photo} className="avatar"/>
          </div>
          <div className="name">{_user?.username}</div>
        </div>
        <div className="buttons">
          <button className="button">
            <div className="speaker">{user?.hasVideo ? <Video/> : <VideoClose/>}</div>
          </button>
          <button className="button">
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
