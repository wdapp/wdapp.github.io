/**
 * 观看回放 Web SDK 接口适配
 * 直播回放sdk调用接口 v0.0.1
 * */
class LiveSDKInterface {
  INIT = 'init'
  SENDPUBLICMSG = 'sendPublicMsg'
  SENDPRIVATEMSG = 'sendPrivateChatMsg'
  SENDQUESTIONMSG = 'sendQuestionMsg'
  BARRAGE = 'barrage'
  GETLINE = 'getLine'
  CHANGELINE = 'changeLine'
  ONLYAUDIO = 'onlyAudio'
  SETSOUND = 'setSound'
  ANSWERROLLCALL = 'answerRollcall'
  REPLYVOTE = 'replyVote'
  DOCBARRAGE = 'docBarrage'
  OPENBARRAGE = 'openBarrage'
  SHOWCONTROL = 'showControl'
  REQUESTINTERACTION = 'requestInteraction'
  HANDUPINTERACTION = 'hangupInteraction'
  ENTERINTERACTIONROOM = 'enterInteractionRoom'
  DOCADAPT = 'docAdapt'
  SHOWMARQUEE = 'showMarquee'
  SHOWMARQUEEDOC = 'showMarqueeDoc'
  LOGOUT = 'logout'
  PLAYERBACKGROUNDIMAGEURI = 'playerBackgroundImageUri'
  PLAYERBACKGROUNDHINT = 'playerBackgroundHint'
  LIVECOUNTDOWN = 'liveCountdown'
  GETPUBLISHINGQUESTIONAIRE = 'getPublishingQuestionnaire'
  CHANGENICKNAME = 'changeNickname'
  SETDOCMODE = 'setDocMode'
  GETDOCS = 'getDocs'
  CHANGEPAGETO = 'changePageTo'
  SUBMITQUESTIONNAIRE = 'submitQuestionnaire'

  ONLOGINSUCCESS = 'onLoginSuccess'
  ONLIVESTART = 'onLiveStart'
  ONUSERCOUNTMESSAGE = 'onUserCountMessage'
  ONLIVEEND = 'onLiveEnd'
  ONPUBLICCHATMESSAGE = 'onPublicChatMessage'
  ONPUBLICCHATLOGMANAGE = 'onPublicChatLogManage'
  ONPRIVATECHATMESSAGE = 'onPrivateChatMessage'
  ONPRIVATEANSWER = 'onPrivateAnswer'
  ONQUESTION = 'onQuestion'
  ONANSWER = 'onAnswer'
  ONINFORMATION = 'onInformation'
  ONKICKOUT = 'onKickOut'
  ONANNOUNCEMENTSHOW = 'onAnnouncementShow'
  ONANNOUNCEMENTRELEASE = 'onAnnouncementRelease'
  ONANNOUNCEMENTREMOVE = 'onAnnouncementRemove'
  ONLOGINERROR = 'onLoginError'
  ONLIVESTARTING = 'onLiveStarting'
  ONSTARTROLLCALL = 'onStartRollCall'
  ONSTARTLOTTERY = 'onStartLottery'
  ONWINLOTTERY = 'onWinLottery'
  ONSTOPLOTTERY = 'onStopLottery'
  ONSTARTVOTE = 'onStartVote'
  ONSTOPVOTE = 'onStopVote'
  ONVOTERESULT = 'onVoteResult'
  ONSHOWUSERCOUNT = 'onShowUserCount'
  ONLIVEDESC = 'onLiveDesc'
  ONBROADCASTMSG = 'onBroadcastMsg'
  ONQAPUBLISH = 'onQaPublish'
  ONROOMSETTING = 'onRoomSetting'
  ONQUESTIONNAIREPUBLISH = 'onQuestionnairePublish'
  ONQUESTIONNAIREPUBLISHSTOP = 'onQuestionnairePublishStop'
  ONQUESTIONNAIREPUBLISHSTATIS = 'onQuestionnairePublishStatis'
  ONONLINETEACHERS = 'onOnlineTeachers'
  ONLIVETIME = 'onLiveTime'
  ONSWITCHSOURCE = 'onSwitchSource'
  ONSWITCHVIDEODOC = 'onSwitchVideoDoc'
  ONSILENCEUSERCHATMESSAGE = 'onSilenceUserChatMessage'
  ONSOCKETCONNECT = 'onSocketConnect'
  ONSOCKETDISCONNECT = 'onSocketDisconnect'
  ONSWFLOADCOMPLETE = 'onSWFLoadComplete'
  ONSWFSTART = 'onSWFStart'

