## WebSDK Demo-webpack版 使用说明

## 目录

[TOC]

### 概述

该项目对webSDK的接口进行了封装，进行模块化的开发。该文档提供对webSDK封装后的接口，方便在该项目中开发和使用。若使用webSDK进行开发，则所用接口以https://doc.bokecc.com/live/web_sdk.html为准。

#### 环境

demo需要npm包管理器，node.js中自带npm包管理器所以可以下载安装node.js

环境，下载地址https://nodejs.org/en/，用默认安装即可(建议安装长期支持稳定版)

推荐版本：
node -v v10.15.3
npm -v 6.9.0
webpack -v 3.10.0

#### 安装模块

在项目根目录下运行

```javascript
npm install
```

#### 运行

```javascript
npm run start
```

待读取完成后，在浏览器地址栏中输入http://localhost:8080

#### 打包

项目打包

```javascript
npm run build
```

打包完成以后会在根目录下生成dist目录，该目录下的文件为可部署文件

#### config.js配置

用来配置debug和配置域名

build/config.js

```javascript
module.exports = {
  debug: true,//demo中是否输出log信息，true输出，false为不输出
  host: 'localhost',//默认为localhost
  port: '8080',//默认为8080
  path: 'localhost:8080',//页面跳转地址，登录界面登录以后跳转到观看直播或回放界面的地址
  version: '1.0.0',//demo版本
  timestamp: (new Date()),//时间戳
  tag: '1.0.8'//标记
}
```

#### 

#### 目录结构

- Demo-webpack
  - build   node构建服务配置目录
  - dist      打包生成后的文件目录
    - js 	打包后生成的js文件目录
  - src
    - assets  资源主目录(存放css，image)	
    - common  公共api接口库
      - public 
    - components  各个模块组件
      - live  直播pc模块
        - chat 聊天模块（包含聊天、公告）
        - control 控制模块（包含退出、切换线路、文档视频切换、在线人数、登录名）
        - document   文档模块
        - player   播放器模块
        - questionAnswer 问答模块 （包含发送接收问题、接收答案等）
      - livemobile 直播移动端模块 
      - login 登录模块
      - replay  回放pc模块 
      - replayMobile 回放移动端模块
    - main  主入口文件
  - Package.json
  - Package-lock.json



#### 功能

| 功能模块           | 描述                                            |
| :----------------- | ----------------------------------------------- |
| 视频模块           | 支持直播回放视频播放                            |
| 文档模块           | 文档及ppt动画展示                               |
| 聊天模块           | 支持公聊和私聊模式                              |
| 问答模块           | 支持公开问答和私密问答                          |
| 简介模块（移动端） | 支持直播间简介信息                              |
| 公告模块           | 支持获取公告信息                                |
| 控制模块           | 支持退出、切换线路、在线人数、用户名称,控制条等 |

### 直播模块

##### 登录

直播端接口为 common目录下的liveHDScene.js,回放端接口为common目录下的replayHDScene.js

```javascript
import 'common/liveHDScene'//提供Web SDK方法（直播引入liveHDScene，回放引入replayHDScene）
	//登录
  HDScene.login({
    userId:'B27039502337407C', //用户id
    roomId:  '3115C441D8B66A719C33DC5901307461',//直播间id
    recordId:  '96C0454B9E3CE464',//回放id（可选）直播不需要，回放需要
    groupId:"",//分组信息
    viewerName:  '昵称',//用户名称
    viewerToken: '',//密码
    isH5play: true,// 是否是h5播放
    fastMode: true,//是否为急速文档
    success(result) {
      Utils.log('登录成功', result)
    },
    fail(error) {
      Utils.log('登录失败', error)
    }
  })
```

注册组件

```javascript
 //配置自定义组件
  HDScene.components({
    Player,
    Document,
    QuestionAnswer,
    Chat,
    Controls,
    Thumbnail
    ...
  })
```

##### 直播状态监听

```javascript
HDScene.onLiveStream({liveStart:function(){
  console.log("直播开始回调")
},living:function(){
  console.log("直播中")
},liveEnd:function(){
  console.log("直播结束")  
}})
```

#####获取当前观看直播人数

```javascript
HDScene.onUserCount({userCount:function(l){
  console.log("观看直播人数"+l)
}})
```

####问答：

##### 发送问答

```javascript
HDScene.sendQuestionMsg(d)  d={"msg":"发送的问答"}//发送的问答信息
```

#####监听问答发布后回调

```javascript
HDScene.onQAPulish({callback:function(d){
  console.log("发布后的问答列表"+d);
}})
d=[{
  		questionId:"ab3dscd" //问题的id
   },{
     	questionId:"3s321cd"
   }]
```

#####接收提问回调

