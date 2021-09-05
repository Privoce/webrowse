import styled, { keyframes } from 'styled-components';
const AniPopup = keyframes`
  from{
    transform: translateY(0);
  }
  to{
    transform: translateY(-110%);
  }
`;
const StyledWidget = styled.aside`
  position: absolute;
  right: 10px;
  bottom: 60px;
  pointer-events: all;
  font-family: sans-serif;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  padding:16px 20px;
  display: flex;
  flex-direction: column;
  &:hover{
    background:#fff;
  }
  > .quit{
    display: flex;
    position: absolute;
    top: 14px;
    right: 20px;
    >.btn{
      background: #DCDCDC;
      border-radius: 15px;
      font-size: 12px;
      line-height: 15px;
      color:#767676;
      padding:4px 12px ;
      &:hover{
        color:#fff;
        background: #B63546;
      }
    }
    .selects{
      z-index: 9;
      position: absolute;
      top: 0;
      right: 0;
      animation:${AniPopup} .5s forwards;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap:8px;
      padding:12px;
      background: #FFFFFF;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      .select{
        color: #000;
        white-space: nowrap;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        background: #DCDCDC;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        padding:8px 12px;
      }

    }

  }
  > .title{
    color:#000;
    padding-bottom:11px;
    font-weight: 800;
    font-size: 16px;
    white-space: nowrap;
    text-align: left;
  }
  .opts{
    display: flex;
    align-items: center;
    .btns {
      display: flex;
      align-items: center;
      gap:12px;
      padding-right:16px;
      .btn{
        position: relative;
        border-radius:50%;
        width: 36px;
        height: 36px;
        background-size: 18px;
        background-position: center;
        background-repeat: no-repeat;
        padding: 0;
        margin: 0;
        line-height: 1;
        &.tab{
          background-color:#FFF9EB;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab.svg`});
          &.curr{
            border:2px solid #FFBD2E;
            }
        }
        &.follow{
          background-color:#F0FBFC;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/follow.svg`});
          &.curr{
            border:2px solid #68D6DD;
            }
        }
        &.audio{
          background-color:#EEE8F7;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mic.svg`});
          &.curr{
            border:2px solid #9B51E0;
            }
        }
      }
    }
    .copy{
      display: flex;
      align-items: center;
      padding-left:16px;
      border-left:1px solid #E6E9EF;
      .btn{
        min-width: 156px;
        position: relative;
        font-weight: bold;
        color:#056CF2;
        padding:5px 12px;
        border:2px solid #056CF2;
        border-radius:20px;
        &:hover{
          background:  rgba(5, 108, 242, 0.1);;
        }
        &.copied{
          padding-left: 30px;
          color: #fff;
          background: #056CF2;
          &:before{
            content: "ヘ";
            transform: rotateX(180deg);
            position: absolute;
            left: 16px;
            top: 15%;
        }}
      }
    }

  }
`;

export default StyledWidget;
