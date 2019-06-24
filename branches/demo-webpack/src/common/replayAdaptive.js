/**
 * 观看回放 Web SDK 接口封装
 * JavaScript 发布订阅事件封装
 * */
import {ReplaySDKInterface} from 'common/interface' //引入接口适配器
import Utils from 'common/utils'
import EventEmitter from 'onfire.js'

class ReplayAdaptive extends EventEmitter {

  viewerId = ''
  groupId = ''
  isH5play = true
  fastMode = true

  constructor() {
    super()

    this.replayInterface = new ReplaySDKInterface()
  }

  /**
   * @method config
   * @description 登录观看回放
   * @param {Object} params 登录参数对象
   * @property {String} params.userId 用户ID
   * @property {String} params.roomId 直播间ID
   * @property {String} params.recordId 回放ID
   * @property {String} params.viewername 用户昵称
   * @property {String} params.viewertoken 用户密码，免密码验证可省略
   * @property {String} params.groupId 分组ID
   * @property {Boolean} params.isH5play PC端观看回放使用video播放器
   * @property {Boolean} params.fastMode 是否开启极速文档，默认开启
   * @example
   * $.DW.config({
   *     userId: 'userId',
   *     roomId: 'roomId',
   *     recordId: 'recordId',
   *     viewername: 'viewername',
   *     viewertoken: 'viewertoken',
   *     groupId: '',
   *     isH5play: true,
   *     fastMode: true,
   *   });
   */

  login(params) {
    if (!Utils.isEmptyObject(params)) {
      return false
    }
    let {isH5play = true, fastMode = true} = {isH5play: params.isH5play, fastMode: params.fastMode}
    this.replayInterface.call(this.replayInterface.CONFIG, {
      userId: params.userId || '',
      roomId: params.roomId || '',
      recordId: params.recordId || '',
      groupId: params.groupId || '',
      viewername: params.viewerName || '',
      viewertoken: params.viewerToken || '',
      isH5play: isH5play,
      fastMode: fastMode,
    })

    let _property = {
      isH5play: isH5play,
      fastMode: fastMode
    }
    this.initPropertySync(_property)

    /**
     * @function on_cc_login_success
     * @description 观看回放登录成功回调
     * @param {Array} result 登录成功返回信息
     * @property {Object} result.live 直播开始时间信息
     * @property {Object} result.room 直播间信息
     * @property {Object} result.viewer 用户信息
     * @property {Object} result.template 直播间模板信息
     * @example
     * window.on_cc_login_success = (datas) => {
     *    datas ={
     *      live: {
     *        endTime: "2019-02-15 15:46:01.0",//直播结束绝对时间
     *        startTime: "2019-02-15 15:28:59.0"//直播开始的绝对时间
     *      },
     *      room: {
     *         desc: '<p>&nbsp; &nbsp; &nbsp;直播间描述简介</p>',//直播间简介
     *         liveStartTime: '2018-06-06 01:50:41.0',//直播开始时间（倒计时）
     *         name: '直播间标题',//直播间标题
     *         barrage: 1,//是否启用弹幕功能
     *         documentDisplayMode:1//是否开启文档自适应
     *       },
     *       template: {
     *          desc: '视频，文档，聊天，问答',//直播间模板
     *          name: '模板五',//模板类型
     *          type: 5//模板类型
     *       },
     *       viewer: {
     *          groupId: '',//分组id
     *          id: '408cc50a3b1842169720aa2a4cb28de9',//服务器生成用户唯一标识id
     *          name: '抖音再看回放'//用户昵称
     *       }
     *    }
     *  }
     */

    this.replayInterface.on(this.replayInterface.ONLOGINSUCCESS, (result) => {
      params.success && params.success(result)
      this.initReplayInfoAync(result)
    })

    /**
     * @function on_cc_login_error
     * @description 观看回放登录失败回调
     * @param {Object} error 登录失败信息
     * @example
     window.on_cc_login_error = (error) => {
       }
     */

    this.replayInterface.on(this.replayInterface.ONLOGINERROR, (error) => {
      params.fail && params.fail(error)
    })
    return true
  }

  // 同步属性

  initPropertySync(data) {
    this.fastMode = data.fastMode
    this.isH5play = data.isH5play
    this.emitPropertySync()
  }

  emitPropertySync() {
    this.emit('documentMode', this.fastMode)
    this.emit('playerMode', this.isH5play)
  }

  onDocumentMode(callback) {
    this.on('documentMode', (data) => {
      let mode = {
        mode: data ? 'iframe' : 'flash',
        fastMode: data
      }
      callback(mode)
    })
  }

