import { useEffect, useState } from 'react'
import styled from 'styled-components';

import Login from './Login'
import useLocalUser from '../useLocalUser';
import { useUser } from '../../common/hooks'
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
  const [billInfo, setBillInfo] = useState(undefined)
  const { user } = useLocalUser();
  const { initialUser, user: dbUser, loading } = useUser();
  useEffect(() => {
    if (user) {
      initialUser({ id: user.id, username: user.username })
    }
  }, [user]);
  useEffect(() => {
    const getBillingInfo = async (cid) => {
      const resp = await fetch(`http://localhost:4000/stripe/portal/${cid}`);
      const obj = await resp.json();
      console.log("obj", obj);
      const { customer, session } = obj;
      setBillInfo({
        email: customer.email,
        expired: customer.subscriptions.data[0]?.current_period_end,
        portal_url: session.url
      })
    }
    if (dbUser && dbUser.customer) {
      getBillingInfo(dbUser.customer)
    }
  }, [dbUser])
  if (!user) return <Login />;
  if (loading) return null;
  console.log("db user", dbUser);
  const { level } = dbUser || {};
  return (
    <StyledBilling>
      <div className="item">
        <div className="title">Current Plan</div>
        <div className="block plan">
          {level == 1 ? <>
            <div className="left">
              <div className="head">Pro</div>
              <span className="desc">$14.99 / month — billed annually</span>
            </div>
            <div className="right">
              <a className="btn" href={billInfo?.portal_url} target="_blank">Change Plan</a>
            </div>
          </> : <>
            <div className="left">
              <div className="head">Pro</div>
            </div>
            <div className="right">
              <button className="btn">Change Plan</button>
            </div>
          </>}
        </div>
      </div>
      {billInfo && <div className="item">
        <div className="title">Billing</div>
        <ul className="blocks">
          <li className="block billing">
            <div className="left">
              <div className="head">Payment method</div>
              <span className="desc">Ending in {new Date(billInfo.expired * 1000).toLocaleString()}</span>
            </div>
            <div className="right">
              <a href={billInfo.portal_url} target="_blank" className="update">Update</a>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing method</div>
              <span className="desc">Annually</span>
            </div>
            <div className="right">
              <a href={billInfo.portal_url} target="_blank" className="update">Update</a>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing email</div>
              <span className="desc">{billInfo.email}</span>
            </div>
            <div className="right">
              <a href={billInfo.portal_url} target="_blank" className="update">Update</a>
            </div>
          </li>
        </ul>
      </div>}

    </StyledBilling>
  )
}