  constructor() {


  }

  get LiveMain() {
    return DWLive
  }

  get LiveCall() {
    return {
      'init': DWLive.init, //初始化
      'sendPublicMsg': DWLive.sendPublicChatMsg,//发送公共聊天
      'sendPrivateChatMsg': DWLive.sendPrivateChatMsg,//发送私聊
      'sendQuestionMsg': DWLive.sendQuestionMsg,//发送问题
      'barrage': DWLive.barrage,//发送弹幕
      'getLine': DWLive.getLine,//获取线路
      'changeLine': DWLive.changeLine,//切换线路
      'onlyAudio': DWLive.onlyAudio,//只听声音
      'setSound': DWLive.setSound,//设置声音
      'answerRollcall': DWLive.answerRollcall,//签到
      'replyVote': DWLive.replyVote,//答题
      'docBarrage': DWLive.docBarrage,//文档弹幕
      'openBarrage': DWLive.openBarrage,//开启弹幕
      'showControl': DWLive.showControl,//显示隐藏控制条
      'requestInteraction': DWLive.requestInteraction,//请求语音互动
      'hangupInteraction': DWLive.hangupInteraction,//挂断双向视频
      'enterInteractionRoom': DWLive.enterInteractionRoom,//进入互动房间
      'sendInteractionMessage': DWLive.sendInteractionMessage,//发送互动信息
      'docAdapt': DWLive.docAdapt,//文档自适应
      'showMarquee': DWLive.showMarquee,//显示跑马灯
      'showMarqueeDoc': DWLive.showMarqueeDoc,//显示文档跑马灯
      'logout': DWLive.logout,//退出
      'playerBackgroundImageUri': DWLive.playerBackgroundImageUri,//获取自定义背景图
      'playerBackgroundHint': DWLive.playerBackgroundHint,//获取自定义提示语言
      'liveCountdown': DWLive.liveCountdown,//直播倒计时
      'getPublishingQuestionnaire': DWLive.getPublishingQuestionnaire,//获取问卷
      'changeNickname': DWLive.changeNickname,//获取用户昵称
      'setDocMode': DWLive.setDocMode,//设置文档模式
      'getDocs': DWLive.getDocs,//获取文档信息
      'changePageTo': DWLive.changePageTo,//跳转至指定页
      'submitQuestionnaire': DWLive.submitQuestionnaire,//提交问卷
    }
  }

