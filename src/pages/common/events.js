/**
 * @author: laoona
 * @date:  2022-01-11
 * @time: 22:10
 * @contact: laoono.com
 * @description: #
 */

const EVENTS = {
  // 用户加入，此时仅仅代表建立了websocket连接，webrtc连接暂未建立
  USER_ENTER: 'USER_ENTER',
  // 用户离开
  USER_LEAVE: 'USER_LEAVE',
  // 断开websocket连接
  DISCONNECT_SOCKET: 'DISCONNECT_SOCKET',
  // 初始化websocket连接
  ROOM_SOCKET_INIT: 'ROOM_SOCKET_INIT',
  // 发送websocket消息
  SOCKET_MSG: 'SOCKET_MSG',
  // room & window ID
  ROOM_WINDOW: 'ROOM_WINDOW',
  // 新开窗口
  NEW_WINDOW: 'NEW_WINDOW',
  // 检查连接（workspace初始化完成即代表连接存在，可能有问题）
  CHECK_CONNECTION: 'CHECK_CONNECTION',
  // workspace 事件
  WORKSPACE: 'WORKSPACE',
  // tab事件，新增，删除，更新
  TAB_EVENT: 'TAB_EVENT',
  // websocket当前房间存在的用户
  CURRENT_USERS: 'CURRENT_USERS',
  // 从content script 获取当前tab
  CURRENT_TAB: 'CURRENT_TAB',
  // 更新用户
  UPDATE_USERS: 'UPDATE_USERS',
  // 更新tabs 通过background传给content script
  UPDATE_TABS: 'UPDATE_TABS',
  // 跳转tab
  JUMP_TAB: 'JUMP_TAB',
  // 登录
  LOGIN: 'LOGIN',
  // 退出
  LOGOUT: 'LOGOUT',
  // 成为host
  BE_HOST: 'BE_HOST',
  // 更新follow mode
  FOLLOW_MODE: 'FOLLOW_MODE',
  // follow mode 提醒
  FOLLOW_MODE_TIP: 'FOLLOW_MODE_TIP',
  // 更新floater 数据
  UPDATE_FLOATER: 'UPDATE_FLOATER',
  // 切换floater tab
  CHANGE_FLOATER_TAB: 'CHANGE_FLOATER_TAB',
  // pop up 数据集合
  POP_UP_DATA: 'POP_UP_DATA',
  //local window titles
  WINDOW_TITLES: 'WINDOW_TITLES',
  // 获取window title
  WIN_TITLE: 'WIN_TITLE',
  // 更新window标题
  UPDATE_WIN_TITLE: 'UPDATE_WIN_TITLE',
  // 更新favorite
  TOGGLE_FAV: 'TOGGLE_FAV',
  // 触发tab limit
  TAB_LIMIT: 'TAB_LIMIT',
  // 用于从bg打开新窗口
  NEW_ACTIVE_WINDOW: 'NEW_ACTIVE_WINDOW',
  // 新开标签集
  OPEN_TABS: 'OPEN_TABS',
  // 根据win id 拿tabs
  GET_TABS_BY_WINDOW: 'GET_TABS_BY_WINDOW',
  // 复制
  COPY_SOMETHING: 'COPY_SOMETHING',
  // 权限提醒
  ACCESS_TIP: 'ACCESS_TIP',
  // 鼠标位置事件
  HOST_CURSOR: 'HOST_CURSOR',
  // 语音连接状态事件
  UPDATE_VOICE_STATUS: 'UPDATE_VOICE_STATUS',
  // 加入、离开语音事件
  VOICE_ACTION: 'VOICE_ACTION',
  // 后台触发加入、离开语音事件
  FIRE_VOICE_ACTION: 'FIRE_VOICE_ACTION',
  // 会议在线用户更新
  UPDATE_REMOTE_USERS: 'UPDATE_REMOTE_USERS',
  // 设置 tab pinned
  SET_PINNED: 'SET_PINNED',
};

export default EVENTS;

