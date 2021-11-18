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
  pointer-events: all;
  font-family: sans-serif;
  background: var(--webrowse-widget-bg-color);
  border-radius: 16px;
  padding:16px 20px;
  display: flex;
  flex-direction: column;
  width: 360px;
  box-sizing: border-box;
  .top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    > .quit{
      display: flex;
      >.btn{
        background: #CE7E89;
        border-radius: 15px;
        font-size: 12px;
        line-height: 15px;
        color:#fff;
        padding:4px 12px ;
        &:hover{
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
      width: 80%;
      display: flex;
      align-items: center;
      gap: 8px;
      input{
        outline: none;
        background:none;
        padding: 4px 8px;
        border: 1px solid #056CF2;
        border-radius: 5px;
        color:var(--font-color);
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        font-weight: 800;
        font-size: 16px;
        white-space: nowrap;
        text-align: left;
        &:read-only{
          border-color: rgba(1,1,1,0);
        }
        &:hover{
          border-color: #ccc;
        }
        &:focus{
          border-color: #1FE1F9;
        }
      }
    }
  }
  >.opts{
    display: flex;
    align-items: center;
    justify-content:space-between ;
    .btns {
      display: flex;
      align-items: center;
      gap:30px;
      padding-right:16px;
      .btn{
        position: relative;
        border-radius:50%;
        width: 24px;
        height: 24px;
        background-size: 12px;
        background-position: center;
        background-repeat: no-repeat;
        padding: 0;
        margin: 0;
        line-height: 1;
        &.tab{
          background-color:#FFF9EB;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/tab.svg`});
          &.curr{
            border:1px solid #FFBD2E;
          }
        }
        /* &.follow{
          background-color:#F0FBFC;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/follow.svg`});
          &.curr{
            border:2px solid #68D6DD;
            }
        } */
        &.audio{
          background-color:#EEE8F7;
          background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mic.svg`});
          &.curr{
            border:2px solid #9B51E0;
            }
        }
      }
    }
    .cmds{
      display: flex;
      align-items: center;
      .cmd{
        display: flex;
        align-items: center;
        cursor: pointer;
        padding:4px 6px;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        border-radius: 4px;
        &:hover{
          background:  #F0FBFC;
        }
        .icon,.btn{
          color:#001529B2;
        }
        .btn{
          border:none;
          background: none;
        }
        &.copy{
          min-width: 90px;
        }
        @media (prefers-color-scheme: dark) {
          .icon,.btn{
            color:#eee;
          }
          &:hover{
            background:  none;
          }
        }
      }
      .others{
        z-index: 9;
        padding: 5px;
        cursor: pointer;
        position: relative;
        .items{
          display: none;
          padding: 8px;
          list-style: none;
          box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2), 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
          border-radius: 8px;
          position: absolute;
          right: 0;
          bottom: 0;
          white-space: nowrap;
          background-color:var(--window-bg-color);
          .item{
            font-weight: 600;
            font-size: 12px;
            line-height: 16px;
            color: var(--option-item-color);
            padding: 8px 16px;
            border-radius: 4px;
            /* transition: all .5s ease-in-out; */
            &:hover{
              background: var(--option-item-bg-color);
            }
          }
        }
        &.expand {
            svg path{
              fill:#C4C4C4;
            }
            .items{
              display: block;
            }
          }
      }
    }
  }
`;

export default StyledWidget;
