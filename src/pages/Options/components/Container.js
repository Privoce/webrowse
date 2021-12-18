import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import StyledDashboard from './StyledDashboard'
import Billing from './Billing';
import Profile from './Profile';
import Preference from './Preference';
import useLocalUser from '../useLocalUser';
import { useUser } from '../../common/hooks';
const StyledContainer = styled.section`
  display: flex;
  >.left{
    background: #FAFAFA;
    width: 200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    padding: 20px 8px;
    box-shadow: inset -1px 0px 0px rgba(0, 0, 0, 0.06);
    >.head{
      margin-bottom: 60px;
      display: flex;
      align-items: center;
      gap:9px;
      .logo{
        width: 32px;
        height: 32px;
      }
      .txt{
        color: #44494F;
        font-weight: 600;
        font-size: 20px;
        line-height: 20px;
      }
    }
    .nav{
      width: 100%;
      .items{
        width: 100%;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        padding: 0;
        .item{
          width: -webkit-fill-available;
          cursor: pointer;
          border-radius: 4px;
          color: #44494F;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 12px;
          line-height: 18px;
          &.curr,&:hover{
            background-color: #52E9FB;
          }
          a{
            text-decoration: none;
            color: inherit;
          }
        }
      }
    }
  }
  .right{
    display: flex;
    flex-direction: column;
  }
`;
const NavBlocks = {
  profile: {
    title: "Profile",
  },
  prefer: {
    title: "Preference",
  },
  bill: {
    title: "Billing",
  },
  about: {
    title: "About",
    link: "https://webrow.se"
  },
}
const renderComponent = (key, params) => {
  let comp = null;
  switch (key) {
    case 'profile':
      comp = <StyledDashboard title="Profile Settings" >
        <Profile {...params} />
      </StyledDashboard>
      break;
    case 'prefer':
      comp = <StyledDashboard title="Profile Settings" >
        <Preference />
      </StyledDashboard>
      break;
    case 'bill':
      comp = <StyledDashboard title="Profile Settings" >
        <Billing {...params} />
      </StyledDashboard>
      break;

    default:
      break;
  }
  return comp;
}
export default function Container() {
  const [curr, setCurr] = useState('profile');
  const { user: localUser } = useLocalUser();
  const { initialUser, user } = useUser();
  const handleNavClick = (evt) => {
    const { key } = evt.target.dataset;
    if (key == curr) return;
    setCurr(key)
  }
  useEffect(() => {
    if (localUser) {
      initialUser(localUser.id)
    }
  }, [localUser]);
  return (
    <StyledContainer>
      <div className="left">
        <header className="head">
          <img className="logo" src="https://static.nicegoodthings.com/project/ext/webrowse.logo.png" alt="logo" />
          <span className="txt">Webrowse</span>
        </header>
        <nav className="nav">
          <ul className="items">
            {Object.entries(NavBlocks).map(([key, obj]) => {
              const { link, title } = obj;
              return link ? <li key={key} className="item"><a href={link} target="_blank">{title}</a></li> : <li data-key={key} onClick={handleNavClick} key={key} className={`item ${key == curr ? 'curr' : ''}`}>{title}</li>
            })}
          </ul>
        </nav>
      </div>
      <div className="right">
        {renderComponent(curr, { user })}
      </div>
    </StyledContainer>
  )
}
