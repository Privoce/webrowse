import { useState } from 'react'
import styled from 'styled-components';
const tipPin = chrome.i18n.getMessage('tipPin');

const StyledButton = styled.button`
    position: absolute;
    bottom: 3em;
    left: 50%;
    transform: translateX(-50%);
    padding: 0;
    border: none;
    border-radius: 50%;
    height: 2.2em;
    width: 2.2em;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    background-color: transparent;
    background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/pin.off.svg`});
    &[data-status='false'] {
    background-image: url(${`chrome-extension://${chrome.runtime.id}/assets/icon/pin.svg`});
    }
`;
export default function Pin({ videoEle = null }) {
  const [pined, setPined] = useState(false)
  // 画中画
  const handlePin = () => {
    if (!videoEle) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    }
    if (!pined) {
      videoEle
        .requestPictureInPicture()
        .then(() => {
          setPined(true)
          videoEle.onleavepictureinpicture = () => {
            setPined(false)
          };
        })
        .catch((error) => {
          // Error handling
          console.log('pip error', error);
        });
    }
  };
  return (
    <StyledButton className="pin" onClick={handlePin} data-status={pined} title={tipPin}></StyledButton>
  )
}
