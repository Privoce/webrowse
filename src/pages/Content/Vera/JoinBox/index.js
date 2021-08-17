import styled from 'styled-components';
// import Button from '../Button';
import Login from '../Login';
import useUsername from '../hooks/useUsername';
import { EVENTS } from '../../../../common'
const joinTxt = chrome.i18n.getMessage('join');
const joinAsGuestTxt = chrome.i18n.getMessage('joinAsGuest');

const StyledBox = styled.div`
  box-sizing: border-box;
  height: 20em;
  width: 20em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  justify-content: center;
  border-radius: var(--vera-border-radius);
  .room{
    font-style: normal;
    font-weight: 800;
    font-size: 1.6em;
    line-height: 2em;
    color:var(--vera-theme-color);
  }
  .users{
    display: flex;
    flex-wrap: wrap;
    gap:2em;
    padding:1em 2em;
    background: var(--vera-box-bg-color);
    border-radius: 1.5em;
    width:-webkit-fill-available;
    overflow: scroll;
    .user{
      width:4em;
      max-height: 8em;
      display: flex;
      flex-direction: column;
      align-items: center;
      .avator{
        position: relative;
        width:3em;
        height:3em;
        img{
          width:100%;
          height:100%;
          border-radius: 50%;
        }
      }
      .username{
        font-weight: bold;
        font-size: 1em;
        line-height: 1.3em;
        color:var(--vera-font-color);
      }
      &.online .avator:after{
        position: absolute;
        right:0;
        bottom:0;
        content:"";
        width:5px;
        height:5px;
        border-radius: 50%;
        background:#8ed7a2;
        border: 1px solid #fff;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    width: 100%;
    >.btn{
      border:none;
      padding:5px 10px;
      color:#FFFFFF;
      background-color: var(--vera-theme-color);
      border-radius: .5em;
      font-weight: bold;
      font-size: 1.6em;
      line-height: 130%;
    }
  }
`;
export default function JoinBox({ peerId = '', users = [], roomName = "", sendSocketMessage }) {
  const { username } = useUsername();
  const handleJoin = () => {
    sendSocketMessage({ cmd: EVENTS.USER_JOIN_MEETING });
  };
  console.log("join data", users, roomName, peerId);
  return (
    <StyledBox>
      <h3 className="room">{roomName}</h3>
      {users && users.length ? <ul className="users">
        {users.map(u => {
          const { id, username, photo = 'https://files.authing.co/authing-console/default-user-avatar.png', meeting } = u;
          return <li key={id} className={`user ${meeting ? 'online' : ''}`}>
            <div className="avator">
              <img src={photo} alt="user avator" />
            </div>
            <span className="username">{username}</span>
          </li>;
        })}
      </ul> : null}
      <div className={`btns`}>
        {username ? null : <Login />}
        <button className="btn join" onClick={handleJoin}>{username ? joinTxt : joinAsGuestTxt}</button>
      </div>
    </StyledBox>
  );
}
