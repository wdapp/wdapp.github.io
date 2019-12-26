# 获得场景视频 WEB SDK 连麦功能文档

### 一、注意事项

推荐使用google浏览器进行连麦，连麦功能仅支持https协议下使用。

### 二、连麦浏览器支持情况

![](https://github.wdapp.top/github/interaction/support.png)

### 三、使用方法

#### 1.引入 WEB SDK

引入websdk即可实现观看直播和连麦功能，websdk依赖jquery

```javascript
<script src="//view.csslcloud.net/js/jquery-1.9.0.min.js" type="text/javascript"></script>
<script src="//view.csslcloud.net/js/sdk/3.1.0/liveSDK.js" type="text/javascript"></script>
```
#### 2.加入视频播放器组件和连麦相关组件

```html
  <!--视频组件-->
  <div id="livePlayer"></div>
  <!--  连麦视频组件-->
  <div class="video-interactions" id="videoInteractions"></div>
  <!--  连麦音频组件-->
  <div class="audio-interactions" id="audioInteractions"></div>
  <!--  连麦预览组件-->
  <video class="interaction-local-video" id="interactionLocalVideo" autoplay></video>
```

#### 3.初始化websdk

```javascript
DWLive.init({
  userid: "userid",
  roomid: "roomid",
  viewername: "获得场景视频",
  viewertoken: ""
});
```

#### 4.申请连麦

```javascript
// 申请视频连麦，申请连麦和挂断连麦方法需要在登录成功以后才可以调用
DWLive.requestInteraction({
   video: true,
   audio: true
});
```    
    

### 四.连麦相关方法和事件回调
    
```javascript
// 登录成功回调
DWLive.onLoginSuccess = function(data) {
  console.log("登录成功", data);
};

// 监听客户端是否开启连麦回调
DWLive.onRoomSetting = function(data) {
  // data.allow_speak_interaction == "true" 客户端允许连麦
  // data.allow_speak_interaction == "true" 客户端关闭连麦
};

//检查当前浏览器是否支持连麦和是否满足连麦条件，支持返回 true，不支持返回 false
DWLive.isSupportInteraction()

// 申请视频连麦
DWLive.requestInteraction({
    video: true,
    audio: true
  });

// 申请语音连麦
DWLive.requestInteraction({
    video: false,
    audio: true
  });

// 主动挂断连麦
DWLive.hangupInteraction();

// 挂断连麦回调 (data 挂断信息, type 连麦类型)
window.on_cc_live_interaction_disconnect = function(data, type) {
  console.log("连麦已挂断", data, type);
};

// 接受连麦回调 (type 连麦类型)
window.on_cc_live_interaction_accept = function(type) {
  console.log("接受连麦回调", type);
};

// 连麦计时器 (type 连麦类型, time 时间)，每 1000 ms 触发一次回调
function on_cc_live_interaction_interval(type, time) {
  // console.log("连麦计时器", type, time);
}

// 获取本地流信息 (type 连麦类型, stream 本地流地址)
function on_cc_live_interaction_local_media(type, stream) {
  console.log("获取本地流信息", type, stream);
}

// 获取远程互动 (type 连麦类型, chatuser 讲师信息, stream 远程流地址)
function on_cc_live_interaction_remote_media(type, chatuser, stream) {
  console.log("获取远程互动", type, chatuser, stream);
}

// 请求连麦60秒内没有接受，超时断开回调 (type 连麦类型)
function on_cc_live_interaction_request_timeout(type) {
  console.log("请求超时", type);
}
```

### 五.参考

[WEB SDK 开发指南](https://doc.bokecc.com/live/web_sdk.html)

[连麦测试地址](https://github.wdapp.top/github/interaction/)


