import styled from 'styled-components';
const BackIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
  <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="black" />
</svg>;

const BackButton = styled.button`
  color:#000;
  font-size:16px;
  font-weight:bold;
  line-height:1;
  position: absolute;
  top:12px;
  left:15px;
  background: none;
  border:none;
  background-image: url(${BackIcon});
`;

export default BackButton