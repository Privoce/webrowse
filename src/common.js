const EVENTS = {
  // 用户加入，此时仅仅代表建立了websocket连接，webrtc连接暂未建立
  USER_ENTER: 'USER_ENTER',
  // 用户离开
  USER_LEAVE: 'USER_LEAVE',
  // webrtc连接建立
  USER_JOIN_MEETING: 'JOIN_MEETING',
  // webrtc连接断开
  USER_LEAVE_MEETING: 'LEAVE_MEETING',
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
  // 打开主页
  OPEN_HOME: 'OPEN_HOME',
  // 登录
  LOGIN: 'LOGIN',
  // 退出
  LOGOUT: 'LOGOUT',
  // 成为host
  BE_HOST: 'BE_HOST',
  //加载vera panel
  LOAD_VERA: 'LOAD_VERA',
  // 更新follow mode
  FOLLOW_MODE: 'FOLLOW_MODE',
  // 更新floater 数据
  UPDATE_FLOATER: 'UPDATE_FLOATER',
  // 切换floater tab
  CHANGE_FLOATER_TAB: 'CHANGE_FLOATER_TAB',
  // 获取邀请连接
  GET_INVITE_LINK: 'GET_INVITE_LINK',
  // pop up 数据集合
  POP_UP_DATA: 'POP_UP_DATA',
}

export { EVENTS }