  onPlayerMode(callback) {
    this.on('playerMode', (data) => {
      let mode = {
        mode: data ? 'video' : 'flash',
        isH5play: data
      }
      callback(mode)
    })
  }

  //异步数据

  initReplayInfoAync(data) {
    this.viewerId = data.viewer.id
    this.groupId = data.viewer.groupId
    this.emitReplayInfoAync(data)
  }

  emitReplayInfoAync(data) {
    this.emit('viewerId', this.viewerId)
    this.emit('groupId', this.groupId)
    data.room && this.emit('desc', data.room.desc)
    data.room && this.emit('barrage', data.room.barrage)
    data.room && this.emit('documentDisplayMode', data.room.documentDisplayMode)
  }

  onViewerId(callback) {
    this.on('viewerId', (data) => {
      let _data = {
        viewerId: data
      }
      callback(_data)
    })
  }

  onGroupId(callback) {
    this.on('groupId', (data) => {
      let _data = {
        groupId: data
      }
      callback(_data)
    })
  }

  onDescInfo(callback) {
    this.on('desc', (data) => {
      let desc = {
        desc: data
      }
      callback(desc)
    })
  }

  onBarrageInfo(callback) {
    this.on('barrage', (data) => {
      let barrage = {
        isBarrage: data
      }
      callback(barrage)
    })
  }

  onDocumentDisplayMode(callback) {
    this.on('documentDisplayMode', (data) => {
      let mode = {
        documentDisplayMode: data == 1 ? true : false
      }
      callback(mode)
    })
  }

  /**
   * @method play
   * @description 切换播放暂停状态
   * @example
   * $.DW.play()
   */

  togglePlay() {
    this.replayInterface.call(this.replayInterface.PLAY)
  }

  /**
   * @method seek
   * @description 切换播放暂停状态
   * @param {Number} time 跳转到指定时间播放，time单位为秒
   * @example
   * $.DW.seek(24)
   */

  seek(time) {
    this.replayInterface.call(this.replayInterface.SEEK, parseFloat(time))
  }

  /**
   * @method getPlayerTime
   * @description 获取当前播放时间
   * @example
   * $.DW.getPlayerTime()
   */

  get currentTime() {
    return this.replayInterface.call(this.replayInterface.GETPLAYERTIME)
  }

  /**
   * @method getDuration
   * @description 获取播放器总时长,需要在播放器加载完成（on_cc_live_player_load）之后获取
   * @example
   * $.DW.getDuration()
   */

  get durationTime() {
    return this.replayInterface.call(this.replayInterface.GETDURATION)
  }

  /**
   * @method getBuffer
   * @description 获取播放器缓冲进度（buffer）
   * @example
   * $.DW.getBuffer()
   */

  get buffer() {
    return this.replayInterface.call(this.replayInterface.GETBUFFER)
  }

  /**
   * @method getVolume
   * @description 获取播放器音量
   * @example
   * $.DW.getVolume()
   */

  get volume() {
    return this.replayInterface.call(this.replayInterface.GETVOLUME)
  }

  /**
   * @method setVolume
   * @description 设置播放器音量
   * @param {Number} number 置播放器音量，取值范围[0-1]
   * @example
   * $.DW.setVolume()
   */

  set volume(value) {
    if (isNaN(value)) {
      return false
    }
    this.replayInterface.call(this.replayInterface.SETVOLUME, value)
    return true
  }

  /**
   * @method playbackRate
   * @description 设置倍速播放
   * @param {Number} number 倍速播放值,默认1.0 正常速度，倍速设置范围0.5～2倍速，仅支持H5播放器
   * @example
   * $.DW.playbackRate(1.5)
   */

  set rate(number) {
    if (isNaN(number)) {
      return false
    }
    this.replayInterface.call(this.replayInterface.PLAYBACKRATE, number)
    return true
  }

  /**
   * @method isShowBar
   * @description 是否隐藏播放组件控制器，必须在登录成功之前调用
   * @param {Number} number 可选值： 0（隐藏控制器）、1（显示控制器），默认为1
   * @example
   * $.DW.isShowBar(0)
   */

  isShowControl(boolean) {
    if (typeof boolean !== 'boolean') {
      return false
    }
    let number = boolean ? 0 : 1
    this.replayInterface.call(this.replayInterface.ISSHOWBAR, number)
    return true
  }

  /**
   * @method docAdapt
   * @description 极速文档自适应模式，必须在登录成功以后（on_cc_login_success）调用
   * @param {Boolean} boolean true（自适应）、false（铺满），默认为false
   * @example
   * $.DW.docAdapt(true)
   */

