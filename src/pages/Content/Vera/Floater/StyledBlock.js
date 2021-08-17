import styled from 'styled-components';
const StyledContainer = styled.div`
    position: absolute;
    bottom:100px;
    right:0;
    background:  ${(bg = '#333') => bg};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 14px;
    transition: all .5s ease-in;
    min-width: 360px;
    max-width:400px;
    >.title{
      color: #000;
      line-height: 20px;
      padding:0;
      text-align: left;
      margin-bottom: 12px;
      font-weight: bold;
      font-size: 16px;
      padding-left:26px;
      background-size: 18px;
      background-position: left center;
      background-repeat: no-repeat;
    }
    >.close{
      position: absolute;
      right:10px;
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
