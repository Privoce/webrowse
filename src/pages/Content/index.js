import React from 'react';
import ReactDOM from 'react-dom';
import Webrowse from './Webrowse';

const PanelID = 'PORTAL_WEBROWSE_PANEL';
console.log('index.ext exe');
let panel = document.createElement('aside');
panel.id = PanelID;
document.body.appendChild(panel);
ReactDOM.render(<Webrowse />, document.getElementById(PanelID));
