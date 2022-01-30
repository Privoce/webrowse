import { useEffect, useState } from "react";
import styled from "styled-components";

import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import chatStyleCode from "./shadow.css";
import "stream-chat-react/dist/css/index.css";
import StyledBlock from "../StyledBlock";
import useLocalUser from "../../../../Options/useLocalUser";
import useStreamToken from "../../../../common/hooks/useStreamToken";
import useTheme from "../../../../common/hooks/useTheme";

const StyledWrapper = styled(StyledBlock)`
  padding: 0;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  .close {
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
    > div {
      width: 100%;
    }
  }
`;

const client = StreamChat.getInstance("py67e2vhehfx");

const ChatPage = ({ closeBlock, winId }) => {
  const { isDark } = useTheme();

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
          token
        );

        const channel = await client.channel("messaging", winId);

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

  return (
    <StyledWrapper>
      <style>{chatStyleCode}</style>
      <div className="close" data-type="tab" onClick={closeBlock} />
      <section className={"main"}>
        {!clientReady ? (
          "Loading"
        ) : (
          <Chat darkMode={isDark} client={client}>
            <Channel
              channel={channel}
              // HeaderComponent={() => <div>1212</div>}
            >
              <Window>
                <ChannelHeader
                  image={
                    "https://static.nicegoodthings.com/project/ext/webrowse.logo.png"
                  }
                />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
      </section>
    </StyledWrapper>
  );
};

export default ChatPage;