  get LiveOnFunc() {
    return {
      'onLoginSuccess': 'onLoginSuccess',//登录成功回调
      'onLiveStart': 'onLiveStart',//直播开始回调
      'onUserCountMessage': 'onUserCountMessage',//在线人数
      'onLiveEnd': 'onLiveEnd',//直播结束
      'onPublicChatMessage': 'onPublicChatMessage',//收到公聊回调
      'onPublicChatLogManage': 'onPublicChatLogManage',//收到聊天审核
      'onPrivateChatMessage': 'onPrivateChatMessage',
      'onPrivateAnswer': 'onPrivateAnswer',//收到私聊回复
      'onQuestion': 'onQuestion',//收到提问
      'onAnswer': 'onAnswer',//收到回答
      'onInformation': 'onInformation',//直播间禁止
      'onKickOut': 'onKickOut',//提出
      'onAnnouncementShow': 'onAnnouncementShow',//开始直播后显示公告
      'onAnnouncementRelease': 'onAnnouncementRelease',//发布和修改公告
      'onAnnouncementRemove': 'onAnnouncementRemove',//删除公告
      'onLoginError': 'onLoginError',//登录错误
      'onLiveStarting': 'onLiveStarting',//移动web端直播中的回调
      'onStartRollCall': 'onStartRollCall',//开始签到
      'onStartLottery': 'onStartLottery',//开始抽奖
      'onWinLottery': 'onWinLottery',//中奖
      'onStopLottery': 'onStopLottery',//结束抽奖
      'onStartVote': 'onStartVote',//开始答题
      'onStopVote': 'onLiveStarting',//结束答题
      'onVoteResult': 'onVoteResult',//答题统计
      'onShowUserCount': 'showUserCount',//是否显示在线统计
      'onLiveDesc': 'onLiveDesc',//直播见简介
      'onBroadcastMsg': 'onBroadcastMsg',//广播消息回调
      'onQaPublish': 'onQaPublish',//发布问题
      'onRoomSetting': 'onRoomSetting',//直播见布局配置
      'onQuestionnairePublish': 'onQuestionnairePublish',//发布问卷
      'onQuestionnairePublishStop': 'onQuestionnairePublishStop',//结束发布问卷
      'onQuestionnairePublishStatis': 'onQuestionnairePublishStatis',//发布问卷统计
      'onOnlineTeachers': 'onOnlineTeachers',//获取讲师在线列表
      'onLiveTime': 'onLiveTime',//获取开始直播时间和直播时间
      'onSwitchSource': 'onSwitchSource',//直播数据源场景
      'onSwitchVideoDoc': 'onSwitchVideoDoc',//布局场景切换
      'onSilenceUserChatMessage': 'onSilenceUserChatMessage',//禁言后聊天回调
      'onSocketConnect': 'onSocketConnect',//socket链接成功后回调
      'onSocketDisconnect': 'onSocketDisconnect',//链接失败后回调
      'onSWFLoadComplete': 'on_cc_swf_loading_completed',//swf加载完成回调
      'onSWFStart': '_onStart'//PC端中直播回调

    }
  }

  call() {
    if (arguments.length < 1) {
      return 'Please pass in a parameter greater than one'
    }
    var t = arguments[0]
    if (this.LiveCall && this.LiveCall.hasOwnProperty(t)) {

      var result = this.LiveCall[t]
      if (typeof result === 'function') {
        var params = []
        for (var i = 1; i < arguments.length; i++) {
          params.push(arguments[i])
        }
        return result.apply(this.LiveMain, params)
      } else {
        return result
      }
    }
    return function () {
      return 'no function for call'
    }
  }

  on(t, f) {
    if (this.LiveOnFunc && this.LiveOnFunc.hasOwnProperty(t)) {
      var func = this.LiveOnFunc[t]
      this.LiveMain[func] = function (...options) {
        if (!f) return
        f.call(null, options)
      }

    }
    return null
  }

}

class ReplaySDKInterface {
  CONFIG = 'config'
  DOCADAPT = 'docAdapt'
  ISSHOWBAR = 'isShowBar'
  GETBUFFER = 'getBuffer'
  SETVOLUME = 'setVolume'
  GETVOLUME = 'getVolume'
  PLAY = 'play'
  SEEK = 'seek'
  GETPLAYERTIME = 'getPlayerTime'
  GETDURATION = 'getDuration'
  SETZSCALE = 'setZScale'
  GETZSCALE = 'getZScale'
  SETSCALE = 'setScale'
  GETSCALE = 'getScale'
  OPENSETTINGPANEL = 'openSettingPanel'
  PLAYBACKRATE = 'playbackRate'
  LOGOUT = 'logout'

