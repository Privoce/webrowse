import styled, { keyframes } from 'styled-components';
const AniScaleIn = keyframes`
  from {
    transform: scale(0.5, 0.5);
    opacity: 0.5;
  }
  to {
    transform: scale(2.5, 2.5);
    opacity: 0;
  }
`;
const StyledCursor = styled.div`
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  will-change: transform;
  pointer-events: none;
  &.disable {
    pointer-events: none;
    display: none;
  }
  .circle {
    border-radius: 50%;
    background-color: deepskyblue;
    position: absolute;
    left: -50%;
    top: -50%;
    width: 40px;
    height: 40px;
    opacity: 0;
  }
  &.clicked .circle {
    animation: ${AniScaleIn} 0.5s cubic-bezier(0.36, 0.11, 0.89, 0.32);
    // animation-iteration-count: 2;
  }
  .pointer {
    width: 25px;
    height: 25px;
    background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/cursor.svg`});
    background-size: contain;
    filter: drop-shadow(0px 0px 6px rgba(0, 0, 0, 0.8));
  }
  .name {
    margin-top: 5px;
    font-size: 10px;
    color: #333;
    padding: 4px 6px;
    background-color: ${({ color }) => color};
  }
`;

export default StyledCursor;
