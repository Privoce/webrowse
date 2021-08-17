import { useEffect, useState, useRef } from 'react';
import PlainDraggable from 'plain-draggable';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageInputSmall,
  VirtualizedMessageList,
  Window
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import IconClose from '../icons/Close';
import { getUser } from '../hooks/utils';
import StyledWrapper from './styled';

let timer = null;
const apiKey = 'ccwpkv6fq5fd'
export default function ChatBox({ channelId = null, visible = false, toggleVisible }) {
  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null);
  const chatBoxRef = useRef(null);
  console.log({ channelId });
  useEffect(() => {
    const initialChat = async () => {
      console.log('start init chat');
      const client = StreamChat.getInstance(apiKey, {
        timeout: 15000
      });
      const user = await getUser();
      if (user) {
        const { username, id, photo } = user;
        const response = await fetch(`https://api.yangerxiao.com/service/chat/token/${id}`);
        const { code, data: userToken } = await response.json();
        console.log({ userToken, username, id, photo });
        if (code == 0) {
          await client.connectUser(
            {
              id,
              name: username,
              image: photo
            },
            userToken
          );
        }
      } else {
        console.log('init chat guest user');
        await client.setGuestUser({
          id: Math.random().toString(20).substr(2, 6),
          name: 'Guest'
        });
      }
      // 初始化channel
      let cn = client.channel('livestream', channelId, {
        image: 'https://static.nicegoodthings.com/privoce/works.portal.logo.png',
        name: 'Webrowse Chat'
      });
      await cn.watch();
      setChannel(cn);
      setChatClient(client)
      console.log('end init chat');
      timer = setTimeout(() => {
        let chatBox = chatBoxRef.current;
        if (chatBox) {
          let dragEle = chatBox.querySelector('[class^=str-chat__header]');
          let containment = document.querySelector('#WEBROWSE_FULLSCREEN_CONTAINER');
          new PlainDraggable(chatBox, {
            handle: dragEle,
            containment
          });
        }
      }, 2000);
    };
    if (channelId && visible) {
      initialChat();
    }
    return () => {
      clearTimeout(timer);
    };
  }, [channelId, visible]);

  return (
    <StyledWrapper ref={chatBoxRef} className={`${visible ? 'visible' : ''} ${channel ? '' : 'loading'}`}>
      {(channel && chatClient) && (
        <button className="close" onClick={toggleVisible}>
          <IconClose color="#fff" />
        </button>
      )}
      {(channel && chatClient) ? (
        <Chat client={chatClient} theme="livestream dark">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader live />
              <VirtualizedMessageList />
              <MessageInput Input={MessageInputSmall} focus />
            </Window>
          </Channel>
        </Chat>
      ) : (
        <div className="loading">Loading Chat Box</div>
      )}
    </StyledWrapper>
  );
}
