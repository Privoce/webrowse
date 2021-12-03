import styled, { keyframes } from 'styled-components';
const AniRotate = keyframes`
  from{
    transform:rotate(0deg);
  }
  to{
    transform:rotate(365deg);
  }
`;
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding:16px 16px 0 16px;
  >.title{
    margin-top:24px ;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #797D7E;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    .tip{
      transform-origin: center;
      animation: ${AniRotate} 1s infinite;
    }
  }
  >.block{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    border-radius: 10px;
    padding:8px 0;
    width: 100%;
    &.empty{
      align-items: center;
      justify-content: center;
      height: 238px;
      .tip{
        text-align: center;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        color: #aaa;
        padding:0 52px;
      }
    }

  }
`;
export default StyledWrapper;
