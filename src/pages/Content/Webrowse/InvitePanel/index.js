import { useState, useEffect } from 'react'
import StyledWrapper from './styled'
import InviteLink from './InviteLink'
import Contacts from './Contacts'
import BackButton from './Back'
import InviteButton from './InviteButton'
import InviteEmail from './InviteEmail'
import ClosePanel from '../ClosePanel'
import { onMessageFromBackground, sendMessageToBackground, MessageLocation } from '@wbet/message-api'
import { EVENTS } from '../../../../common'

export default function InvitePanel({ closePanel, username }) {
  const [inviteGuestVisible, setInviteGuestVisible] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    onMessageFromBackground(MessageLocation.Content, {
      [EVENTS.GET_INVITE_LINK]: (url) => {
        setInviteUrl(url)
      }
    });
    // 初次初始化
    sendMessageToBackground({ landing: location.href }, MessageLocation.Content, EVENTS.GET_INVITE_LINK)
  }, [])
  const toggleGuestModal = () => {
    setInviteGuestVisible(prev => !prev)
  }

  return (
    <StyledWrapper>
      <ClosePanel close={closePanel} />
      {
        inviteGuestVisible ? <>
          <BackButton onClick={toggleGuestModal}>Back to Contacts</BackButton>
          <InviteLink inviteUrl={inviteUrl} />
          <InviteEmail />
        </> :
          <>
            <InviteLink inviteUrl={inviteUrl} withTitle={false} />
            <Contacts username={username} inviteUrl={inviteUrl} />
            <InviteButton onClick={toggleGuestModal}><span className='prefix'>+</span>Invite Guest</InviteButton>
          </>
      }

    </StyledWrapper>
  )
}