  documentAdaptive(boolean) {
    if (typeof boolean !== 'boolean') {
      return false
    }
    this.replayInterface.call(this.replayInterface.DOCADAPT, boolean)
    return true
  }

  /**
   * @method logout
   * @description 退出观看回放
   * @example
   * $.DW.logout()
   */

  logout() {
    this.replayInterface.call(this.replayInterface.LOGOUT)
  }

  /**
   * @function on_cc_live_qa_question
   * @description 监听历史提问信息
   * @param {Object} datas 历史提问信息对象
   * @property {String} datas.content 提问内容
   * @property {String} datas.groupId 分组ID
   * @property {String} datas.id 问题ID
   * @property {String} datas.isPublish 是否发布
   * @property {String} datas.userAvatar 提问者身份
   * @property {String} datas.userId 用户ID
   * @property {String} datas.userName 用户昵称
   * @example
   * window.on_cc_live_qa_question = (datas) => {
   *    datas = {
   *        content: "333333",
   *        groupId: "",
   *        id: "7D7C2383BB609EBC",
   *        isPublish: 1,
   *        userAvatar: "",
   *        userId: "74e9559d78e34350b7993c3318062e89",
   *        userName: "撒发达"
   *      }
   *  }
   */

  onQuestions(callback) {
    this.replayInterface.on(this.replayInterface.ONQAQUETION, (data) => {
      let question = data.value
      callback && callback(question)
    })
  }

  /**
   * @function on_cc_live_qa_answer
   * @description 监听历史回答信息
   * @param {Object} datas 历史回答信息对象
   * @property {String} datas.content 回答内容
   * @property {String} datas.groupId 分组ID
   * @property {String} datas.isPrivate 是否为私聊回复，1（私聊回复）、2（公开回复）
   * @property {String} datas.questionId 对应问题ID
   * @property {String} datas.userAvatar 回答者身份
   * @property {String} datas.userId 用户ID
   * @property {String} datas.userName 用户昵称
   * @example
   * window.on_cc_live_qa_answer = (datas) => {
   *      datas = {
   *          content: "sdfdsafd",
   *          groupId: "",
   *          isPrivate: 1,
   *          questionId: "6EA808A33A3251EB",
   *          userAvatar: "",
   *          userId: "222ec2eaab2b4d85a7bc34e93032d46e",
   *          userName: "sdf",
   *          userRole: "publisher"
   *       }
   *   }
   */

  onAnswers(callback) {
    this.replayInterface.on(this.replayInterface.ONQAANSWER, (data) => {
      let answer = data.value
      callback && callback(answer)
    })
  }

  /**
   * @function on_cc_live_chat_msg_sync
   * @description 同步监听历史聊天信息
   * @param {Object} datas 历史聊天信息对象
   * @property {String} datas.chatId 聊天信息ID
   * @property {String} datas.groupId 分组ID
   * @property {String} datas.msg 聊天信息内容
   * @property {String} datas.role 发送聊天者身份
   * @property {String} datas.status 聊天信息审核状态，0（默认审核）、1（未审核）
   * @property {String} datas.time 聊天发布相对时间，相对直播开始到发布聊天时间，单位为秒
   * @property {String} datas.userRole 发送聊天者身份
   * @example
   * window.on_cc_live_chat_msg_sync = (datas) => {
   *      datas = {
   *        chatId: "77380211",
   *        groupId: "",
   *        msg: "111",
   *        role: 1,
   *        status: "0",
   *        time: 24,
   *        userRole: "publisher",
   *        useravatar: "",
   *        usercustommark: "",
   *        userid: "222ec2eaab2b4d85a7bc34e93032d46e",
   *        username: "sdf"
   *      }
   * }
   */

  onChatMessageSync(callback) {
    this.replayInterface.on(this.replayInterface.ONCHATMSGSYNC, (datas) => {
      for (let data of datas) {
        let message = data
        callback && callback(message)
      }
    })
  }

