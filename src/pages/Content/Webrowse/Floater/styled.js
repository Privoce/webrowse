import styled from 'styled-components';
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
        cursor: pointer;
        border:none;
        border-radius:50%;
        outline: none;
        background: none;
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
        font-weight: bold;
        color:#056CF2;
        padding:5px 12px;
        border:2px solid #056CF2;
        border-radius:20px;
        outline: none;
        background:none;
        &:hover{
          background:  rgba(5, 108, 242, 0.1);;
        }
      }
    }

  }
`;

export default StyledWidget;
