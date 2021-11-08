import styled, { keyframes } from 'styled-components';

const AniDot = keyframes`
  from{
    opacity:0.2;
  }
  to{
    opacity:1;
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
    .window{
      width:-webkit-fill-available;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding:0;
      margin-bottom: 10px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      background-color: var(--window-bg-color);
      .title{
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--window-title-color);
        padding:10px 12px;
        margin: 0;
        border-radius: 8px;
        .arrow{
          cursor: pointer;
        }
        .con{
          font-weight: 600;
          font-size: 14px;
          line-height: 22px;
          color: inherit;
          white-space: nowrap;
          width: auto;
          text-overflow: ellipsis;
          overflow: hidden;
          background:none;
          padding: 4px 2px;
          border: 1px solid #056CF2;
          border-radius: 5px;
          text-align: left;
          &:read-only{
            border-color: rgba(1,1,1,0);
          }
          &.editable:hover{
            border-color: #ccc;
          }
      }

        .num{
          padding:3px 6px;
          border: 1px solid #78787c;
          border-radius: 15px;
          font-size: 10px;
          line-height: 12px;
          color: #78787c;
        }
        .live{
          position: absolute;
          top:50%;
          transform: translateY(-50%);
          right:28px;
          width: 8px ;
          height: 8px;
          border-radius: 50%;
          background-color: #39FF14;
          animation: ${AniDot} 1s ease-in-out infinite alternate;
        }
        .start{
          display: none;
          cursor: pointer;
          border: none;
          padding:4px 12px;
          position: absolute;
          top:50%;
          transform: translateY(-50%);
          right:28px;
          color:#fff;
          background: #52EDFF;
          border-radius: 15px;
          font-weight: bold;
          font-size: 12px;
          line-height: 16px;
          text-align: center;
        }
        .opts{
          display: none;
          cursor: pointer;
          position: absolute;
          top:50%;
          right:10px;
          width: 10px;
          align-items: center;
          justify-content: center;
          transform: translate3d(0, -50%, 0);
          z-index: 9999;
          .items{
            display: none;
            padding: 8px;
            list-style: none;
            box-shadow: 0px 10px 20px -15px rgba(22, 23, 24, 0.2), 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
            border-radius: 8px;
            position: absolute;
            right: 0;
            top: 5px;
            white-space: nowrap;
            background-color:var(--window-bg-color);
            .item{
              font-weight: 600;
              font-size: 12px;
              line-height: 16px;
              color: var(--option-item-color);
              padding: 8px 16px;
              border-radius: 4px;
              /* transition: all .5s ease-in-out; */
              &:hover{
                background: var(--option-item-bg-color);
              }
            }
          }
          &.expand {
            svg path{
              fill:#C4C4C4;
            }
            .items{
              display: block;
            }
          }
        }
      }
      .tabs{
        margin: 0;
        padding: 0 12px;
        list-style: none;
        display: none;
        flex-direction: column;
        gap: 8px;
        margin-left: 20px;
        margin-bottom: 10px;
        overflow: scroll;
        .tab{
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 8px;
          img{
            width:16px;
            height:16px;
          }
          .con{
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 280px;
            overflow: hidden;
            font-weight: normal;
            font-size: 12px;
            line-height: 15px;
            color: var(--tab-title-color);
          }

        }
      }
      &.expand{
        .tabs{
          display: flex;
        }
        .title .arrow{
          transform: rotate(0);
        }
      }
      &:hover{
        .title{
          background: var(--option-item-bg-hover-color);
          .start{
            display: block;
          }
          .opts{
            display: flex;
          }
        }
      }
    }
  }
`;
export default StyledWrapper;
