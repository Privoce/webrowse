import { useState } from 'react'
import styled from 'styled-components';
const StyledWrapper = styled.div`
  position:fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(2,2,2,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal{
    background-color: #fff;
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1), 0px 8px 8px -4px rgba(16, 24, 40, 0.04);
    border-radius: 12px;
    padding: 24px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
    .title{
      position: relative;
      display: flex;
      align-items: center;
      gap: 25px;
      .toggle{
        box-sizing: border-box;
        cursor: pointer;
        padding: 0 4px;
        display: flex;
        align-items: center;
        width: 40px;
        height: 28px;
        background-color: #52E9FB;
        border-radius: 20px;
        .circle{
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color:#fff;
          transition: all .2s ease-in-out;
        }
        &.ann .circle{
          transform: translateX(14px);
        }
      }
      .txt{
        color: #44494F;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }
      .tip{
        position: absolute;
        top: 50%;
        right:-70px;
        transform: translateY(-50%);
        color: #A0A2A5;
        font-weight: 500;
        font-size: 12px;
        line-height: 18px;
      }
    }
    .cols{
      display: flex;
      align-items: flex-end;
      .col{
        color: #5C6065;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 192px;
        box-sizing: border-box;
        &.curr{
          border-radius:8px ;
          background: #E8FDFF;
          border: 1px solid #52E9FB;
        }
        >.head{
          display: flex;
          flex-direction: column;
          white-space: pre-wrap;
          .title{
            color: #000;
            font-weight: 600;
            font-size: 18px;
            line-height: 28px;
          }
        }
        .item{
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
          .contact{
            line-height: 26px;
            color: inherit;
            font-weight: bold;
            text-decoration: none;
          }
        }
        &.titles{
          >.title{
            
            &.strong{
              font-weight: bold;
            }
          }
        }
      }
    }
  }
`;
const Prices = {
  mon: {
    count: 12,
    pid: 'price_1K6tQBGGoUDRyc3jJrnb7WfJ'
  },
  ann: {
    count: 8,
    pid: 'price_1JzO1gGGoUDRyc3jXCY8WMmH'
  }
};
export default function ModalSubscription({ user, closeModal }) {
  const [subCreating, setSubCreating] = useState(false)
  const [plan, setPlan] = useState('ann')
  const handleSelectPlan = () => {
    setPlan(prev => prev == 'mon' ? 'ann' : 'mon')
  }
  const handleCloseModal = (evt) => {

    if (evt.target.classList.contains('root')) {
      closeModal()
    }
  }
  const handleUpgrade = async () => {
    if (!user) {
      return
    }
    const priceId = Prices[plan]?.pid || null;
    if (!priceId || subCreating) return;
    // return;
    const { id, username, email } = user;
    setSubCreating(true)
    const resp = await fetch(`https://vera.nicegoodthings.com/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        user: {
          id, username, email
        }
      }),
    });
    const data = await resp.json();
    if (data && data.session_url) {
      location.href = data.session_url
    }
    setSubCreating(false)
  }
  return (
    <StyledWrapper className='root' onClick={handleCloseModal}>
      <div className="modal">
        <h3 className="title">
          <span className="txt">Monthly</span>
          <div className={`toggle ${plan}`} onClick={handleSelectPlan}>
            <div className="circle"></div>
          </div>
          <span className="txt">Annually</span>
          {plan == 'ann' && <span className="tip">save 30%</span>}
        </h3>
        <div className="cols">
          <div className="col titles">
            <div className="title strong">Key Features</div>
            <div className="title">Participants</div>
            <div className="title">Tabs</div>
            <div className="title">Initiators</div>
            <div className="title">Co-hosting</div>
            <div className="title">Saved Windows</div>
            <div className="title">Voice Channel</div>
          </div>
          <div className="col curr">
            <div className="head">
              <span className="title">Free</span>
              <span className="desc">$0</span>
            </div>
            <div className="item">Current Plan</div>
            <div className="item">10</div>
            <div className="item">5</div>
            <div className="item">1</div>
            <div className="item">-</div>
            <div className="item">5</div>
            <div className="item">-</div>
          </div>
          <div className="col">
            <div className="head">
              <span className="title">Pro</span>
              <span className="desc">${Prices[plan].count}/mon</span>
            </div>
            <div className="item"><button className='btn' disabled={subCreating} onClick={handleUpgrade}>{subCreating ? 'Redirecting' : `Upgrade`}</button></div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
            <div className="item">1</div>
            <div className="item">2</div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
          </div>
          <div className="col">
            <div className="head">
              <span className="title">Enterprise</span>
              <span className="desc"> </span>
            </div>
            <div className="item"> <a href="https://calendly.com/hansu/han-meeting" target={"_blank"} className="contact">Contact Us</a></div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
            <div className="item">Unlimited</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}
