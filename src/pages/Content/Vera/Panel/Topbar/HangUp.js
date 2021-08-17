import React from 'react';
import styled from 'styled-components';
import IconClose from '../../icons/Close';

const StyledWrapper = styled.div`
  z-index: 999;
  width: 3em;
  height: 3em;
  cursor: pointer;
  border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: #eb2027;
    }
`;
export default function HangUp({ handleClose }) {
  return (
    <StyledWrapper onClick={handleClose}>
      <IconClose />
    </StyledWrapper>
  );
}
