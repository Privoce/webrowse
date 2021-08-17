import styled from 'styled-components';
import { VeraStatus } from '../hooks/useEmitter';
const StyledWrapper = styled.aside`
  position: relative;
  pointer-events: none;
  font-family: sans-serif;
  margin-right: 35%;
  margin-top: -20%;
  .react-resizable {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100% !important;
    .react-resizable-handle {
      pointer-events: all;
      position: absolute;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+');
      background-position: bottom right;
      padding: 0 3px 3px 0;
      /* 暂时隐藏掉 */
      opacity: 0;
      &.react-resizable-handle-sw {
        bottom: 0;
        left: 0;
        cursor: sw-resize;
        transform: rotate(90deg);
      }
      &.react-resizable-handle-se {
        bottom: 0;
        right: 0;
        cursor: se-resize;
      }
      &.react-resizable-handle-nw {
        top: 0;
        left: 0;
        cursor: nw-resize;
        transform: rotate(180deg);
      }
      &.react-resizable-handle-ne {
        top: 0;
        right: 0;
        cursor: ne-resize;
        transform: rotate(270deg);
      }
      &.react-resizable-handle-w,
      &.react-resizable-handle-e {
        top: 50%;
        margin-top: -10px;
        cursor: ew-resize;
      }
      &.react-resizable-handle-w {
        left: 0;
        transform: rotate(135deg);
      }
      &.react-resizable-handle-e {
        right: 0;
        transform: rotate(315deg);
      }
      &.react-resizable-handle-n,
      &.react-resizable-handle-s {
        left: 50%;
        margin-left: -10px;
        cursor: ns-resize;
      }
      &.react-resizable-handle-n {
        top: 0;
        transform: rotate(225deg);
      }
      &.react-resizable-handle-s {
        bottom: 0;
        transform: rotate(45deg);
      }
    }
  }
  .panel {
    pointer-events: all;
    display: flex !important;
    align-items: center;
    justify-content: space-evenly;
    gap: 15px;
    padding: 13px 26px;
    padding-top: 40px;
    border-radius: var(--vera-panel-border-radius);
    transition: all 0.5s ease-in-out;
    transition-property: background-color;
    /* background-color: var(--vera-panel-bg-color); */
    background: var(--vera-panel-bg-color);
    font-size: 10px;
    width: fit-content !important;
    &:after {
      content: '';
      position: absolute;
      left: -15px;
      top: 0;
      width: 10px;
      height: 10px;
      background-color: #999;
      border-radius: 50%;
    }
    &[data-status='${VeraStatus.OPEN}']:after {
      background-color: #ee7f3d;
    }
    &[data-status='${VeraStatus.CLOSE}']:after {
      background-color: #fff;
    }
    &[data-status='${VeraStatus.CALLING}']:not(.min),
    &[data-status='${VeraStatus.CONNECTED}']:not(.min),
    &[data-status='${VeraStatus.READY}']:not(.min),
    &[data-status='${VeraStatus.STREAMING}']:not(.min) {
      &:after {
        background-color: #85e89e;
      }
      background: transparent;
      .topbar,
      .info,
      .hangup,
      .setting .icon,
      .cameras.slides .nav,
      &:after {
        visibility: hidden;
      }
      &:hover {
        background: var(--vera-panel-bg-color);
        .topbar,
        .info,
        .hangup,
        .setting .icon,
        .cameras.slides .nav,
        &:after {
          visibility: visible;
        }
        .cameras.slides:after {
          visibility: hidden;
        }
      }
      .cameras.slides:after {
        visibility: visible;
      }
    }
    &[data-status='${VeraStatus.CONNECTED}']:after,
    &[data-status='${VeraStatus.READY}']:after {
      background-color: #48baff;
    }
    &[data-status='${VeraStatus.DISCONNECTED}']:after {
      background-color: #ccc;
    }
    &.vt {
      flex-direction: column;
      height: fit-content !important;
      .cameras {
        flex-direction: column;
        &.slides:after{
          right: unset;
          left: 50%;
          top: unset;
          bottom:-20px;
        }
        .nav{
          left:50% !important;
          &.prev{
            top: 0;
            transform: translate3d(-50%,-50%,0) rotate(90deg);
          }
          &.next{
            top:unset;
            bottom: -50px;
            transform: translateX(-50%) rotate(90deg);
          }
        }
      }
    }
    &.one {
      gap: 0;
      width: fit-content !important;
      .cameras:not(.slides) .local {
        display: none;
      }
    }
    &.min {
      min-height: fit-content;
      min-width: 250px;
      height: fit-content !important;
      padding-bottom: 2px;
      .cameras {
        display: none;
      }
    }

    .cameras {
      position: relative;
      /* width: 20em; */
      display: flex;
      gap: 15px;
      .nav {
        z-index: 9;
        opacity: .3;
        cursor: pointer;
        visibility: hidden;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        &.prev {
          left: -20px;
        }
        &.next {
          right: -20px;
        }
        &:hover{
          opacity: 1;
        }
      }
      &.slides {
        .nav {
          visibility: visible;
        }
        gap: 0;
        .swiper-container {
          max-width: 100%;
          max-height: 100%;
        }
        &:after {
          visibility: hidden;
          content: attr(data-count);
          position: absolute;
          right: -40px;
          top: 50%;
          transform: translateY(-50%);
          padding: 4px 6px;
          border-radius: 5px;
          color: var(--vera-font-color);
          font-size: 14px;
          background: var(--vera-panel-bg-color);
        }
      }
    }
  }
  /* &:hover {
    .panel {
      background-color: var(--vera-panel-bg-color) !important;
    }
  } */
  &.resizing .panel {
    background: var(--vera-panel-bg-color) !important;
  }
`;

export default StyledWrapper;