  /**
   * @function on_cc_callback_pages
   * @description 返回所有文档信息
   * @param {Object} datas 文档信息对象数组
   * @property {String} datas.docId 文档ID
   * @property {String} datas.docName 文档名称
   * @property {String} datas.docTotalPage 总页数
   * @property {String} datas.encryptDocId 文档加密ID
   * @property {String} datas.height 图片高度
   * @property {String} datas.width 图片宽度
   * @property {String} datas.pageNum 当前页码
   * @property {String} datas.pageTitle 文档标题
   * @property {String} datas.time 图片相对开始直播时翻到当前页的时间
   * @property {String} datas.url 图片地址
   * @property {String} datas.mode
   * @property {String} datas.useSDK
   * @property {String} datas.serverTime
   * @example
   * window.on_cc_callback_pages = (datas) => {
   * datas = {
   *      docId: '0D1252DB6778DB1C9C33DC5901307461',
   *      docName: '关于CC视频.pptx',
   *      docTotalPage: 40,
   *      encryptDocId: '0D1252DB6778DB1C9C33DC5901307461',
   *      height: 540,
   *      mode: 1,
   *      pageNum: 0,
   *      pageTitle: '',
   *      serverTime: 1550216077371,
   *      time: 337,
   *      url: 'http://image.csslcloud.net/image/3115C441D8B66A719C33DC5901307461/0D1252DB6778DB1C9C33DC5901307461/0.jpg',
   *      useSDK: true,
   *      width: 960
   *    }
   * }
   */

  onAllPages(callback) {
    this.replayInterface.on(this.replayInterface.ONCALLBACKPAGE, (datas) => {
      callback && callback(datas)
    })
  }

  /**
   * @function on_cc_callback_page_change
   * @description 翻页回调
   * @param {Object} datas 当翻页时，同步返回翻页信息对象
   * @property {String} datas.docId 文档ID
   * @property {String} datas.docName 文档名称
   * @property {String} datas.docTotalPage 总页数
   * @property {String} datas.encryptDocId 文档加密ID
   * @property {String} datas.height 图片高度
   * @property {String} datas.width 图片宽度
   * @property {String} datas.pageNum 当前页码
   * @property {String} datas.pageTitle 文档标题
   * @property {String} datas.time 图片相对开始直播时翻到当前页的时间
   * @property {String} datas.url 图片地址
   * @property {String} datas.mode
   * @property {String} datas.useSDK
   * @property {String} datas.serverTime
   * @example
   * window.on_cc_callback_pages = (datas) => {
   * datas = {
   *      docId: '0D1252DB6778DB1C9C33DC5901307461',
   *      docName: '关于CC视频.pptx',
   *      docTotalPage: 40,
   *      encryptDocId: '0D1252DB6778DB1C9C33DC5901307461',
   *      height: 540,
   *      mode: 1,
   *      pageNum: 0,
   *      pageTitle: '',
   *      serverTime: 1550216077371,
   *      time: 337,
   *      url: 'http://image.csslcloud.net/image/3115C441D8B66A719C33DC5901307461/0D1252DB6778DB1C9C33DC5901307461/0.jpg',
   *      useSDK: true,
   *      width: 960
   *    }
   * }
   */

  onChangePageSync(callback) {
    this.replayInterface.on(this.replayInterface.ONCALLBACKPAGECHANGE, (data) => {
      callback && callback(data)
    })
  }

  /**
   * @function on_cc_live_player_load
   * @description 回放播放器加载完成事件，完全支持flash播放器和部分现代浏览器中的video播放器
   * @example
   * window.on_cc_live_player_load = () => {
   * }
   */

  onPlayerLoad(callback) {
    this.replayInterface.on(this.replayInterface.ONPLAYERLOAD, () => {
      callback && callback()
    })
  }

  /**
   * @function on_player_start
   * @description 播放开始，仅支持pc端
   * @example
   * window.on_player_start = () => {
   * }
   */

  onPlayerStart(callback) {
    this.replayInterface.on(this.replayInterface.ONPLAYERSTART, () => {
      callback && callback()
    })
  }

  /**
   * @function on_spark_player_pause
   * @description 播放暂停，仅支持pc端
   * @example
   * window.on_spark_player_pause = () => {
   * }
   */

  onPlayerPause(callback) {
    this.replayInterface.on(this.replayInterface.ONPLAYERPAUSE, () => {
      callback && callback()
    })
  }

  /**
   * @function on_spark_player_pause
   * @description 恢复播放，仅支持pc端
   * @example
   * window.on_spark_player_pause = () => {
   * }
   */

  onPlayerResume(callback) {
    this.replayInterface.on(this.replayInterface.ONPLAYERRESUME, () => {
      callback && callback()
    })
  }

  /**
   * @function on_spark_player_end
   * @description 播放停止，仅支持pc端
   * @example
   * window.on_spark_player_end = () => {
   * }
   */

  onPlayerEnd(callback) {
    this.replayInterface.on(this.replayInterface.ONPLAYEREND, () => {
      callback && callback()
    })
  }

}

export default ReplayAdaptive