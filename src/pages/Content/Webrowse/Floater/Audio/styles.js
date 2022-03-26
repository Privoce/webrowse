/**
 * @author: laoona
 * @date:  2022-03-19
 * @time: 17:48
 * @contact: laoona.com
 * @description: #
 */

import styled from 'styled-components';
import StyledBlock from "../StyledBlock";

const StyledVoice = styled(StyledBlock)`
  display: block;
  padding: 12px 0;
  background: var(--tab-status-bg-color);
  .title {
    position: relative;
  }
  .status {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%); 
    font-size: 12px;
  }
  .wrapper {
    padding: 0 20px;
  }
  .voiceItems {
    margin: 0; 
    padding: 0;
  }
  .voiceItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    color: var(--font-color);
    svg {
      vertical-align: top;
    }
    .main {
      display: flex; 
      align-items: center;
    }
    .avatarBox {
      width: 20px;    
      height: 20px;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar {
      width: 100%;
      height: 100%;
    }
    .name {
      text-align: left; 
      margin-left: 4px;
      font-size: 12px;
      line-height: 18px;
    }
    .buttons {
      display: flex;
    }
    .button {
      cursor: pointer;
      display: flex;
      width: 24px;
      height: 24px;
      background-color: transparent;
      border: none;
      align-items: center;
      justify-content: center;
    }
    .mic {
      
    }
    .speaker {
      
    }
  }
  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 12px 0 0 0;
    gap: 10px;
    .button {
      cursor: pointer;
      border-radius: 20px;
      width: 60px;
      height: 26px;
      background: rgba(228, 34, 34, 1);
      color: #fff;
      border: none;
    }
    .join {
      background: rgba(82, 233, 251, 1);
      &:disabled {
        background-color: #A0A2A5;
      }
    }
    .leave {
    }
  }
`;

export default StyledVoice;
