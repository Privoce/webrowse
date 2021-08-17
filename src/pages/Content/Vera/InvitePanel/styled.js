import styled, { keyframes } from 'styled-components';
const SlideUp = keyframes`
 from {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`;
const StyledWrapper = styled.div`
position: relative;
    width: 320px;
    pointer-events: all;
    position: fixed;
    bottom:10px;
    right:10px;
    border-radius: var(--vera-panel-border-radius);
    background: var(--vera-panel-bg-color);
    padding:68px 30px 27px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: ${SlideUp} .8s ease-in-out;
`;

export default StyledWrapper;