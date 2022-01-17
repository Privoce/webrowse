/**
 * @author: laoona
 * @date:  2022-01-17
 * @time: 10:44
 * @contact: laoona.com
 * @description: #
 */
import {useEffect, useState} from 'react';
import styled from 'styled-components';

import StyledBlock from './StyledBlock';
const StyledWrapper = styled(StyledBlock)`
  padding:12px 0;
  background:var(--tab-status-bg-color);
  .main {
    max-height: 70vh;
    overflow-x: hidden;
    overflow-y: overlay;
    margin: 0;
    padding: 16px;
    width: -webkit-fill-available;
    background-color: #fff;
  }
`;

const Chat = ({ closeBlock }) => {
  return <StyledWrapper >
    <div className="close" data-type='tab' onClick={closeBlock}/>
    <div className="title">{chrome.i18n.getMessage('tab_status')}</div>
    <section className={'main'}>12121</section>
  </StyledWrapper>
  };

export default Chat;
