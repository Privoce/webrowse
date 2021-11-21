import { useState } from 'react'
import styled from 'styled-components';
import useSWR from 'swr'
import Avator from './Floater/Avator';
import IconClose from './icons/Close'
import { SOCKET_SERVER_DOMAIN } from '../../../common'

const StyledModal = styled.section`
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(2,2,2,.3);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal{
    position: relative;
    margin-top: -30px;
    background: #F8FBFF;
    border-radius: 5px;
    padding:20px;
    padding-top:44px ;
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    .close{
      cursor: pointer;
      position: absolute;
      top:16px;
      right:24px;
      width: 12px;
      height: 12px;
    }
    .input{
      padding:10px;
      font-size:14px ;
      background: #FFFFFF;
      border: 2px solid #056CF2;
      border-radius: 5px;
      width: 220px;
    }
    .users{
      padding:13px 10px;
      .list{
        width: 220px;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap:20px;
        background: #fff;
        border-radius: 5px;
        margin-top: 11px;
        margin-bottom: 16px;
        max-height: 112px;
        overflow: overlay;
        .item{
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          width: 40px;
          .head{

          }
          .name{
            font-size: 10px;
          }
        }
    }

    }
    .start{
      color: #fff;
      font-weight: bold;
      font-size: 14px;
      line-height: 130%;
      padding: 5px 10px ;
      background: #056CF2;
      border-radius: 5px;
      &:disabled{
        background: #606368;

      }
    }
  }
`;
const fetcher = (...args) => fetch(...args).then(res => res.json());
const prefix = SOCKET_SERVER_DOMAIN.indexOf('localhost') > -1 ? 'http:' : 'https:'
export default function UsernameModal({ roomId, startCoBrowse, closeModal }) {
  const { data, error } = useSWR(`${prefix}//${SOCKET_SERVER_DOMAIN}/webrowse/user/active/${roomId}`, fetcher)
  const [input, setInput] = useState('')
  const handleInput = (evt) => {
    const currInput = evt.target.value;
    setInput(currInput)
  }
  const handleStart = () => {
    chrome.storage.sync.set({ fakename: input }, () => {
      startCoBrowse(input)
    })
  }
  return (
    <StyledModal>
      <div className="modal">
        <div className="close" onClick={closeModal}>
          <IconClose color="#000" />
        </div>
        <input type="text" onChange={handleInput} value={input} className="input" placeholder={'Enter Your Name to Join'} />
        <div className="users">
          {error ? 'error' : (data ? <ul className="list">
            {
              data.users.map(u => {
                const { id, photo, username } = u;
                return <li key={id} className="item">
                  <Avator username={username} photo={photo} />
                  <span className="name">{username}</span>
                </li>
              })
            }
          </ul> : 'loading')}
        </div>
        <button onClick={handleStart} disabled={!input} className="start">Start Cobrowsing</button>
      </div>
    </StyledModal>
  )
}
