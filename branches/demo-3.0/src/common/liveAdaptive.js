import 'common/public/liveSDK' //引入观看直播Web SDK
import {LiveSDKInterface} from 'common/interface' //引入接口适配器
import LiveInfo from 'common/liveinfo'
import EventEmitter from 'onfire.js'
import Tips from './userInterface'

let tips = null
let eventMap = {}

class LiveAdaptive extends EventEmitter {

  //////////////apievent///////////////////////
  OnLoginSuccess = 'LoginSuccess'
  OnQuestion = 'OnQuestion'
  OnAnswer = 'OnAnswer'
  OnQAPublish = 'OnQAPublish'
  OnPublishChatMsg = 'OnPublishChatMsg'
  OnPrivateChatMsg = 'OnPrivateChatMsg'
  OnLineTeachers = 'OnLineTeachers'
  OnPrivateChat = 'OnPrivateChat'
  OnAnnounceShow = 'OnANnounceShow'
  OnAnnounceDelete = 'OnAnnounceDelete'
  OnLiveDesc = 'OnLiveDesc'
  OnUserCountMessage = 'OnUserCountMessage'
  OnLiveStart = 'onLiveStart'
  OnLiveEnd = 'OnLiveEnd'
  OnLiveStarting = 'OnLiveStarting'
//////////////////////////////Event///////////////

  ////////////////live///////
  LiveInterface = 'LiveInterface'
  InitInfo = 'InitInfo'
  LoginInfo = 'LoginInfo'

  constructor() {
    super()
    this.node = document.getElementById('app')
    if (!this.node) {
      let app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      this.node = app
    }
  }

  //初始化入口
  init(params) {
    this.liveInterface = HDScence.registerObject(HDScence.LiveInterface, new LiveSDKInterface)
    this.param = HDScence.registerObject(HDScence.InitInfo, params)
    this.liveInterface.call(this.liveInterface.INIT, {
      userid: params.userId || '',
      roomid: params.roomId || '',
      viewername: params.viewerName || '',
      groupid: params.groupId || '',
      viewertoken: params.viewerToken || '',
      viewercustomua: params.viewerCustomua || '',
      viewercustominfo: params.viewerCustominfo || '',
      fastMode: params.fastMode,
      language: 'zh'
    })
    this.isLive = false
    this.addAPIFunction()
  }

  alert(content, type = '') {
    if (!tips) {
      tips = new Tips()
    }
    tips.alert({type: type, content: content})
  }

  dispatch(type) {
    this.fire(type)

  }

  addEvent(type, func) {
    this.on(type, func)

  }

  /**
   * 设置文档自适应模式
   */
  documentAdaptive(boolean) {
    if (typeof boolean !== 'boolean') {
      return false
    }
    //简介
    this.liveInterface.call(this.liveInterface.DOCADAPT, boolean)
    return false
  }

