/**
 * @author: laoona
 * @date:  2022-01-17
 * @time: 10:44
 * @contact: laoona.com
 * @description: #
 */
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {StreamChat} from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';
import StyledBlock from './StyledBlock';
import StylesChat from "./StylesChat";
import useLocalUser from "../../../Options/useLocalUser";

const StyledWrapper = styled(StyledBlock)`
  padding: 12px 0;
  background: var(--tab-status-bg-color);

  .main {
    height: 50vh;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: overlay;
    margin: 0;
    padding: 16px;
    width: -webkit-fill-available;
  }
`;

const client = StreamChat.getInstance('py67e2vhehfx');

const ChatPage = ({closeBlock, winId}) => {

  const [clientReady, setClientReady] = useState(false);
  const [channel, setChannel] = useState(null);

  const {user: localUser} = useLocalUser();

  console.log(localUser, 'haha1')

  useEffect(() => {
    if (!localUser || !winId) return;

    const setupClient = async () => {
      try {
        const {id, username: name, photo: image, stream_token: token} = localUser;

        console.log(localUser, 'local');

        await client.connectUser(
          {
            id,
            name,
            image,
          },
          token,
        );

        const channel = await client.channel('messaging', winId);

        // await channel.create();
        setClientReady(true);
        setChannel(channel);
      } catch (err) {
        console.log(err);
      }
    };

    setupClient();
  }, [localUser, winId]);

  // if (!clientReady) return <LoadingIndicator/>;

  return <StyledWrapper>
    <div className="close" data-type='tab' onClick={closeBlock}/>
    <div className="title">{chrome.i18n.getMessage('tab_status')}</div>
    <section className={'main'}>
      <StylesChat>
        {
          !clientReady ? 'Loading' : <Chat client={client}>
            <Channel
              channel={channel}
              // HeaderComponent={() => <div>1212</div>}
            >
              <Window>
                <ChannelHeader image={'https://getstream.io/random_svg/?name=John'}/>
                <MessageList/>
                <MessageInput/>
              </Window>
              <Thread/>
            </Channel>
          </Chat>
        }
      </StylesChat>
    </section>
  </StyledWrapper>
};

export default ChatPage;
