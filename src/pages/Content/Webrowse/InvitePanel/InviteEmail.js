import React from 'react'
import styled from 'styled-components';
import StyledTitle from './StyledTitle'
import AddIcon from '../icons/Add'
const StyledWrapper = styled.section`
width: 100%;
display: flex;
    flex-direction: column;
    align-items: flex-start;
  .emails{
      display: flex;
      flex-direction: column;
      width:100%;
      .email{
          display: flex;
          align-items: center;
          .input{
            background: #FFFFFF;
            border: 3px solid var(--webrowse-theme-color);
            box-sizing: border-box;
            border-radius: 5px;
            padding:10px 6px 10px 10px;
            font-size: 16px;
            line-height: 1;
            width: 100%;
    margin-right: 10px;
          }
          .add{
              width:30px;
              height:30px;
              svg{
                  width:100%
              }
          }
      }
  }
  .invite{
      margin-top: 12px;
      font-size: 20px;
      color:#fff;
      border:none;
      border-radius: 5px;
      background: var(--webrowse-theme-color);
      color:#fff;
      padding:6px 9px;
  }
`;
export default function InviteEmail() {
    return (
        <StyledWrapper>
            <StyledTitle>Invite via Email</StyledTitle>
            <div className="emails">
                <div className="email">
                    <input type="email" className="input" placeholder="Enter Email Address" />
                    <div className="add">
                        <AddIcon />
                    </div>
                </div>
            </div>
            <button className="invite">Invite</button>
        </StyledWrapper>
    )
}
