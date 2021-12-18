import { useEffect, useState } from 'react'
import styled from 'styled-components';

import Login from './Login'

import ModalSubscription from './ModalSubscription';
const StyledLoading = styled.div`
  width: 408px;
  padding:50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
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
      display:flex;
      justify-content: space-between;
      width: 100%;
      a{
        color: inherit;
          text-decoration: none;
          font-weight: 500;
          font-size: 12px;
          line-height: 18px;
      }
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
const Plans = {
  month: "Monthly",
  year: "Annually"
}
export default function Billing({ user = null }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [billInfo, setBillInfo] = useState(undefined);
  const [loadingBillInfo, setLoadingBillInfo] = useState(true)

  useEffect(() => {
    const getBillingInfo = async (cid) => {
      const resp = await fetch(`https://vera.nicegoodthings.com/stripe/portal/${cid}`);
      const obj = await resp.json();
      setLoadingBillInfo(false);
      console.log("obj", obj);
      const { customer, session } = obj;
      setBillInfo({
        email: customer.email,
        expired: customer.subscriptions.data[0]?.current_period_end,
        plan: customer.subscriptions.data[0]?.plan?.interval || "month",
        price: customer.subscriptions.data[0]?.plan?.amount || 0,
        portal_url: session.url
      })
    }
    if (user) {
      if (user.customer) {
        getBillingInfo(user.customer)
      } else {
        setLoadingBillInfo(false);
      }
    }
  }, [user]);
  const toggleModal = () => {
    setModalVisible(prev => !prev)
  }
  if (!user) return <Login />;
  if (loadingBillInfo) return <StyledLoading>Loading...</StyledLoading>;
  console.log("db user", user);
  const { level } = user;
  return (<>

    <StyledBilling>
      <div className="item">
        <div className="title">Current Plan</div>
        <div className="block plan">
          {level == 1 ? <>
            <div className="left">
              <div className="head">Pro</div>
              <span className="desc">${billInfo?.price / 100} / {billInfo?.plan} — billed {Plans[billInfo?.plan]}</span>
            </div>
            <div className="right">
              <a className="btn" href={billInfo?.portal_url} target="_blank">Change Plan</a>
            </div>
          </> : <>
            <div className="left">
              <div className="head">Free</div>
            </div>
            <div className="right">
              <button className="btn" onClick={toggleModal}>Upgrade</button>
            </div>
          </>}
        </div>
      </div>
      {billInfo && <div className="item">
        <div className="title">Billing <a href={billInfo.portal_url} target="_blank">Manage</a></div>
        <ul className="blocks">
          <li className="block billing">
            <div className="left">
              <div className="head">Payment method</div>
              <span className="desc">Ending at {new Date(billInfo.expired * 1000).toLocaleString()}</span>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing cycle</div>
              <span className="desc">{Plans[billInfo.plan]}</span>
            </div>
          </li>
          <li className="block billing">
            <div className="left">
              <div className="head">Billing email</div>
              <span className="desc">{billInfo.email}</span>
            </div>
          </li>
        </ul>
      </div>}
    </StyledBilling>
    {modalVisible && <ModalSubscription user={user} closeModal={toggleModal} />}
  </>
  )
}
