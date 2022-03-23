/**
 * @author: laoona
 * @date:  2022-03-19
 * @time: 17:33
 * @contact: laoona.com
 * @description: #
 */

import React, {useEffect, useState} from 'react';
import StyledVoice from "./styles";
import {Mic, Speaker} from './Icons';
import config from "../../../../../config";
import useLocalUser from "../../../../Options/useLocalUser";

/*
const statusMap = new Map([
  ['connecting', 'Connecting...'],
  ['connected', 'Connected!'],
])
*/
const Audio = (props) => {
  const {visible = true, closeBlock, users = [], winId} = props;
  const [status, setStatus] = useState('');
  const { user: localUser } = useLocalUser();
  const [remoteUsers, setRemoteUsers] = useState([]);

  useEffect(() => {
    const message = {
      source: 'webrowse.ext',
      payload: {
        users,
        currentUser: localUser
      },
      event: 'webrows_users',
    };

    // 发送消息
    window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
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

  /**
   * 加入房间
   */
  const handleJoin = () => {
    window.open(`https://deve.okeydemo.com/voice?cid=${winId}`);
  }
  /**
   * 离开房间
   */
  const handleLeave = () => {
    const message = {
      source: 'webrowse.ext',
      payload: {},
      event: 'leave',
    };

    // 发送消息
    window.postMessage(message, config.MESSAGE_TARGET_ORIGIN);
  }

  if (!visible) return <></>;

  return <StyledVoice>
    <div className="title">
      <span>Voice Channel</span>{/*<span className="status">{statusMap.get(status)}</span>*/}
    </div>
    <div
      title="minimize"
      className="close"
      data-type="audio"
      onClick={closeBlock}
    />
    <section className="wrapper">
      <ul className="voiceItems" style={{display: 'none'}}>
        {
          remoteUsers?.map(user => <li key={user.id} className="voiceItem">
              <div className="main">
                <div className="avatarBox">
                  <img src={user.photo} className="avatar"/>
                </div>
                <div className="name">{user.username}</div>
              </div>
              <div className="buttons">
                <button className="button">
                  <div className="mic"><Mic/></div>
                </button>
                <button className="button">
                  <div className="speaker"><Speaker/></div>
                </button>
              </div>
            </li>
          )
        }
      </ul>
      <div className="footer">
        {
          status === 'connected' ? <button
            onClick={handleLeave}
            className="button leave">Leave</button>
            : <button className="button join" onClick={handleJoin}>Join</button>
        }
      </div>
    </section>
  </StyledVoice>
};

export default Audio;
