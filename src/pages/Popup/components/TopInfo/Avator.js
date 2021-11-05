import React from 'react'
import styled from 'styled-components';
import { stringToHexColor } from '../../../Content/Webrowse/hooks/utils'
const StyledLetterHead = styled.div`
  border-radius: 50%;
  width:24px;
  height: 24px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  color:#fff;
  background: ${({ color }) => color};
  font-size: 16px;
  font-weight: 800;
`;
const StyledHead = styled.img`
  border-radius: 50%;
  width:24px;
  height: 24px;
`;
export default function Avator({ photo = "", username = "Guest", ...rest }) {
  const color = stringToHexColor(username);
  const letter = username[0];
  return (
    photo ? <StyledHead className="head" src={photo} {...rest} /> : <StyledLetterHead color={color} className="head letter" {...rest}>{letter}</StyledLetterHead>
  )
}
