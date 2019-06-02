import 'common/public/liveSDK'//引入观看直播Web SDK
import {LiveSDKInterface} from 'common/interface'//引入接口适配器
import LiveInfo from 'common/liveinfo'

class LiveAdaptive {

  constructor() {

  }

  //初始化入口
  init(params) {
    this.liveInterface = hdScience.registerObject(hdScience.LiveInterface, new LiveSDKInterface)
    this.param = hdScience.registerObject(hdScience.InitInfo, params)
    this.liveInterface.call(this.liveInterface.INIT, {
      userid: params.userId || '',
      roomid: params.roomId || '',
      viewername: params.viewerName || '',
      groupid: params.groupId || '',
      viewertoken: params.viewerToken || '',
      viewercustomua: params.viewerCustomua || '',
      language: params.language || '',
      viewercustominfo: params.viewerCustominfo || '',
      fastMode: params.fastMode,
    })

    this.addAPIFunction()
  }

  addAPIFunction() {

    //监听等路成功后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINSUCCESS, (result) => {
      this.param.success && this.param.success(result)
      LiveInfo.loginInfo = LiveInfo.parseLoginInfo(result)
      hdScience.alert('登录成功')
      hdScience.dispatch(hdScience.OnLoginSuccess)
    })
    //直播开始
    this.liveInterface.on(this.liveInterface.ONLIVESTART,()=>{
      hdScience.dispatch(hdScience.OnLiveStart)
    })

    //直播结束
    this.liveInterface.on(this.liveInterface.ONLIVEEND,()=>{
      hdScience.dispatch(hdScience.OnLiveEnd)
    })
    this.liveInterface.on(this.liveInterface.ONUSERCOUNTMESSAGE,(result)=>{
      LiveInfo.userCount = result[0]
      hdScience.dispatch(hdScience.OnUserCountMessage)
    })
    //监听登录失败后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINERROR, (result) => {
      hdScience.alert('登录失败', 'danger')
      this.param.success && this.param.fail(result)
    })
    //问答接收回答接收回答
    this.liveInterface.on(this.liveInterface.ONANSWER, (result) => {
      LiveInfo.answerInfo = LiveInfo.parseAnswerInfo(result)
      hdScience.dispatch(hdScience.OnAnswer)
    })
    //问答接收提问
    this.liveInterface.on(this.liveInterface.ONQUESTION, (result) => {
      LiveInfo.questionInfo = LiveInfo.parseQuestionInfo(result)
      hdScience.dispatch(hdScience.OnQuestion)
    })
    //问答发布
    this.liveInterface.on(this.liveInterface.ONQAPUBLISH, (result) => {
      LiveInfo.qaPulishInfo = LiveInfo.parseQAPublishInfo(result)
      hdScience.dispatch(hdScience.OnQAPublish)
    })
    //收到公聊天
    this.liveInterface.on(this.liveInterface.ONPUBLICCHATMESSAGE, (result) => {
      LiveInfo.publicChatMsgInfo = LiveInfo.parsePublicChatMsg(result)
      hdScience.dispatch(hdScience.OnPublishChatMsg)
    })
    //收到私聊信息
    this.liveInterface.on(this.liveInterface.ONPRIVATECHATMESSAGE, (result) => {
      // LiveInfo.privateChatMsg = LiveInfo.parsePrivateChat(result)
      // hdScience.dispatch(hdScience.OnPrivateChat);
      LiveInfo.privateChatMsgInfo = LiveInfo.parsePrivateChatMsg(result)
      hdScience.dispatch(hdScience.OnPrivateChatMsg)
    })
    //收到私聊回复
    this.liveInterface.on(this.liveInterface.ONPRIVATEANSWER, (result) => {
      LiveInfo.privateChatMsgInfo = LiveInfo.parsePrivateChatMsg(result, true)
      hdScience.dispatch(hdScience.OnPrivateChatMsg)
    })
    //在线的老师数量
    this.liveInterface.on(this.liveInterface.ONONLINETEACHERS, (result) => {
      LiveInfo.onLineTeachers = LiveInfo.parseOnLineTeachers(result)
      hdScience.dispatch(hdScience.OnLineTeachers)
    })
    //显示公告
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTSHOW, (result) => {
      LiveInfo.onAnnounceInfo = LiveInfo.parseAnnounceInfo(result)
      hdScience.dispatch(hdScience.OnANnounceShow)
    })
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTRELEASE, (result) => {
      console.log('发布公告' + result)
    })
    //简介
    this.liveInterface.on(this.liveInterface.ONLIVEDESC, (result) => {
      console.log('简介信息---》' + result)
      LiveInfo.onLiveDesc = result[0]
      hdScience.dispatch(hdScience.OnLiveDesc)
    })


  }

}

export default LiveAdaptive