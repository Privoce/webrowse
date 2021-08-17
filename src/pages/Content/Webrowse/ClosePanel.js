import styled from 'styled-components';
import IconClose from './icons/Close'
const StyledWrapper = styled.button`
    position: absolute;
    top:10px;
    right:10px;
    background:none;
    border:none;
    width:20px;
    height: 20px;
`;
export default function ClosePanel({ close = null }) {
    return (
        <StyledWrapper onClick={close}>
            <IconClose />
        </StyledWrapper>
    )
}
