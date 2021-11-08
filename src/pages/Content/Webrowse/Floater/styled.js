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
  border-radius: 15px;
  padding:16px 20px;
  display: flex;
  flex-direction: column;
  /* &:hover{
    background:#fff;
  } */
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
      padding-right: 50px;
      display: flex;
      align-items: center;
      gap: 8px;
      input{
        background:none;
        padding: 4px 8px;
        border: 1px solid #056CF2;
        border-radius: 5px;
        color:var(--font-color);
        overflow: hidden;
        text-overflow: ellipsis;
        width: 242px;
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
      }
    }
  }
  .opts{
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
      /* border-left:1px solid #E6E9EF; */
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
