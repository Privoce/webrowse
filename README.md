# Vera 是什么

一款谷歌浏览器扩展，它可以帮你在任何网页上向别人实时发起音视频连接，一起浏览当前页。
## 特性

- 实时与TA人音视频（基于WebRTC）
- 共享工作区（开发中）
- 自己鼠标实时同步到对方（可关闭）
- 聊天
- 其它非功能特性
  - 可拖拽
  - 可任意改变大小
  - 黑夜模式
  - 视频去背景

## 下载地址

[Chrome扩展商店](https://chrome.google.com/webstore/detail/vera-cobrowse-doc-figma-p/ccegbnlnelhgaefimiaklaindffpfcmh)

> 国内用户需翻墙下载

## 本地开发

### 克隆项目

`git clone https://github.com/Privoce/Vera.git && cd Vera`

### 开发

`yarn install && yarn start`
打开Chrome浏览器扩展开发者模式，加载项目下的`dev`目录，在打开的每个页面，左下角会出现一个小浮标，说明加载成功。

### 构建

`yarn build`

`build`目录即可以上传到chrome扩展商店的包

## 目前存在的问题

### 不完善之处
- ~~邀请连接打开暂未同步显示该workspace下的网页~~
- ~~左下角快捷新开的页面~~
- ~~tab status & follow mode~~
- ~~邀请按钮的功能~~
- 发送email的功能
- ~~Portal Vera UX重构~~

### Bug
- ~~对方视频偶现黑屏~~
- ~~后端服务：有时会有个常驻room的user~~
### 待重构&性能
- CSS污染问题：iframe or web components
- resize & drag:引入CSS变量来代替state的更新，避免重复渲染，提升性能
- 鼠标位置信息传输性能问题
- 引入状态管理：目前状态维护的有点多了，有必要加入状态管理，暂定redux
- 升级Manifest V3






