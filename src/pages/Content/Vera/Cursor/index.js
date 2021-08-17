import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import emitter, { VeraEvents } from '../hooks/useEmitter';
import { throttle } from '../hooks/utils';
import Pointer from './Pointer';
import StyledCursor from './styled';
export default function Cursor({ id, username = 'Guest', color = '#f4ea2a' }) {
  const wrapper = useRef(null);
  useEffect(() => {
    console.log(wrapper.current);
    emitter.on(VeraEvents.CURSOR_MOVE, ({ pid, data }) => {
      //  不是当前鼠标的更新数据
      if (pid !== id) return;
      const {
        pos: { x, y }
      } = data;
      wrapper.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      // console.log('data connection msg in cursor', pid, id, data);
    });
    emitter.on(VeraEvents.TOGGLE_CURSOR, ({ pid, data }) => {
      //  不是当前鼠标的更新数据
      if (pid !== id) return;
      let { enable } = data;
      if (enable) {
        wrapper.current.classList.remove('disable');
      } else {
        wrapper.current.classList.add('disable');
      }
    });
    emitter.on(VeraEvents.CURSOR_CLICK, ({ pid }) => {
      //  不是当前鼠标的更新数据
      if (pid !== id) return;
      wrapper.current.classList.add('clicked');
    });
    emitter.on(VeraEvents.CURSOR_SELECT, ({ pid, data }) => {
      //  不是当前鼠标的更新数据
      if (pid !== id) return;
      if (typeof rangy === 'undefined') return;
      const { selection } = data;
      console.log({ selection });
      try {
        rangy.deserializeSelection(selection);
      } catch (error) {
        console.error(error);
      }
    });
  }, [id]);
  const handleAniEnd = () => {
    wrapper.current.classList.remove('clicked');
  };
  return (
    <StyledCursor ref={wrapper} color={color} onAnimationEnd={handleAniEnd}>
      <div className="circle"></div>
      <Pointer color={color}></Pointer>
      {username ? <span className="name">{username}</span> : null}
    </StyledCursor>
  );
}
const initCursor = ({ id, username, color }) => {
  if (typeof username == 'undefined') return false;
  let wrapper = document.getElementById(id);
  // 存在了
  if (!wrapper) {
    console.log('cursor init');
    wrapper = document.createElement('aside');
    wrapper.id = id;
    document.body.appendChild(wrapper);
  }
  ReactDOM.render(<Cursor id={id} username={username} color={color} />, wrapper);
  return true;
};
const destoryCursor = ({ id }) => {
  let wrapper = document.getElementById(id);
  console.log('remove cursor', { id, wrapper });
  wrapper?.remove();
};
const sendData = (conn, data) => {
  if (conn.open) {
    conn.send(data);
  }
};
const bindCursorSync = ({ conn }) => {
  console.log('bind cursor sync');
  document.addEventListener(
    'mousemove',
    throttle((evt) => {
      const { clientX, clientY } = evt;
      const { scrollTop, scrollLeft } = document.scrollingElement;
      sendData(conn, {
        type: VeraEvents.CURSOR_MOVE,
        data: { pos: { x: clientX + scrollLeft, y: clientY + scrollTop } }
      });
    }),
    false
  );
  document.addEventListener(
    'mousedown',
    () => {
      sendData(conn, {
        type: VeraEvents.CURSOR_CLICK,
        data: { click: true }
      });
    },
    false
  );
  document.addEventListener(
    'mouseup',
    () => {
      try {
        let selection = rangy.getSelection();
        console.log('wtf', { selection });

        if (selection && !selection.isCollapsed) {
          selection = rangy.serializeSelection(selection, true);
          sendData(conn, {
            type: VeraEvents.CURSOR_SELECT,
            data: { selection }
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    false
  );
};
export { initCursor, destoryCursor, bindCursorSync };