  ONCHATMSG = 'onChatMsg'
  ONCHATMSGSYNC = 'onChatMsgSync'
  ONBROADCASTMSG = 'onBroadcastMsg'
  ONBROADCASTMSGSYNC = 'onBroadcastMsgSync'
  ONQAQUETION = 'onQAQuetion'
  ONQAANSWER = 'onQAAnswer'
  ONCALLBACKPAGE = 'onCallbackPage'
  ONCALLBACKPAGECHANGE = 'onCallbackPageChange'
  ONLOGINERROR = 'onLoginError'
  ONLOGINSUCCESS = 'onLoginSuccess'
  ONPLAYERLOAD = 'onPlayerLoad'
  ONPLAYERSTART = 'onPlayerStart'
  ONPLAYERPAUSE = 'onPlayerPause'
  ONPLAYERRESUME = 'onPlayerResume'
  ONPLAYEREND = 'onPlayerEnd'

  constructor() {
  }

  get playbackMain() {
    return $.DW
  }

  get playbackCall() {
    return {
      'config': $.DW.config,//登录
      'docAdapt': $.DW.docAdapt,//文档自适应模式
      'isShowBar': $.DW.isShowBar,//隐藏显示播放器控制条
      'getBuffer': $.DW.getBuffer,//获取buffer
      'setVolume': $.DW.setVolume,//设置音量
      'getVolume': $.DW.getVolume,//获取音量
      'play': $.DW.play,//播放开始
      'seek': $.DW.seek,//跳转
      'getPlayerTime': $.DW.getPlayerTime,
      'getDuration': $.DW.getDuration,
      'logout': $.DW.logout,
      'setZScale': $.DW.setZScale,//设置画面缩放比例
      'getZScale': $.DW.getZScale,//获取画面缩放比例
      'setScale': $.DW.setScale,//设置画面缩放
      'getScale': $.DW.getScale,//
      'openSettingPanel': $.DW.openSettingPanel,//打开设置面板
      'playbackRate': $.DW.playbackRate//设置倍速播放房
    }
  }

  get playbackOnfunc() {
    return {
      'onChatMsg': 'on_cc_live_chat_msg',//显示全部聊天信息
      'onChatMsgSync': 'on_cc_live_chat_msg_sync',//同步显示聊天信息
      'onBroadcastMsg': 'on_cc_live_broadcast_msg',//显示全部广播信息
      'onBroadcastMsgSync': 'on_cc_live_broadcast_msg_sync',//同步显示广播信息
      'onQAQuetion': 'on_cc_live_qa_question',//显示提问信息
      'onQAAnswer': 'on_cc_live_qa_answer',//显示回答信息
      'onCallbackPage': 'on_cc_callback_pages',//返回文档对象
      'onCallbackPageChange': 'on_cc_callback_page_change',//翻页信息回调
      'onLoginError': 'on_cc_login_error',//登录失败
      'onLoginSuccess': 'on_cc_login_success',//登录成功
      'onPlayerLoad': 'on_cc_live_player_load',//播放器加载完成
      'onPlayerStart': 'on_player_start',//播放开始
      'onPlayerPause': 'on_spark_player_pause',//播放暂停
      'onPlayerResume': 'on_spark_player_resume',//恢复播放
      'onPlayerEnd': 'on_spark_player_end'//播放停止
    }
  }

  call() {
    if (arguments.length < 1) {
      return 'Please pass in a parameter greater than one'
    }
    var t = arguments[0]
    if (this.playbackCall && this.playbackCall.hasOwnProperty(t)) {
      var result = this.playbackCall[t]
      if (typeof result === 'function') {
        var params = []
        for (var i = 1; i < arguments.length; i++) {
          params.push(arguments[i])
        }
        return result.apply(this.playbackMain, params)
      } else {
        return result
      }
    }
    return function () {
      return 'no function for call'
    }
  }

  on(t, f) {
    if (this.playbackOnfunc && this.playbackOnfunc.hasOwnProperty(t)) {
      var func = this.playbackOnfunc[t]
      window[func] = function (...options) {
        if (!f) return
        f.call(null, ...options)
      }
      return null
    }
  }

}

export {LiveSDKInterface, ReplaySDKInterface}