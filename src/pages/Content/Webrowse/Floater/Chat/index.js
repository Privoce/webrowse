import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';

import chatStyleCode from 'stream-chat-react/dist/css/index.css';
import 'stream-chat-react/dist/css/index.css';
import StyledBlock from '../StyledBlock';
import useLocalUser from "../../../../Options/useLocalUser";
import useStreamToken from "../../../../common/hooks/useStreamToken";

const StyledWrapper = styled(StyledBlock)`
  padding:  0;
  background-color: inherit;
  border-radius: 16px;
  overflow: hidden;
  --main-font: IBM Plex Sans, sans-serif;
  --second-font: Helvetica Neue, Helvetica, Arial, sans-serif;
  --xs-font: 10px;
  --sm-font: 12px;
  --md-font: 14px;
  --lg-font: 16px;
  --xl-font: 22px;
  --xxl-font: 26px;
  --xxxl-font: 32px;
  --font-weight-regular: 400;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
  --primary-color: #006cff;
  --primary-color-faded: #006cff5c;
  --magenta: #ff00ff;
  --red: #ff0000;
  --faded-red: #d0021b1a;
  --dt-bg-team: #1d1f22;
  --border-color: #00000014;
  --lighten-black: #808080;
  --lighten-grey: #858585;
  --light-grey: #ebebeb;
  --grey: #808080;
  --dark-grey: #343434;
  --green: #28ca42;
  --faded-green: #02d0021a;
  --white: #ffffff;
  --white5: #ffffff0d;
  --white10: #ffffff1a;
  --white20: #ffffff33;
  --white30: #ffffff4d;
  --white40: #ffffff66;
  --white50: #ffffff80;
  --white60: #ffffff99;
  --white70: #ffffffb3;
  --white80: #ffffffcc;
  --white90: #ffffffe6;
  --white95: #fffffff2;
  --black: #000000;
  --black5: #0000000d;
  --black10: #0000001a;
  --black20: #00000033;
  --black30: #0000004d;
  --black40: #00000066;
  --black50: #00000080;
  --black60: #00000099;
  --black70: #000000b3;
  --black80: #000000cc;
  --black90: #000000e6;
  --black95: #000000f2;
  --border-radius: 16px;
  --border-radius-sm: calc(var(--border-radius) / 4);
  --border-radius-md: calc(var(--border-radius) / 2);
  --border-radius-round: 999px;
  --spacing-unit: 8px;
  --xxs-p: calc(var(--spacing-unit) / 2);
  --xs-p: var(--spacing-unit);
  --sm-p: calc(var(--spacing-unit) * 2);
  --md-p: calc(var(--spacing-unit) * 2);
  --lg-p: calc(var(--spacing-unit) * 2);
  --xl-p: calc(var(--spacing-unit) * 2);
  --xxl-p: calc(var(--spacing-unit) * 2);
  --xxs-m: calc(var(--spacing-unit) / 2);
  --xs-m: var(--spacing-unit);
  --sm-m: calc(var(--spacing-unit) * 2);
  --md-m: calc(var(--spacing-unit) * 2);
  --lg-m: calc(var(--spacing-unit) * 2);
  --xl-m: calc(var(--spacing-unit) * 2);
  --xxl-m: calc(var(--spacing-unit) * 2);
  --assetsPath: "../assets";
  --accent_blue: #005fff;
  --accent_green: #20e070;
  --accent_red: #ff3742;
  --bg-gradient-end: #f7f7f7;
  --bg-gradient-start: #fcfcfc;
  --black: #000000;
  --blue-alice: #e9f2ff;
  --border: #00000014;
  --button-background: #ffffff;
  --button-text: #005fff;
  --grey: #7a7a7a;
  --grey-gainsboro: #dbdbdb;
  --grey-whisper: #ecebeb;
  --highlight: #fbf4dd;
  --modal-shadow: #00000099;
  --overlay: #00000033;
  --overlay-dark: #00000099;
  --shadow-icon: #00000040;
  --targetedMessageBackground: #fbf4dd;
  --transparent: transparent;
  --white: #ffffff;
  --white-smoke: #f2f2f2;
  --white-snow: #fcfcfc;

  .close{
    z-index: 999;
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    max-height: 70vh;
    overflow-x: hidden;
    overflow-y: overlay;
    margin: 0;
    padding: 0;
    width: -webkit-fill-available;

    .messaging.str-chat .str-chat__list {
      padding: 0 30px;
    }
    .str-chat-channel, .src-chat {
      width: 100%;
      height: 100%;
    }
    .str-chat__header-livestream {
      padding: 10px;
    }
    .str-chat__header-hamburger, .str-chat__emojiselect-wrapper {
      display: none !important;
    }
    .str-chat-channel.messaging .str-chat__main-panel {
      padding: 0;
    }
    .str-chat__send-button {
      display: block !important;
    }
    .str-chat__input-flat .rfu-file-upload-button {
      right: 20px;
    }
    .str-chat__input-flat .str-chat__textarea > textarea {
      padding-left: 20px;
    }
    .str-chat.messaging, .str-chat.commerce {
      background-color: transparent;
    }
    .str-chat__message--me .str-chat__message-inner > .str-chat__message-simple__actions,
    .str-chat__message-simple--me .str-chat__message-inner > .str-chat__message-simple__actions {
      display: none;
    }
    .loading {
      color: var(--black);
    }
  }
`;

const client = StreamChat.getInstance('py67e2vhehfx');

const ChatPage = ({ closeBlock, winId }) => {
  const [clientReady, setClientReady] = useState(false);
  const [channel, setChannel] = useState(null);

  const { user: localUser } = useLocalUser();

  const { token } = useStreamToken(localUser?.id);
  useEffect(() => {
    if (!localUser || !winId || !token) return;

    const setupClient = async () => {
      try {
        const { id, username: name, photo: image } = localUser;

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
  }, [localUser, winId, token]);

  // if (!clientReady) return <LoadingIndicator/>;

  return <StyledWrapper>
    <style>{chatStyleCode}</style>
    <style type='text/css'>{
      `#WEBROWSE_FULLSCREEN_CONTAINER[data-theme='dark'] .main {
  --bg-gradient-end: #101214;
  --bg-gradient-start: #070a0d;
  --black: #ffffff;
  --blue-alice: #00193d;
  --border: #141924;
  --button-background: #ffffff;
  --button-text: #005fff;
  --grey: #7a7a7a;
  --grey-gainsboro: #2d2f2f;
  --grey-whisper: #1c1e22;
  --modal-shadow: #000000;
  --overlay: #00000066;
  --overlay-dark: #ffffffcc;
  --shadow-icon: #00000080;
  --targetedMessageBackground: #302d22;
  --transparent: transparent;
  --white: #101418;
  --white-smoke: #13151b;
  --white-snow: #070a0d;
}
`
    }</style>
    <div className="close" data-type='tab' onClick={closeBlock} />
    <section className={'main'}>
      {
        !clientReady ? <span className='loading'>Loading</span> : <Chat client={client}>
          <Channel

            channel={channel}
          // HeaderComponent={() => <div>1212</div>}
          >
            <Window>
              <ChannelHeader image={'https://static.nicegoodthings.com/project/ext/webrowse.logo.png'} />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      }
    </section>
  </StyledWrapper>
};

export default ChatPage;
