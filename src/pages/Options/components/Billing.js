import React from 'react'
import styled from 'styled-components';
const StyledBilling = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .item{
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    .title{
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: #44494F;
    }
    .block{
      width: 408px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius:4px;
      color: #44494F;
      &.plan:hover{
        background: #E8FDFF;
      }
      &.billing:hover{
        background: #FAFAFA;
      }
      .left{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        >.head{
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
        }
        .desc{
          font-weight: normal;
          font-size: 12px;
          line-height: 18px;
        }
      }
      .right{
        .update{
          color: inherit;
          text-decoration: none;
          font-weight: 500;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
  .btn{
    cursor: pointer;
    border-radius: 20px;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #fff;
    padding: 4px 12px;
    text-decoration: none;
    border: none;
    outline: none;
    background: #52E9FB;
  }
`;
export default function Billing() {
  return (
    <StyledBilling>
      <div className="item">
        <div className="title">Current Plan</div>
        <div className="block plan">
          <div className="left">
            <div className="head">Pro</div>
            <span className="desc">$14.99 / month — billed annually</span>
          </div>
          <div className="right">
            <button className="btn">Change Plan</button>
          </div>
        </div>
      </div>
      <div className="item">
        <div className="title">Billing</div>
        <ul className="blocks">
          <li className="block billing">
            <div className="left">
              <div className="head">Payment method</div>
              <span className="desc">Ending in 2450 exp. 04/27</span>
            </div>
            <div className="right">
              <a href="#" className="update">Update</a>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing method</div>
              <span className="desc">Annually</span>
            </div>
            <div className="right">
              <a href="#" className="update">Update</a>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing email</div>
              <span className="desc">yanggc333@fdas.com</span>
            </div>
            <div className="right">
              <a href="#" className="update">Update</a>
            </div>
          </li>
        </ul>
      </div>

    </StyledBilling>
  )
}
