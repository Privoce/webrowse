// import { useState, useEffect } from 'react'
import styled from 'styled-components';
import StyledTitle from './StyledTitle'
import IconCopied from '../icons/Copied';
import IconCopy from '../icons/Copy';
import useCopy from '../hooks/useCopy';
import { selectText } from '../hooks/utils';
const StyledWrapper = styled.section`
    width: 100%;
   padding:5px 0;
  .link {
    width: -webkit-fill-available;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0;
    font-size: 20px;
    .url {
      user-select: text;
      color: var(--vera-font-color);
      width: 100%;
      height: fit-content;
      white-space: nowrap;
      word-break: break-word;
      text-align: left;
      overflow: hidden;
      overflow-x: scroll;
      margin-right: 10px;
      background: var(--vera-box-bg-color);
        border: 3px solid var(--vera-theme-color);
        box-sizing: border-box;
        border-radius: 5px;
        padding:10px 6px 10px 10px;
        font-size: 16px;
        line-height: 1;
      &::-webkit-scrollbar-track {
        width: 5px;
        background: transparent;
      }
    }
    .copy {
      cursor: pointer;
    }
  }
`;
export default function InviteLink({ inviteUrl = '', withTitle = true }) {
  const { copied, copy } = useCopy();
  const handleLinkClick = ({ target }) => {
    selectText(target);
  };
  const handleCopyClick = () => {
    copy(inviteUrl);
  };
  return (
    <StyledWrapper>
      {withTitle && <StyledTitle>Invite via Link</StyledTitle>}
      <div className="link">
        <span className="url" onClick={handleLinkClick}>
          {inviteUrl}
        </span>
        <div className="copy" onClick={handleCopyClick}>
          {copied ? <IconCopied /> : <IconCopy />}
        </div>
      </div>
    </StyledWrapper>
  )
}
