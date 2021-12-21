import { useState } from 'react'
import styled from 'styled-components';
import { MessageLocation, onMessageFromBackground } from '@wbet/message-api'
import { IoWarningOutline } from 'react-icons/io5'
import { EVENTS } from '../../../common';
import { AniFadeIn } from '../../common/animates'

const StyledWrapper = styled.div`
    box-sizing: border-box;
    z-index: 10;
    position: absolute;
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
  const [items, setItems] = useState([])
  onMessageFromBackground(MessageLocation.Content, {
    [EVENTS.ACCESS_TIP]: (data) => {
      console.log("access tip info", data);
      const { site, index } = data;
      const currItem = items.find(i => i.index == index);
      if (currItem) return;
      setItems(prev => {
        return [{ site, index }, ...prev]
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
  const handleRemoveItem = (index) => {
    setTimeout(() => {
      setItems(prev => {
        return prev.filter(itm => itm.index !== index)
      })
    }, 1500);
  }
  return (
    <StyledWrapper className="notification">
      {items.map(({ site, index }) => {
        const siteName = Sites[site]
        return <span key={`${site}_${index}`} onAnimationEnd={handleRemoveItem.bind(null, index)} className='notify'>
          <IoWarningOutline size={18} color='#B54708' />
          Someone has no permission {siteName ? `in ${siteName}` : ''}
        </span>
      })}
    </StyledWrapper>
  )
}
