// import {useRef} from 'react';
import ReactDOM from 'react-dom';
import Webrowse from './Webrowse';
import root from 'react-shadow/styled-components';
const PanelID = 'PORTAL_WEBROWSE_PANEL';
console.log('index.ext exe');
let panel = document.createElement('webrowse');
panel.id = PanelID;
document.body.appendChild(panel);
ReactDOM.render(
  <root.div>
    <Webrowse />
  </root.div>, document.getElementById(PanelID));
