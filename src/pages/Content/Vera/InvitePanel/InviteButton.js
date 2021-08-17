import styled from 'styled-components';
const StyledButton = styled.button`
    background: var(--vera-theme-color);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 25px;
    padding:10px 20px;
    line-height: 1;
    color:#fff;
    border:none;
    font-size: 20px;
    font-weight: bold;
    margin-top: 16px;
    width: fit-content;
    .prefix{
        padding-right: 10px;
    }
`;
export default StyledButton