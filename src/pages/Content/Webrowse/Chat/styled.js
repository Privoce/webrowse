import styled from 'styled-components';

const StyledWrapper = styled.div`
  visibility: hidden;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  height: 80vh;
  min-width: 40vw;
  &.visible {
    pointer-events: all;
    visibility: visible;
    &.loading{
      pointer-events: none;
    }
  }
  .str-chat-channel {
    max-height: 80vh;
  }
  .str-chat__virtual-message__author{
    font-size: 14px;
  }
  .str-chat__virtual-message__text{
    font-size: 12px;
  }
  .str-chat__virtual-message__date{
    font-size: 10px;
  }
  .str-chat__small-message-input-fileupload{
    display: flex;
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    padding: 5px;
    background-color: #444;
    color: #fff;
    font-weight: bold;
  }
  .close {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #333;
    border: none;
    cursor: pointer;
  }
`;

export default StyledWrapper;
