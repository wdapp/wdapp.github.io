/**
 * 观看直播 Web SDK 接口封装
 * JavaScript 发布订阅事件封装
 * */
import {LiveSDKInterface} from 'common/interface' //引入接口适配器
import LiveInfo from 'common/liveinfo'
import EventEmitter from 'onfire.js'
import Utils from 'common/utils'

class LiveAdaptive extends EventEmitter {

  //////////////apievent///////////////////////
  OnLoginSuccess = 'LoginSuccess'//登录成功
  OnQuestion = 'OnQuestion'//接收问题
  OnAnswer = 'OnAnswer'//接收回答
  OnQAPublish = 'OnQAPublish'//发布问答
  OnPublishChatMsg = 'OnPublishChatMsg'//接收公共聊天
  OnPrivateChatMsg = 'OnPrivateChatMsg'//接收私聊信息
  OnLineTeachers = 'OnLineTeachers'//更新在线老师信息
  OnPrivateChat = 'OnPrivateChat'//接收私聊
  OnAnnounceShow = 'OnANnounceShow'//显示公告
  OnAnnounceDelete = 'OnAnnounceDelete'//删除公告
  OnLiveDesc = 'OnLiveDesc'//直播间简介
  OnUserCountMessage = 'OnUserCountMessage'//用户数量信息
  OnLiveStart = 'onLiveStart'//直播开始
  OnLiveEnd = 'OnLiveEnd'//直播结束
  OnLiveStarting = 'OnLiveStarting'//直播中
  OnSWFLoadComplete = 'OnSWFLoadComplete'//直播中
//////////////////////////////Event///////////////

  ////////////////live///////
  LiveInterface = 'LiveInterface'
  InitInfo = 'InitInfo'
  LoginInfo = 'LoginInfo'
  isLive = false

  constructor() {
    super()
    this.node = document.getElementById('app')
    if (!this.node) {
      let app = document.createElement('div')
      app.id = 'app'
      document.body.appendChild(app)
      this.node = app
    }

    this.liveInterface = new LiveSDKInterface()
  }

  //初始化登录入口
  login(params) {
    if (!Utils.isEmptyObject(params)) {
      return false
    }
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
    this.onLogin(params)
  }

  /**
   * 发送事件
   **/
  dispatch(type) {
    this.fire(type)
  }

