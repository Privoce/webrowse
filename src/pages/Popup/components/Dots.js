import React from 'react'
import styled from 'styled-components';
const StyledDots = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transition: all .5s ease;
`;
export default function Dots({ color = "var(--icon-color)" }) {
  return (
    <StyledDots className={`dots`}>
      <svg width="2" height="10" viewBox="0 0 2 10" fill="none" >
        <path fillRule="evenodd" clipRule="evenodd" d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2ZM2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5ZM2 9C2 9.55229 1.55228 10 1 10C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8C1.55228 8 2 8.44771 2 9Z" fill={color} />
      </svg>
    </StyledDots>
  )
}
