import React from 'react'
import styled from 'styled-components';
const StyledWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 34px;
  >.head{
    color: #44494F;
    font-weight: 600;
    font-size: 18px;
    line-height: 28px;
    padding: 25px 0;
    width: 408px;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.05);
  }
`;
export default function StyledDashboard({ title = "", children }) {
  return (
    <StyledWrapper>
      <h3 className="head">{title}</h3>
      <div className="content">
        {children}
      </div>
    </StyledWrapper>
  )
}
