import React from 'react'
import styled from 'styled-components';
const StyledTriangle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 8px;
    transition: all .5s ease;
    &.down{
      transform: rotate(90deg);
      transform-origin: center;
    }
`;
export default function Triangle({ color = "#C4C4C4", direction = "" }) {
  return (
    <StyledTriangle className={`triangle ${direction}`}>
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
        <path d="M4.8764 3.18912C5.42946 3.58825 5.42946 4.41175 4.87641 4.81088L1.58521 7.1861C0.923842 7.6634 0 7.19083 0 6.37522L0 1.62478C0 0.809174 0.923841 0.336598 1.58521 0.813896L4.8764 3.18912Z" fill={color} />
      </svg>
    </StyledTriangle>

  )
}
