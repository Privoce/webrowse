import { keyframes } from 'styled-components';
const AniBounceIn = keyframes`
from,
 20%,
 40%,
 60%,
 80%,
 to {
   animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
 }

 0% {
   opacity: 0;
   transform: scale3d(0.3, 0.3, 0.3);
 }

 20% {
   transform: scale3d(1.1, 1.1, 1.1);
 }

 40% {
   transform: scale3d(0.9, 0.9, 0.9);
 }

 60% {
   opacity: 1;
   transform: scale3d(1.03, 1.03, 1.03);
 }

 80% {
   transform: scale3d(0.97, 0.97, 0.97);
 }

 to {
   opacity: 1;
   transform: scale3d(1, 1, 1);
 }
`;
const AniRotate = keyframes`
  from{
    transform:rotate(0deg);
  }
  to{
    transform:rotate(365deg);
  }
`;
const AniSlideUp = keyframes`
  from{
    transform: translateY(0);
  }
  to{
    transform: translateY(-110%);
  }
`;
const AniFadeIn = keyframes`
  0%{
    opacity:0.1;
  }
  50%{
    opacity:1;
  }
  100%{
    opacity:1;
  }
`;
export { AniBounceIn, AniRotate, AniSlideUp, AniFadeIn }
