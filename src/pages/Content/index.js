import { useState, useEffect } from "react";

import ReactDOM from "react-dom/client";
import EVENTS from "../common/events";
import Webrowse from "./Webrowse";
import shadowRoot from "react-shadow/styled-components";
import { onMessageFromBackground, MessageLocation } from "@wbet/message-api";
import GraphQL from "../common/GraphQL";
const PanelID = "PORTAL_WEBROWSE_PANEL";
console.log("index.ext exe");
let panel = document.createElement("webrowse");
panel.id = PanelID;
document.body.appendChild(panel);

const root = ReactDOM.createRoot(panel);

const Portal = () => {
  const [floaterVisible, setFloaterVisible] = useState(false);
  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.CHECK_CONNECTION]: (connected = false) => {
        console.log("connection check", connected);
        setFloaterVisible(connected);
      },
    });
  }, []);
  // 禁止与页面上的一些快捷键冲突 (github etc)
  const handleKeydown = (evt) => {
    // 排除聊天的文本域、或者按下了 Enter 键
    if (evt.target.classList.contains("rta__textarea") || +evt.keyCode === 13) {
      return false;
    }

    evt.stopPropagation();
  };
  return floaterVisible ? (
    <shadowRoot.div onKeyDown={handleKeydown}>
      <GraphQL>
        <Webrowse />
      </GraphQL>
    </shadowRoot.div>
  ) : null;
};
root.render(<Portal />);
