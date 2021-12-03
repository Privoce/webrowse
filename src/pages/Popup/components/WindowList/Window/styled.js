import styled, { keyframes } from 'styled-components';

const AniDot = keyframes`
  from{
    opacity:0.2;
  }
  to{
    opacity:1;
  }
`;
const StyledWindow = styled.div`
  width:-webkit-fill-available;
  display: flex;
  flex-direction: column;
  padding:0;
  margin-bottom: 10px;
  border: var(--box-border);
  border-radius: 8px;
  background-color: var(--window-bg-color);
  &.live{
      /* border: 1px solid #68CC58; */
  }
  .title{
    cursor: alias;
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--window-title-color);
    padding:10px 12px;
    padding-left: 0;
    margin: 0;
    border-radius: 8px;
    .arrow{
      cursor: pointer;
      height: 100%;
      display: flex;
      padding-left: 12px;
      align-items: center;
    }
    .con{
      position: relative;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      input{
        margin-left: -2px;
        color: inherit;
        background:none;
        outline: none;
        white-space: nowrap;
        width: 100%;
        min-width: 65px;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 2px;
        border: 1px solid #056CF2;
        border-radius: 5px;
        text-align: left;
        &:read-only{
          border-color: rgba(1,1,1,0);
        }
        &:hover{
          border-color: #ccc;
        }
        &:focus{
          border-color: #1FE1F9;
        }
      }
      &:after{
        content: attr(data-tab-count);
        color: #707478;
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
        position: absolute;
        left:0;
        top: 22px;
      }
  }
  .start{
    cursor: pointer;
    border: none;
    padding:4px 12px;
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    right:34px;
    color:#fff;
    background: #52EDFF;
    border-radius: 15px;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
  }
}
&.expand{
  .tabs{
    display: flex;
  }
  .title {
    .con:after{
      display: none;
    }
    .arrow{
      transform: rotate(0);
    }
  }
}
.btm{
  width: -webkit-fill-available;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:12px 11px 12px 28px;
  .time{
    font-size: 12px;
    line-height: 18px;
    color: #BBBCBE;
  }
  .live{
    border: 1px solid #68CC58;
    box-sizing: border-box;
    border-radius: 16px;
    color: #68cc58;
    display: block;
    padding: 2px 6px;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    animation: ${AniDot} 1s ease-in-out infinite alternate;
  }
  .members{
    /* todo */
  }

}
&:hover{
  background-color:var(--box-hover-bg) ;
}
`;

export default StyledWindow
