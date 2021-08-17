window.VERA_EMITTER = window.VERA_EMITTER || {
  events: {},
  emit(event, ...args) {
    (this.events[event] || []).forEach((i) => i(...args));
  },
  on(event, cb) {
    (this.events[event] = this.events[event] || []).push(cb);
    return () => (this.events[event] = (this.events[event] || []).filter((i) => i !== cb));
  },
  off(event, cb) {
    if (!this.events[event]) {
      return;
      // throw new Error(`Can't remove a listener. Event "${event}" doesn't exits.`);
    }
    const filterListeners = (listener) => listener !== cb;
    this.events[event] = this.events[event].filter(filterListeners);
  }
};
const emitter = window.VERA_EMITTER;
export default emitter;
const VeraEvents = {
  NEW_PEER: 'NEW.PEER.ADDED',
  UPDATE_STREAM: 'UPDATE.STRAM',
  SYNC_PLAYER: 'SYNC.PLAYER',
  TOGGLE_CURSOR: 'CURSOR',
  CURSOR_SELECT: 'CURSOR.SELECT',
  CURSOR_MOVE: 'CURSOR.MOVE',
  CURSOR_CLICK: 'CURSOR.CLICK',
  CAMERA_CONTROL: 'CAMERA.CONTROL',
};
const VeraStatus = {
  OPEN: 'CONNECT.OPEN',
  READY: 'READY.TO.CONNECT.OTHERS',
  WAITING: 'WAITING',
  JOINING: 'JOINING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR',
  CLOSE: 'CLOSE',
  CALLING: 'CALL',
  STREAMING: 'STREAM',
  DISCONNECTED: 'DISCONNECTED'
};
export { VeraEvents, VeraStatus };
