import { useState } from 'react'
import styled from 'styled-components';
import { MessageLocation, onMessageFromBackground } from '@wbet/message-api'
import { IoWarningOutline } from 'react-icons/io5'
import EVENTS from '../../common/events'
import { AniFadeIn } from '../../common/animates'

const StyledWrapper = styled.div`
    box-sizing: border-box;
    z-index: 10;
    position: fixed;
    right: 20px;
    top: 20px;
    min-width: 380px;
    display: flex;
    flex-direction: column;
    .notify{
      display: flex;
      align-items: center;
      gap: 12px;
      animation:${AniFadeIn} 3s forwards;
      width: -webkit-fill-available;
      border-radius: 200px;
      box-shadow:  0px 8px 24px -8px var(--shadow-color);
      padding:16px;
      background: var(--webrowse-widget-bg-color);
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color:#B54708;
    }
`;
const Sites = {
  notion: "Notion",
  figma: "Figma",
  google_docs: "Google Docs"
}
export default function AccessNotification() {
  const [item, setItem] = useState(null)
  onMessageFromBackground(MessageLocation.Content, {
    [EVENTS.ACCESS_TIP]: (data) => {
      console.log("access tip info", data);
      // const { site, index } = data;
      const { site } = data;
      if (!site) return;
      setItem(site)
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
  const handleRemoveItem = () => {
    setTimeout(() => {
      setItem(null)
    }, 1500);
  }
  return (
    <StyledWrapper className="notification">
      {item && Sites[item] && <span onAnimationEnd={handleRemoveItem} className='notify'>
        <IoWarningOutline size={18} color='#B54708' />
        Someone has no permission {Sites[item] ? `in ${Sites[item]}` : ''}
      </span>}
    </StyledWrapper>
  )
}