```javascript
HDScene.onQAQuestion({callback:function(d){
  console.log("接收回答信息回调"+d)
}})
d={
  id:"CF931B3DB39E349F",//该问答id
  questionId:"CF931B3DB39E349F",//问题id
  isPublish:"e021556911624284aa884a82c2e10a8e",//是否已发布
  questionContent:"我提出的问题?",//问答内容
  triggerTime:"2019-06-16 09:20:14",//发布时间
  userId:"",//当前用户id
  questionName:"nnn",//提问者名字
  self:false   //是否是自己
}
```

#####接收回答回调

```javascript
HDScene.onQAAnswer({callback:function(d){
  console.log("接收回答信息"+d)
}})
d={
     answerName,//回答名称
    answerContent,//回答内容
    questionId,//对应问题id
    isPrivate,//是否私有紧自己可见
    questionUserId,//对应问题发布者的用户id
    triggerTime,//发布答案时间
    userId,//用户id
    self:true //是否是自己

}
```

####聊天：

##### 发送公共聊天

```javascript
HDScene.sendPublicMsg(d)  d={"msg":"公共聊天内容"}
```

##### 发送私聊

```javascript
HDScene.sendPrivateMsg(d) d={"msg":"私聊内容","teacher":"私聊的老师id","teacherName":"私聊老师名称"}
```

##### 接收公共聊天

```javascript
HDScene.onPublicChat(d) {
  console.log("接收到了公共聊天"+d)
}
d={
  		chatId: "1511360",//聊天id
      groupId: "",//分组信息
      msg: "asdas",//聊天消息内容
      self: true, //是否是自己
      status: "0",  //该条聊天的状态
      time: "16:25:00",//发送的聊天的时间
      userId: "e021556911624284aa884a82c2e10a8e",//发送用户的id
      userName: "213",//用户昵称
      userRole: "student",//角色student学生观看者角色、teacher助教端角色、publish主讲、推流端角色、host主持人角色
}
```

##### 接收私聊

```javascript
HDScene.onPrivateChat(d){
  console.log("接收到私有聊天")
}
d={
  		fSelf: true //发送者是否是自己
      fromUserId: "e021556911624284aa884a82c2e10a8e"//发送者id
      fromUserName: "213" //发送者名称
      fromUserRole: "teacher"
      msg: "私聊消息" // 接收发送的私聊消息
      tSelf: false //接收者是否为自身
      time: "18:12:15"//时间
      toUserId: "7465aa2d7ae64b4c84479d0075853b12"//接收者id
      toUserName: "22"//接收者名字
}
```

##### 接收私聊回复

```javascript
HDScene.onPrivateChatRevert(d){
  console.log("接收到私聊的回复")
}
参数同接收私聊
```

#### 公告

#####显示公告

```javascript
HDScene.onAnnounce({callback:function(d){
  console.log("接收公告信息"+d)
}})
d="我是公告信息信息信息"
```

##### 发布更新公告

```javascript
HDScene.onAnounceRelease({callback:function(d){
  console.log("更新公告信息"+d)
}})
d="我是更新的公告信息"
```

##### 删除公告信息

```javascript
HDScene.onAnounceDelete({callback:function(){
  console.log("公告删除了")
}})
```

#### 其他

##### 退出直播间

```javascript
HDScene.logoutRoom({success:function(){
  console.log("退出直播间成功")
},error:function(){	
  console.log("退出直播间失败")
}})
```

##### 切换线路

```javascript
HDScene.changeLine({
  index:0 //线路的值
})
```

##### 获取线路

```javascript
HDScene.getLine()
```

### 回放模块

##### 登录

```javascript
import 'common/replayHDScene'//提供Web SDK 观看回放事件、方法、属性
HDScene.login({
  			userId: 'userId',//用户id
        roomId: 'roomId',//直播见id
        recordId: 'recordId',//回放id
        viewername: 'viewername',//观看者名称
        viewertoken: 'viewertoken',//密码
        groupId: '',//分组信息
        isH5play: true,//是否是video播放
        fastMode: true,//是否是极速文档
})
```
#### 播放

##### 恢复播放

```javascript
HDScene.togglePlay() //切换播放暂停状态
```

##### 跳转到指定时间点

```javascript
HDScene.seek(t)
t=20 //t 为播放时间点
```

##### 获取视频总时长

```javascript
let durition = HDScene.durationTime;  //获取视频总时长
```

##### 获取当前播放时间点

```javascript
let currentTime = HDScene.currentTime; //获取当前播放时间点
```

##### 获取缓冲进度

```javascript
let buffer = HDScene.buffer;
```

##### 设置或者获取音量

```javascript
let volum = HDScene.volume; //获取音量
HDScene.volume = 0.1;//设置音量
```

#### 问答

#####历史问题回调

