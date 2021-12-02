import styled from 'styled-components';
const StyledContainer = styled.div`
    position: absolute;
    bottom:100px;
    right:0;
    background:  ${({ bg = '#333' }) => bg};
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 14px;
    transition: all .5s ease-in;
    width: 380px;
    >.title{
      color: var(--font-color);
      padding:0;
      text-align: left;
      margin-bottom: 12px;
      margin-left: 20px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }
    >.close{
      position: absolute;
      right:15px;
      top:10px;
      cursor: pointer;
      width: 24px;
      height:24px;
      background-size: 18px;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/mini.svg`});
    }
`;

export default StyledContainer;
