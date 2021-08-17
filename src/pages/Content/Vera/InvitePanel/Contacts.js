import React from 'react'
import styled from 'styled-components';
import useSWR from 'swr';
import StyledTitle from './StyledTitle'
import Loading from '../Loading';
const StyledWrapper = styled.section`
  width: 100%;
  .list{
    background: var(--vera-box-bg-color);
    box-shadow: 0px 4px 23px 2px rgba(5, 108, 242, 0.15);
    border-radius: 15px;
    max-height: 250px;
    overflow: scroll;
    .contact{
        display: flex;
        justify-content: space-between;
        padding:12px 16px;
        &:not(:last-child){
            border-bottom: 1px solid #eaeaea;
        }
        .info{
            display: flex;
            align-items: center;
            gap: 8px;
            .username{
                font-size: 16px;
                color:var(--vera-font-color);
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .avatar{
                width:24px;
                height:24px;
                border-radius: 50%;
            }
        }
        .invite{
            border:none;
            padding:4px 9px;
            color:#FFFFFF;
            background-color: var(--vera-theme-color);
            border-radius: 5px;
            &.invited{
                border:1px solid var(--vera-theme-color);
                background-color: transparent;
                color:var(--vera-theme-color);
            }
        }
    }
  }
`;
const fetcher = (...args) =>
  fetch(...args)
    .then((res) => res.json())
    .then((resp) => resp.data);

const PUSH_API =
  'https://api.pushy.me/push?api_key=99af377580cea20bcc845eb55d504b3454c16c80884e1806b3a4a0265856d23f';
const pushNotify = async (host, id, url = '') => {
  if (!id || !url) return { success: false };
  // TODO[eric]: put apikey here fornow, should move to a private place when in production
  // add custom icon
  const resp = await fetch(PUSH_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      to: [id],
      data: {
        message: `${host} invites you to vera!`,
        url
      },
      time_to_live: 2000
    })
  });

  return resp.json();
};
export default function Contacts({ inviteUrl = '', username = "" }) {
  const { data, error, loading } = useSWR(
    username ? `//vera.nicegoodthings.com/members/authing/${username}` : null,
    fetcher
  );

  // using a temp array is not the best solution ...
  const handleInvite = async ({ target }) => {
    const { tid, name } = target.dataset;
    // should only use one...
    // pushy notification
    target.innerHTML = 'Sending'
    const result = await pushNotify('fixed', tid, inviteUrl);
    // ws notification
    chrome.runtime.sendMessage({
      action: 'SEND_NOTIFY',
      finalName: name,
      url: inviteUrl
    });

    if (result.success) {
      target.innerHTML = 'Invited'
      target.classList.add('invited')
    } else {
      target.innerHTML = 'Failed'
    }
    setTimeout(() => {
      target.innerHTML = 'Invite';
      target.classList.remove('invited')
    }, 1500);
  };
  if (!data) return null;
  if (error) return 'error';
  if (loading) return <Loading size={90} />;
  return (
    <StyledWrapper>
      <StyledTitle>Contacts</StyledTitle>
      <ul className="list">
        {data.map((u, idx) => {

          const { username, photo, avator, traceId } = u;
          return <li key={`${username}-${idx}`} className="contact">
            <div className="info">
              <img src={photo || avator} alt="" className="avatar" />
              <span className="username" title={username}>{username}</span>
            </div>
            <button className="invite" data-name={username} data-tid={traceId} onClick={handleInvite}>Invite</button>
          </li>
        })}
      </ul>
    </StyledWrapper>
  )
}