```javascript
HDScene.onQuestions(function(d){
 	console.log("接收到的历史问题消息回调"+d) 
})
d={
  content: "333333",//接收到的问答的内容
  groupId: "",//分组信息
  id: "7D7C2383BB609EBC",//问答的id
  isPublish: 1,//是否已经发布
  userId: "74e9559d78e34350b7993c3318062e89",//用户id
  userName: "撒发达"//用户名
}
```

##### 历史回答回调

```javascript
HDScene.onAnswers(function(d){
    console.log("接收到历史回答回调"+d)
  })
d={
  content: "sdfdsafd",//回答的内容
  groupId: "",//分组信息
  isPrivate: 1,//是否已经发布
  questionId: "6EA808A33A3251EB",//问题id
  userId: "222ec2eaab2b4d85a7bc34e93032d46e",//用户id
  userName: "sdf",//用户名称
  userRole: "publisher"//用户角色
}
//TODO
```

#### 聊天

#####历史聊天数据回调

```javascript
HDScene.onChatMessageSync(function(d){
    console.log("历史的聊天信息"+d);
  })
d={ 
  chatId: "77380211",//聊天id
  groupId: "",//分组信息
  msg: "111",//聊天内容
  role: 1,
  status: "0",//聊天状态，0 可见 ，1不可见
  time: 24,//发送时间
  userRole: "publisher",//聊天角色
  userid: "222ec2eaab2b4d85a7bc34e93032d46e",//用户id
  username: "sdf"//发送聊天者名称
}
```

#### 问答

#####历史问题数据

```javascript
HDScene.onQuestions(function(d){
  console.log("问题数据->"+d);
})
d={
  content: "sdfdsafd",//问题内容
  groupId: "",//分组信息
  isPrivate: 1,//是否仅自己可见
  questionId: "6EA808A33A3251EB",//问题id
  userId: "222ec2eaab2b4d85a7bc34e93032d46e",//用户id
  userName: "sdf",//用户名称
  userRole: "publisher" //角色信息
}
```

##### 历史回答

```javascript
HDScene.onAnswers(function(d){
  content: "sdfdsafd",//回答内容
  groupId: "",//分组信息
  isPrivate: 1,//是否仅自己可见
  questionId: "6EA808A33A3251EB",//对应问题id
  userId: "222ec2eaab2b4d85a7bc34e93032d46e",//用户id
  userName: "sdf",//用户名
  userrole: "publisher" //角色信息
})
```



#### 其他

##### 是否隐藏控制条

```javascript
HDScene.isShowControl({
  visible:true  //显示控制条
})
```

#####极速文档是否自适应

```javascript
HDScene.documentAdaptive(b)
b = true/false //true为自适应窗口设置图像大小，false以窗口宽度为基准设置大小
```

##### 退出

```javascript
HDScene.logout() //退出回放
```

### 自定义组件

您可以自己创建一个属于自己的组件文件夹

```javascript
//自定义组件ExampleCompents.js
import Component from 'common/component'
//component.js继承自render.js里面内置了操作dom元素的方法，和交互事件组册方法可以操作dom，
//...需要导入的库

class ExampleCompents extends Component {
  constructor() {
    super()
  }
  //实现自己的逻辑方法
}

export default ExampleCompents
```

引入自己的组件

```javascript
import ExampleCompents from './exampleCompents'//ExampleCompents.js所在的文件目录
//配置自定义组件需要倒入模块核心类
  HDScene.components({
    ExampleCompents,
    ...
  })
```

### 示例代码

```javascript
import 'common/liveHDScene'//提供Web SDK方法（直播引入liveHDScene，回放引入replayHDScene）
import Utils from 'common/utils'//公共方法库
import './styles/replay.scss'//PC端回放私有样式

//自定义组件
import Player from 'components/replay/player/player'
import Document from 'components/replay/document/document'
import QuestionAnswer from 'components/replay/questionAnswer/questionAnswer'
import Chat from 'components/replay/chat/chat'
import Controls from 'components/replay/controls/controls'
import Thumbnail from 'components/replay/thumbnail/thumbnail'

//当dom准备完成后调用
HDScene.ready(() => {
  //配置自定义组件
  HDScene.components({
    Player,
    Document,
    QuestionAnswer,
    Chat,
    Controls,
    Thumbnail
  })
  //登录
  HDScene.login({
    userId:'B27039502337407C', //用户id
    roomId:  '3115C441D8B66A719C33DC5901307461',//直播间id
    recordId:  '96C0454B9E3CE464',//回放id（可选）直播不需要，回放需要
    viewerName:  '昵称',//用户名称
    viewerToken: '',//密码
    isH5play: true,// 是否是h5播放
    fastMode: true,//是否为急速文档
    success(result) {
      Utils.log('登录成功', result)
    },
    fail(error) {
      Utils.log('登录失败', error)
    }
  })
})
```


