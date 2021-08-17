import React from 'react';
import styled from 'styled-components';

const getPermissionTitle = chrome.i18n.getMessage('getPermissionTitle');
const getPermissionContent = chrome.i18n.getMessage('getPermissionContent');
const blockPermissionTitle = chrome.i18n.getMessage('blockPermissionTitle');
const blockPermissionContent = chrome.i18n.getMessage('blockPermissionContent');
const StyledWrapper = styled.div`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-size: 12px;
  width: 440px;
  height: 200px;
  background-color: var(--vera-panel-bg-color);
  padding: 20px;
  color: var(--vera-font-color);
  .title {
    font-weight: 800;
    font-size: 18px;
    margin-bottom: 10px;
  }
  .content {
    line-height: 1.6;
    img {
      display: inline;
      vertical-align: middle;
    }
  }
`;
function createMarkup() {
  return { __html: blockPermissionContent };
}
const Tips = {
  prompt: {
    title: getPermissionTitle,
    content: (
      <span>
        {getPermissionContent}
      </span>
    )
  },
  denied: {
    title: blockPermissionTitle,
    content: (
      <span dangerouslySetInnerHTML={createMarkup()}>
      </span>
    )
  }
};
export default function PermissionTip({ type = 'prompt' }) {
  const { title, content } = Tips[type];
  return (
    <StyledWrapper>
      <h3 className="title">{title}</h3>
      <div className="content">{content}</div>
    </StyledWrapper>
  );
}
