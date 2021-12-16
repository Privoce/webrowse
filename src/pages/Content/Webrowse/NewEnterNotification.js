import { useState } from 'react'
import styled from 'styled-components';
import { MessageLocation, onMessageFromBackground } from '@wbet/message-api'
import { EVENTS } from '../../../common';
import { AniFadeIn } from '../../common/animates'

const StyledWrapper = styled.div`
    box-sizing: border-box;
    z-index: 10;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 380px;
    display: flex;
    flex-direction: column;
    .notify{
      animation:${AniFadeIn} 3s forwards;
      width: -webkit-fill-available;
      box-shadow:  0px 8px 24px -8px #B6B7B7;
      border-radius: 4px;
      padding:16px;
      background: var(--webrowse-widget-bg-color);
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color:var(--font-color);
    }
`;
export default function NewEnterNotification() {
  const [items, setItems] = useState([])
  onMessageFromBackground(MessageLocation.Content, {
    [EVENTS.USER_ENTER]: (data) => {
      console.log("user enter room", data);
      const { user } = data;
      setItems(prev => {
        if (!prev.includes(user.username)) {
          return [user.username, ...prev]
        }
        return prev
      })
    },
  });
  // useEffect(() => {
  //   const inter = setInterval(() => {
  //     setItems(prev => {
  //       return [Math.random().toString(36).substring(7), ...prev]
  //     })
  //     return () => {
  //       clearInterval(inter)
  //     }
  //   }, 1500);
  // }, [])
  const handleRemoveItem = (name) => {
    setItems(prev => {
      return prev.filter(itm => itm !== name)
    })
  }
  return (
    <StyledWrapper className="notification">
      {items.map(name => {
        return <span key={name} onAnimationEnd={handleRemoveItem.bind(null, name)} className='notify'>{name} just join the session now.</span>
      })}
    </StyledWrapper>
  )
}
