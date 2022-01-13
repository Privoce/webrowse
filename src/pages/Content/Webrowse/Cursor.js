import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { MessageLocation, onMessageFromBackground, sendMessageToBackground } from '@wbet/message-api'
import EVENTS from '../../common/events'
import { throttle } from '../../common/utils'
import styled from 'styled-components';
const StyledCursor = styled.aside`
  position: absolute;
  top: 0;
  left: 0;
  transition: transform .2s ease;
  will-change: transform;
  transform:translate3d(${({ x }) => `${x - 19}px`}, ${({ y }) => `${y - 19}px`}, 0);
  width: 38px;
  height: 38px;
  background: radial-gradient(34.37% 34.37% at 50% 50%, #EC6D62 0%, rgba(229, 103, 92, 0.760417) 23.96%, rgba(206, 83, 71, 0) 100%);
  &:after{
    content: "Host";
    position: absolute;
    bottom: -5px;
    right: -26px;
    font-weight: 600;
    font-size: 10px;
    line-height: 18px;
    border-radius: 4px;
    padding:0 8px;
    color: #fff;
    background-color:#CE5347 ;
  }
`;
const StyledAsideCursor = styled.aside`
    user-select: none;
    pointer-events: all;
    cursor: pointer;
    position: fixed;
    top:0;
    left: 0;
    font-weight: 600;
    font-size: 10px;
    line-height: 18px;
    border-radius: 4px;
    padding:0 8px;
    color: #fff;
    background-color:#CE5347 ;
    transition: transform .2s ease;
    will-change: transform;
    transform:translate3d(${({ x }) => `${x}px`}, ${({ y }) => `${y}px`}, 0);
    .arrow{
        content: "";
        position: absolute;
        right: -14px;
        top: 50%;
        transform-origin: center;
        transform: translateY(-50%) rotate(${({ rotate }) => `${rotate}deg`});
        width: 10px;
        height: 10px;
        display: flex;
        align-items: center;
    }
`;
const getFixPosition = (pos) => {
    if (!pos) return { x: 0, y: 0 };
    const { x, y } = pos;
    const { innerWidth, innerHeight } = window;
    const compareX = window.scrollX + innerWidth;
    const compareY = window.scrollY + innerHeight;
    const newX = x > compareX ? (innerWidth - 40) : (x < window.scrollX ? 0 : x)
    const newY = y > compareY ? (innerHeight - 20) : (y < window.scrollY ? 0 : y)
    let rotate = 0;
    if (newX == 0) {
        rotate = 180;
    } else if (newY == 0) {
        rotate = -90;
    } else if (newY == (innerHeight - 20)) {
        rotate = 90;
    }
    return { x: newX, y: newY, rotate }
}
export default function Cursor() {
    const [cursorPos, setCursorPos] = useState(undefined);
    const [isHost, setIsHost] = useState(true);
    const { ref, inView } = useInView({ threshold: 0 });
    useEffect(() => {
        const collectCursorPosition = throttle((evt) => {
            const { pageX, pageY } = evt;
            console.log({ pageX, pageY });
            sendMessageToBackground({ x: pageX, y: pageY }, MessageLocation.Content, EVENTS.HOST_CURSOR);
        }, 500);
        if (isHost) {
            document.addEventListener('mousemove', collectCursorPosition, false);
            setCursorPos(null);
        }
        return () => {
            document.removeEventListener('mousemove', collectCursorPosition, false);
        }
    }, [isHost]);
    useEffect(() => {
        const msgHandler = (port) => {
            port.onMessage.addListener((msg) => {
                console.log("data from bg connection", msg);
                setCursorPos(msg);
            });
        };
        chrome.runtime.onConnect.addListener(msgHandler);
        return () => {
            chrome.runtime.onConnect.removeListener(msgHandler);
        }
    }, []);
    onMessageFromBackground(MessageLocation.Content, {
        [EVENTS.UPDATE_FLOATER]: ({ users, userId }) => {
            let currHost = users.find(u => u.host);
            setIsHost(userId ? currHost?.id == userId : false);
            if (!currHost) {
                setCursorPos(null)
            }
        },
        [EVENTS.CHECK_CONNECTION]: (connected = false) => {
            console.log("connection check", connected);
            if (!connected) {
                setCursorPos(null)
            }
        },
    });
    const handleJumpToCursor = () => {
        // shadow DOM
        const rootEle = document.querySelector('#PORTAL_WEBROWSE_PANEL > div').shadowRoot;
        const c = rootEle.querySelector('#WEBROWSE_HOST_CURSOR');
        if (c) {
            c.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
    if (!cursorPos || isHost) return null;
    const { x, y } = cursorPos;
    return (
        <>
            {!inView && <StyledAsideCursor {...getFixPosition({ x, y })} onClick={handleJumpToCursor}>
                Host
                <div className="arrow">
                    <svg width="6" height="8" viewBox="0 0 6 8" fill="none" >
                        <path d="M0.25 0.968911L5.5 4L0.25 7.03109L0.25 0.968911Z" fill="#0A84FF" fillOpacity="0.62" stroke="#0A84FF" strokeWidth="0.5" />
                    </svg>
                </div>
            </StyledAsideCursor>}
            <StyledCursor x={x} y={y} ref={ref} id="WEBROWSE_HOST_CURSOR" />
        </>
    )
}