  /**
   *登录状态监听
   * */
  onLogin(d = {}) {
    this.liveInterface.on(this.liveInterface.ONLOGINSUCCESS, (result) => {
      this.param.success && this.param.success(result)
      LiveInfo.loginInfo = LiveInfo.parseLoginInfo(result)
      if (!LiveInfo.getLoginInfoData('live', 'liveStartTime')) {
        this.isLive = false
      } else {
        this.isLive = true
      }

      d.success && d.success(result)
      this.dispatch(this.OnLoginSuccess)
      this.alert('登录成功')
    })

    //监听登录失败后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINERROR, (result) => {
      this.alert('登录失败', 'danger')
      this.param.success && this.param.fail(result)
      d.fail && d.fail(result)
    })

  }

  getLive() {
    return this.liveInterface.LiveMain
  }


  /**
   *
   *直播状态监听
   * **/
  onLiveStream(d = {}) {
    //直播开始
    this.liveInterface.on(this.liveInterface.ONLIVESTART, () => {
      this.dispatch(this.OnLiveStart)
      d.liveStart && d.liveStart()
      this.isLive = true
    })

    this.liveInterface.on(this.liveInterface.ONLIVESTARTING, () => {
      this.dispatch(this.OnLiveStarting)
      d.living && d.living()
      this.isLive = true
    })

    //直播结束
    this.liveInterface.on(this.liveInterface.ONLIVEEND, () => {
      this.dispatch(this.OnLiveEnd)
      d.liveEnd && d.liveEnd()
      this.isLive = false
    })
  }

  /**
   * 获取当前用户总人数
   * **/
  onUserCount(d = {}) {
    this.liveInterface.on(this.liveInterface.ONUSERCOUNTMESSAGE, (result) => {
      LiveInfo.userCount = result[0]
      d.userCount && d.userCount(LiveInfo.userCount)
      this.dispatch(this.OnUserCountMessage)
    })
  }

  /**
   *监听发布问答功能回调
   * **/
  onQAPulish(d = {}) {

    //问答发布
    this.liveInterface.on(this.liveInterface.ONQAPUBLISH, (result) => {
      LiveInfo.qaPulishInfo = LiveInfo.parseQAPublishInfo(result)
      this.dispatch(this.OnQAPublish)
      d.callback && d.callback(LiveInfo.qaPulishInfo)
    })
  }

  /**
   * 接收回答
   * **/
  onQAAnswer(d = {}) {
    //问答接收回答接收回答
    this.liveInterface.on(this.liveInterface.ONANSWER, (result) => {
      LiveInfo.answerInfo = LiveInfo.parseAnswerInfo(result)
      this.dispatch(this.OnAnswer)
      d.callback && d.callback(LiveInfo.answerInfo)
    })
  }

  /**
   * 提问
   *
   * **/
  onQAQuestion(d = {}) {
    //问答接收提问
    this.liveInterface.on(this.liveInterface.ONQUESTION, (result) => {
      LiveInfo.questionInfo = LiveInfo.parseQuestionInfo(result)
      this.dispatch(this.OnQuestion)
      d.callback && d.callback(LiveInfo.questionInfo)
    })
  }

  /**
   * 接收公聊信息
   * **/
  onPublicChat(d = {}) {
    //收到公聊天
    this.liveInterface.on(this.liveInterface.ONPUBLICCHATMESSAGE, (result) => {
      LiveInfo.publicChatMsgInfo = LiveInfo.parsePublicChatMsg(result)
      this.dispatch(this.OnPublishChatMsg)
      d.callback && d.callback(LiveInfo.publicChatMsgInfo)
    })
  }

  /**
   * 接收私聊信息
   *
   * **/
  onPrivateChat(d = {}) {
    //收到私聊信息
    this.liveInterface.on(this.liveInterface.ONPRIVATECHATMESSAGE, (result) => {
      // LiveInfo.privateChatMsg = LiveInfo.parsePrivateChat(result)
      // HDScence.dispatch(HDScence.OnPrivateChat);
      LiveInfo.privateChatMsgInfo = LiveInfo.parsePrivateChatMsg(result)
      this.dispatch(this.OnPrivateChatMsg)
      d.callback && d.callback(LiveInfo.privateChatMsgInfo)
    })
  }

  /**
   *
   * 接收私聊回复
   *
   * **/
  onPrivateChatRevert(d = {}) {
    //收到私聊回复
    this.liveInterface.on(this.liveInterface.ONPRIVATEANSWER, (result) => {
      LiveInfo.privateChatMsgInfo = LiveInfo.parsePrivateChatMsg(result, true)
      this.dispatch(this.OnPrivateChatMsg)
      d.callback && d.callback(LiveInfo.privateChatMsgInfo)
    })
  }

  /**
   * 禁言通知
   * **/
  onBannedInfomation(d = {}) {
    this.liveInterface.on(this.liveInterface.ONINFORMATION, (result) => {
      LiveInfo.bannedInfomation = result[0]
      this.alert(LiveInfo.bannedInfomation)
      d.callback && d.callback(LiveInfo.bannedInfomation)

    })
  }

  /**
   *
   * 显示老师在线信息
   * **/

  onTeachers(d = {}) {
    //在线的老师数量
    this.liveInterface.on(this.liveInterface.ONONLINETEACHERS, (result) => {
      LiveInfo.onLineTeachers = LiveInfo.parseOnLineTeachers(result)
      this.dispatch(this.OnLineTeachers)
      d.callback && d.callback(LiveInfo.onLineTeachers)
    })
  }

  /**
   *
   * 显示公告
   * **/
  onAnnounce(d = {}) {
    //显示公告
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTSHOW, (result) => {
      LiveInfo.onAnnounceInfo = LiveInfo.parseAnnounceInfo(result)
      this.dispatch(this.OnAnnounceShow)
      d.callback && d.callback(LiveInfo.onAnnounceInfo)
    })
  }

  /**
   *
   * 发布更新公告
   * **/
  onAnounceRelease(d = {}) {
    //显示公告
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTRELEASE, (result) => {
      LiveInfo.onAnnounceInfo = LiveInfo.parseAnnounceInfo(result)
      this.dispatch(this.OnAnnounceShow)
      d.callback && d.callback(LiveInfo.onAnnounceInfo)
    })
  }

  onAnounceDelete(d = {}) {
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTREMOVE, (result) => {
      this.dispatch(this.OnAnnounceDelete)
    })
  }

  /**直播间简介**/
  onLiveDesc(d = {}) {
    //简介
    this.liveInterface.on(this.liveInterface.ONLIVEDESC, (result) => {
      LiveInfo.onLiveDesc = result[0]
      this.dispatch(this.OnLiveDesc)
      d.callback && d.callback(LiveInfo.onLiveDesc)
    })
  }

  /**
   * 设置文档自适应模式
   */
  documentAdaptive(boolean) {
    if (typeof boolean !== 'boolean') {
      return false
    }
    //简介
    this.liveInterface.call(this.liveInterface.DOCADAPT, boolean)
    return false
  }

  addAPIFunction() {
    this.onLogin()
    this.onLiveStream()
    this.onAnnounce()
    this.onLiveDesc()
    this.onPublicChat()
    this.onPrivateChat()
    this.onQAAnswer()
    this.onQAPulish()
    this.onQAQuestion()
    this.onTeachers()
    this.onUserCount()
    this.onPrivateChatRevert()
    this.onAnounceRelease()
    this.onAnounceDelete()
    this.onBannedInfomation()
  }

  /**
   * 获取当先的线路数组
   * **/
  getLine() {
    LiveInfo.lines = this.liveInterface.call(this.liveInterface.GETLINE)
    return LiveInfo.lines
  }

  /**
   * 切换线路
   * **/
  changeLine(t = {}) {
    this.liveInterface.call(this.liveInterface.CHANGELINE, (t.index ? parseInt(t.index) : 1 ))
  }

}

export default LiveAdaptive