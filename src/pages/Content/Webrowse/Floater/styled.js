import styled from "styled-components";
import { AniRotate, AniSlideUp, AniBounceIn } from "../../../common/animates";

const StyledWidget = styled.aside`
  pointer-events: all;
  font-family: sans-serif;
  background: var(--webrowse-widget-bg-color);
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  width: 380px;
  box-sizing: border-box;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
  .drag {
    visibility: hidden;
    cursor: move;
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 12px;
    height: 12px;
    gap: 2px;
    .line {
      width: 100%;
      height: 1px;
      background-color: #c4c4c4;
    }
  }
  &:hover .drag {
    visibility: visible;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    > .right {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 10px;
      .star {
        cursor: pointer;
        width: 21px;
        height: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        .tip {
          transform-origin: center;
          animation: ${AniRotate} 1s infinite;
        }
        &:hover {
          background: var(--icon-hover-bg);
        }
      }
      .others {
        z-index: 9;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background: var(--icon-hover-bg);
        }
        .items {
          display: none;
          padding: 8px;
          list-style: none;
          box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2),
            0px 10px 38px -10px rgba(22, 23, 24, 0.35);
          border-radius: 8px;
          position: absolute;
          right: 0;
          bottom: 0;
          white-space: nowrap;
          background-color: var(--list-bg-color);
          .item {
            font-weight: 600;
            font-size: 12px;
            line-height: 16px;
            color: var(--option-item-color);
            padding: 8px 16px;
            border-radius: 4px;
            text-align: left;
            /* transition: all .5s ease-in-out; */
            &:hover {
              background: var(--option-item-bg-hover-color);
            }
          }
        }
        &.expand {
          svg path {
            fill: #c4c4c4;
          }
          .items {
            display: block;
          }
        }
      }
    }
    > .title {
      width: 80%;
      display: flex;
      align-items: center;
      gap: 8px;
      input {
        outline: none;
        background: none;
        padding: 4px 8px;
        border: 1px solid #056cf2;
        border-radius: 5px;
        color: var(--font-color);
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        font-weight: 800;
        font-size: 16px;
        white-space: nowrap;
        text-align: left;
        &:read-only {
          border-color: rgba(1, 1, 1, 0);
        }
        &:hover {
          border-color: #ccc;
        }
        &:focus {
          border-color: #1fe1f9;
        }
      }
    }
  }
  > .opts {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btns {
      display: flex;
      align-items: center;
      gap: 8px;
      .btn {
        position: relative;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        line-height: 1;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        &:before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          margin-top: -7px;
          margin-left: -7px;
          width: 14px;
          height: 14px;
          background-size: 14px;
          background-position: center;
          background-repeat: no-repeat;
        }
        &.curr {
          background-image: linear-gradient(
            271.12deg,
            #056cf2 0.35%,
            #74d6d7 95.13%
          );
        }
        &:hover {
          outline: 1px solid var(--color-border);
        }
        &.curr:hover {
          outline: none;
        }
        &.tab {
          :before {
            background-image: var(--icon-floater-tab);
          }
          &.curr {
            :before {
              background-image: var(--icon-floater-tab-curr);
            }
          }
        }
        &.audio {
          :before {
            background-image: var(--icon-floater-audio);
          }
          &.curr {
            :before {
              background-image: var(--icon-floater-audio-curr);
            }
          }
        }

        &.chat {
          > .badge {
            position: absolute;
            bottom: 18px;
            right: 0;
            width: 8px;
            height: 8px;
            :after {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              width: 0;
              height: 0;
              border-radius: 50%;
              background-color: #e42222;
              margin: -4px 0 0 -4px;
              transform: translate(-50%, -50%);
            }
            &__active {
              :after {
                width: 8px;
                height: 8px;
                animation: ${AniBounceIn} 1s forwards;
              }
            }
          }
          :before {
            background-image: var(--icon-floater-chat);
          }
          &.curr {
            :before {
              background-image: var(--icon-floater-chat-curr);
            }
          }
        }
      }
    }
    .cmds {
      display: flex;
      align-items: center;
      gap: 4px;
      .cmd {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 4px 6px;
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        border-radius: 4px;
        &:hover {
          background: var(--icon-btn-hover-bg);
        }
        .icon,
        .btn {
          color: var(--icon-btn-color);
        }
        .btn {
          padding-right: 0;
          cursor: pointer;
          white-space: nowrap;
          border: none;
          background: none;
        }
      }
      > .btn {
        background: #e42222;
        border-radius: 15px;
        font-size: 12px;
        line-height: 15px;
        color: #fff;
        padding: 4px 12px;
        &:hover {
          background: #ba1b1b;
        }
      }
    }
  }
  .leave_pop {
    z-index: 9;
    position: absolute;
    top: 0;
    right: 0;
    animation: ${AniSlideUp} 0.5s forwards;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: var(--webrowse-widget-bg-color);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    .select {
      color: #fff;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      border-radius: 15px;
      background: #5c6065;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;
      padding: 4px 12px;
      /* &:hover {
        background: #ba1b1b;
      } */
    }
  }
  .tooltip {
    position: relative;
    &:after {
      visibility: hidden;
      content: attr(data-tooltip);
      position: absolute;
      left: 50%;
      top: -22px;
      transform: translateX(-50%);
      background: #161616;
      box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      font-weight: 600;
      font-size: 10px;
      line-height: 12px;
      color: #ffffff;
      padding: 2px 3px;
      white-space: nowrap;
    }
    &:hover {
      &:after {
        visibility: visible;
      }
    }
  }
`;

export default StyledWidget;