  /**
   * 接收事件
   * **/
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
  onLogin(d = {
    success: (d) => {
    }, fail: (d) => {
    }
  }) {
    this.liveInterface.on(this.liveInterface.ONLOGINSUCCESS, (result) => {
      // d.success && d.success(result)
      LiveInfo.loginInfo = LiveInfo.parseLoginInfo(result)
      if (!LiveInfo.getLoginInfoData('live', 'liveStartTime')) {
        this.isLive = false
      } else {
        this.isLive = true
      }

      d.success && d.success(result)
      this.dispatch(this.OnLoginSuccess)
    })

    //监听登录失败后的回调
    this.liveInterface.on(this.liveInterface.ONLOGINERROR, (result) => {
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
  onLiveStream(d = {
    liveStart: () => {
    }, living: () => {
    }, liveEnd: () => {
    }
  }) {
    //直播开始    //TODO 状态机管理
    this.liveInterface.on(this.liveInterface.ONLIVESTART, () => {
      this.isLive = true
      this.dispatch(this.OnLiveStart)
      d.liveStart && d.liveStart()
    })

    this.liveInterface.on(this.liveInterface.ONLIVESTARTING, () => {
      this.isLive = true
      this.dispatch(this.OnLiveStarting)
      d.living && d.living()
    })

    //直播结束
    this.liveInterface.on(this.liveInterface.ONLIVEEND, () => {
      this.isLive = false
      this.dispatch(this.OnLiveEnd)
      d.liveEnd && d.liveEnd()
    })
  }

  /**
   * 获取当前用户总人数
   * **/
  onUserCount(d = {
    callback: () => {
    }
  }) {
    this.liveInterface.on(this.liveInterface.ONUSERCOUNTMESSAGE, (result) => {
      LiveInfo.userCount = result ? result[0] : 0
      d.callback && d.callback(LiveInfo.userCount)
      this.dispatch(this.OnUserCountMessage)
    })
  }

  /**
   *监听发布问答功能回调
   * **/
  onQAPulish(d = {
    callback: () => {
    }
  }) {

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
  onQAAnswer(d = {
    callback: () => {
    }
  }) {
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
  onQAQuestion(d = {
    callback: () => {
    }
  }) {
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
  onPublicChat(d = {
    callback: () => {
    }
  }) {
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
  onPrivateChat(d = {
    callback: () => {
    }
  }) {
    //收到私聊信息
    this.liveInterface.on(this.liveInterface.ONPRIVATECHATMESSAGE, (result) => {
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
  onPrivateChatRevert(d = {
    callback: () => {
    }
  }) {
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
  onBannedInfomation(d = {
    callback: () => {
    }
  }) {
    this.liveInterface.on(this.liveInterface.ONINFORMATION, (result) => {
      LiveInfo.bannedInfomation = result[0]
      d.callback && d.callback(LiveInfo.bannedInfomation)
    })
  }

  /**
   *
   * 显示老师在线信息
   * **/
  onTeachers(d = {
    callback: () => {
    }
  }) {
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
  onAnnounce(d = {
    callback: () => {
    }
  }) {
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
  onAnounceRelease(d = {
    callback: () => {
    }
  }) {
    //显示公告
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTRELEASE, (result) => {
      LiveInfo.onAnnounceInfo = LiveInfo.parseAnnounceInfo(result)
      this.dispatch(this.OnAnnounceShow)
      d.callback && d.callback(LiveInfo.onAnnounceInfo)
    })
  }

  /**
   * 删除公告
   * **/
  onAnounceDelete(d = {
    callback: () => {
    }
  }) {
    this.liveInterface.on(this.liveInterface.ONANNOUNCEMENTREMOVE, (result) => {
      this.dispatch(this.OnAnnounceDelete)
      d.callback && d.callback()
    })
  }

  /**直播间简介**/
  onLiveDesc(d = {
    callback: () => {
    }
  }) {
    //简介
    this.liveInterface.on(this.liveInterface.ONLIVEDESC, (result) => {
      LiveInfo.onLiveDesc = result[0]
      this.dispatch(this.OnLiveDesc)
      d.callback && d.callback(LiveInfo.onLiveDesc)
    })
  }

  /**
   * flash文档加载完成
   */
  onFlashPlayerLoad(d = {
    callback: () => {
    }
  }) {
    window.on_cc_swf_loading_completed = (result) => {
      d.callback && d.callback(result)
    }
  }

  /**
   * 设置文档自适应模式
   */
  documentAdaptive(b = false) {
    if (typeof b !== 'boolean') {
      return false
    }
    //简介
    this.liveInterface.call(this.liveInterface.DOCADAPT, b)
    return false
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
  changeLine(t = {index: 0}) {
    this.liveInterface.call(this.liveInterface.CHANGELINE, (t.index ? parseInt(t.index) : 0 ))
  }

  /**
   * 发送公共聊天
   * **/
  sendPublicMsg(d = {msg: ''}) {
    let msg = ''
    if (d.msg) {
      msg = d.msg
    }
    this.liveInterface.call(this.liveInterface.SENDPUBLICMSG, msg)

  }

  /**
   * 发送私聊
   * **/
  sendPrivateMsg(d = {msg: '', teacher: '', teacherName: ''}) {
    let msg = d.msg ? d.msg : ''
    let t = d.teacher ? d.teacher : ''
    let m = d.teacherName ? d.teacherName : ''
    this.liveInterface.call(this.liveInterface.SENDPRIVATEMSG, t, m, msg)
  }

  /**
   * 退出直播间
   * **/
  logoutRoom(d = {
    success: () => {
    }, error: () => {
    }
  }) {
    this.liveInterface.call(this.liveInterface.LOGOUT, d)

  }

  /***
   * 发送问答
   *
   * **/
  sendQuestionMsg(d = {msg: ''}) {
    let msg = d.msg ? d.msg : ''
    //发送问答
    this.liveInterface.call(this.liveInterface.SENDQUESTIONMSG, msg)
  }

}

export default LiveAdaptive