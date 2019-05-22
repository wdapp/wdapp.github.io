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
      fastMode: params.fastMode || true,
    })

    this.addAPIFunction()
  }

  addAPIFunction() {

    //监听等路成功后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINSUCCESS, (result) => {
      this.param.success && this.param.success(result)
      LiveInfo.loginInfo = LiveInfo.parseLoginInfo(result)
      hdScience.dispatch(hdScience.OnLoginSuccess)
    })

    //监听登录失败后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINERROR, (result) => {
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
      LiveInfo.publicChatMsgInfo = LiveInfo.parsePublicChatMsg(result);
      hdScience.dispatch(hdScience.OnPublishChatMsg)
    })
    //收到私聊信息
    this.liveInterface.on(this.liveInterface.ONPRIVATECHATMESSAGE, (result) => {

    })
    this.liveInterface.on(this.liveInterface.ONPRIVATEANSWER,(result)=>{
      LiveInfo.privateChatMsgInfo = LiveInfo.parsePrivateChatMsg(result)
      hdScience.dispatch(hdScience.OnPrivateChatMsg)
    })
  }

}

export default LiveAdaptive