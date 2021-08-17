import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useUsername from './hooks/useUsername';
import { selectText } from './hooks/utils';
import ContentEditable from 'react-contenteditable';
const StyledWrapper = styled.div`
  z-index: 999;
  cursor: pointer;
  line-height: 1;
  height: fit-content;
  min-width: 30px;
  max-width: 100px;
  user-select: text;
  border: none;
  text-align: center;
  font-size: 1.8em;
  font-weight: 800;
  color: #fff;
`;

export default function Username({ local = false, name = 'Guest', readonly = true }) {
  const { username, updateUsername } = useUsername();
  const [finalName, setFinalName] = useState((local ? username || 'Guest' : name) || 'Guest');
  const text = useRef(finalName);
  useEffect(() => {
    if (local && username) {
      setFinalName(username);
      console.log('set final name', local, username);
    }
  }, [username, local]);
  const handleChange = ({ target }) => {
    console.log({ target });
    text.current = target.value;
    updateUsername(text.current);
  };
  const handleClick = ({ target }) => {
    selectText(target);
  };
  // const handleBlur = () => {
  //   updateUsername(text.current);
  // };
  return (
    <StyledWrapper className={`username`}>
      <ContentEditable
        onClick={handleClick}
        disabled={readonly}
        html={finalName}
        onChange={handleChange}
      // onBlur={handleBlur}
      ></ContentEditable>
    </StyledWrapper>
  );
}
