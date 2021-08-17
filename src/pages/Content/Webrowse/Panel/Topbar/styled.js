import styled from 'styled-components';

const StyledBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
  padding: 5px 1.2em;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  position: absolute;
  top: 0;
  left: 0;
  .left {
    display: flex;
    align-items: center;
    gap: 0.4em;
    .rect {
      cursor: pointer;
      width: 2em;
      height: 2em;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        width: 100%;
        height: 100%;
      }
      &.cursor,&.chat{
        svg {
          width: 80%;
          height: 80%;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .layout {
      display: flex;
      align-items: center;
      padding: 0.4em;
      gap: 1em;
    }
  }
`;

export default StyledBar
