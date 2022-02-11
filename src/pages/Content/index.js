// import {useRef} from 'react';
import ReactDOM from "react-dom";
import Webrowse from "./Webrowse";
import root from "react-shadow/styled-components";
import GraphQL from "../common/GraphQL";
const PanelID = "PORTAL_WEBROWSE_PANEL";
console.log("index.ext exe");
let panel = document.createElement("webrowse");
panel.id = PanelID;
document.body.appendChild(panel);

// 禁止与页面上的一些快捷键冲突
const handleKeydown = (evt) => {
  // 排除聊天的文本域、或者按下了 Enter 键
  if (evt.target.classList.contains("rta__textarea") || +evt.keyCode === 13) {
    return false;
  }

  evt.stopPropagation();
};

ReactDOM.render(
  <root.div onKeyDown={handleKeydown}>
    <GraphQL>
      <Webrowse />
    </GraphQL>
  </root.div>,
  document.getElementById(PanelID)
);
