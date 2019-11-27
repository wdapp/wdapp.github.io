/**
 * CC live video
 * v3.0.0 2019/10/12 */
(function () {

  var VERSION = "3.0.0";


  !(function () {
    function startTestVersion(d) {
      var info = d.h5 ? d.h5 : {};

      if (info.lowyerVersion) {
        if (isMax(info.lowyerVersion.v, VERSION)) {
          var date = info.lowyerVersion.expiration;
          var msg = info.errorMsg ;
          log(msg);
          if (Error) {
            throw new Error(msg)
          } else {
            warning(msg);
          }
          return
        }
      }
      if (info.latestVersion) {
        if (isMax(info.latestVersion.v, VERSION)) {
          var notifyMsg = info.notify ;
          // log(notifyMsg);
          warning(notifyMsg);
          return
        }
      }
    }

    function log(l) {
      if (console.log) {
        console.log(l);
      }
    }

    function warning(l) {
      if (console.warn) {
        console.warn(l);
      }
    }

    //判断v1 是否大于v2
    function isMax(v1, v2) {
      var v1s = v1.split(".");
      var v2s = v2.split(".");
      var index = 0;
      var len = v1s.length;
      var result = false;
      while (index < len-1) {
        var vv1 = parseInt(v1s[index]);
        var vv2 = parseInt(v2s[index]);
        if (vv1 > vv2) {
          result = true
          break;
        } else if (vv1 < vv2) {
          result = false;
          break;
        }
        index++;
      }
      return result;

    }

    function requestError(d) {

    }
    var url = "//view.csslcloud.net/version/version.json?v=" + (new Date().getTime());
    var xmlhttp = null;
    try {
      if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
      }else if(window.ActiveXObject){
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if(xmlhttp){
        xmlhttp.open("GET",url,true);
        xmlhttp.onreadystatechange = function(){
          if(xmlhttp.readyState === 4){
            if(xmlhttp.status === 200){
              var versionInfo = JSON.parse(xmlhttp.responseText);
              // log("当前的响应信息-->" + xmlhttp.responseText,versionInfo)
              if (versionInfo) {
                startTestVersion(versionInfo)
              }
            }
          }
        }
        xmlhttp.send();
      }
    }catch (e) {
      log("访问版本信息失败");
    }

  })()

  var DELAY_TIME = 10 * 1000

  function isSupportFlash() {
    var isIE = (navigator.appVersion.indexOf('MSIE') >= 0)
    var hasFlash = true

    if (isIE) {
      try {
        var objFlash = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
      } catch (e) {
        hasFlash = false
      }
    } else {
      if (!navigator.plugins['Shockwave Flash']) {
        hasFlash = false
      }
    }
    return hasFlash
  }
  //工具类
  var Util = {
    sendAjax: function (url, data, callBack) {
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: data,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (!data.success) {
            callBack(data)
            return
          }
          if (typeof callBack === 'function') {
            callBack(data)
          } else {
            if (console.log) {
              console.log('onQuestionnairePublish is undefined')
            }
          }
        },
        error: function (e) {
          if (typeof callBack === 'function') {
            callBack({errorCode: 1, msg: 'request error', result: e})
          } else {
            if (console.log) {
              console.log('onQuestionnairePublish is undefined')
            }
          }
        }
      })

    }
  }
  var DWDpc = {
    DocModeType: {NormalMode: 0, FreeMode: 1},//设置文档为自由模式或者为跟随模式（0为跟随，1为自由）
    isDPReady:false,
    dpc: {},
    fastMode: true,
    init: function () {
        this.dpc = new Dpc()
    },
    appendDrawPanel: function () {
      var dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;"></iframe>'
      if (MobileLive.isMobile() == 'isMobile') {
        dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;pointer-events: none;"></iframe>'
      }
      $('#drawPanel').parent().append(dp)
      $('div#drawPanel').remove()

      if (typeof window.on_cc_live_db_flip === 'function') {
        window.on_cc_live_db_flip()
      }
    },
    pageChange: function (pc) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.pageChange(pc)
    },
    animationChange: function (ac) {
      if (!this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.animationChange(ac)
    },
    history: function (h) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.history(h)
    },
    draw: function (d) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.draw(d)
    },
    clear: function () {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.clear()
    },
    reload: function () {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.reload()
    },
    setDocMode: function (t) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.setFreeDocMode(t)
    },
    getDocs: function (callback) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.getDocs(DWLive.roomid, DWLive.userid, callback)
    },
    changePageTo: function (dId, pI) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.changePageTo(dId, pI)
    },
    showMarquee: function (m) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.openMarquee(m)
    },
    closeMarquee: function () {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.closeMarquee()
    },
    openBarrage: function (l) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.openBarrage()
    },
    insertBarrage: function (data) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      var ifo
      try {
        ifo = JSON.parse(data)
      } catch (e) {
        ifo = {
          type: 'text',
          content: data
        }
      }
      this.dpc.insertBarrage(ifo)
    },
    closeBarrage: function () {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      this.dpc.closeBarrage()
    },
    docAdapt: function (t) {
      if( !this.isDPReady){
        return
      }
      if (!this.fastMode) {
        return
      }
      var displayMode = t ? '1' : '2'
      this.dpc.setDisplayMode(displayMode)
    }
  }

  window.isRequesting = false

  var DWLive = {
    DocModeType: {NormalMode: 0, FreeMode: 1},//设置文档为自由模式或者为跟随模式（0为跟随，1为自由）
    MediaScaleMode: {scale43: '4:3', scale169: '16:9', scaleFull: 'full', scaleNormal: 'normal'},
    init: function (option) {
      if (typeof option == 'undefined') {
        option = {}
      }

      this.userid = $.trim(option.userid)
      this.roomid = $.trim(option.roomid)
      this.groupid = $.trim(option.groupid)
      this.viewername = $.trim(option.viewername)
      this.viewertoken = $.trim(option.viewertoken)
      this.forcibly = $.trim(option.forcibly)
      this.viewercustomua = $.trim(option.viewercustomua)
      this.language = $.trim(option.language)
      this.viewercustominfo = $.trim(option.viewercustominfo)
      this.ua = $.trim(option.ua)
      this.viewerid = $.trim(option.viewerid)
      this.upid = $.trim(option.upid)
      if (typeof option.fastMode == 'string') {
        if (option.fastMode === 'false') {
          this.fastMode = false
        } else {
          this.fastMode = true
        }
      } else if (typeof option.fastMode == 'boolean') {
        this.fastMode = option.fastMode
      } else {
        this.fastMode = true
      }
      DWDpc.fastMode = this.fastMode


      this.forceNew = false
      if (typeof option.forceNew === 'boolean') {
        this.forceNew = option.forceNew
      }

      var _this = this
      var scripts = [
        '//static.csslcloud.net/js/socket.io.js',
        '//static.csslcloud.net/js/report.js'
      ]
      var isIE = (navigator.appVersion.indexOf('MSIE') >= 0)
      if (!isIE) {
        scripts.push('//static.csslcloud.net/js/AgoraRTCSDK-2.7.1.js')
      }
      var drawPanel = document.getElementById("drawPanel");
      if (DWDpc.fastMode && drawPanel) {
        scripts.push('//image.csslcloud.net/live/1.0.0/sdk/js/dpc.js?v=' + (Math.floor(Math.random() * 10000)))
      }

      if (MobileLive.isMobile() == 'isMobile') {
        if ($('#drawPanel').length > 0) {
          //启动极速动画模式
          if (!DWDpc.fastMode) {
            scripts.push('//static.csslcloud.net/js/module/drawingBoard-2.0.0.js')
          }
        }
      } else {
        if (!isSupportFlash()) {

          if (typeof DWLive.onNotSupportFlash === 'function') {
            DWLive.onNotSupportFlash()
          }

          if (this.userid == '18452D400D6B81D5') {
            var lpph = $('#' + LivePlayer.id).parent().height()
            var lppw = $('#' + LivePlayer.id).parent().width()

            var tip = '<div style="z-index: 999999;"><p style="color: #0e0e0e; width: 260px;">您还没有安装flash播放器,请点击'
              + '<a href="http://www.adobe.com/go/getflash" style="color: red;" target="_blank">这里'
              + '</a>安装</p></div>'

            $('#' + LivePlayer.id).append(tip).parent().css('z-index', '999999')

            var lpdh = $($('#' + LivePlayer.id + ' div p')[0]).height()
            var lpdw = $($('#' + LivePlayer.id + ' div p')[0]).width()

            $('#' + LivePlayer.id + ' div').css({
              'margin-left': ((lppw - lpdw - 60) / 2) + 'px',
              'margin-top': ((lpph - lpdh) / 2) + 'px'
            })

            setInterval(function () {
              $('#' + LivePlayer.id).parent().show()
            }, 3000)
          }
        }

        scripts.push(
          '//static.csslcloud.net/js/swfobject.js',
          '//static.csslcloud.net/js/json3.min.js'
        )
      }
      _this.loadScript(scripts, function () {
        _this.login(fn)

        function fn() {
          _this.history = new History()
        }

        if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
          var dp = '<canvas id="drawPanel" width="1200" height="1200" style="position: absolute;z-index:2;top:0;left: 0"></canvas>'
            + '<iframe id="dpa" src="" frameborder="0" style="position: absolute;top:0;left: 0"></iframe>'
          $('#drawPanel').parent().append(dp)
          $('div#drawPanel').remove()
          $.DrawingBoard.config()
        }
      })
    },

    login: function (fn) {
      $.ajax({
        url: '//view.csslcloud.net/api/room/login',
        type: 'GET',
        dataType: 'jsonp',
        data: {
          roomid: this.roomid,
          userid: this.userid,
          groupid: this.groupid,
          viewername: this.viewername,
          viewertoken: this.viewertoken,
          forcibly: this.forcibly,
          viewercustomua: this.viewercustomua,
          viewercustominfo: this.viewercustominfo,
          version:VERSION,
          service:2,
          client:4

        },
        success: function (data) {
          if (!data.success) {
            if (typeof DWLive.onLoginError === 'function') {
              DWLive.onLoginError(data)
            }
            return
          }

          var isHttps = window.location.protocol === 'https:'
          var host = data.datas.pusherNode.primary
          if (isHttps && host && host.indexOf(':')) {
            var s = host.split(':')
            if (s.length == 2) {
              var port = parseInt(s[1])
              if (!isNaN(port)) {
                var httpsPort = port + 400
                host = s[0] + ':' + httpsPort
              }
            }
          }

          var url = document.location.protocol + '//' + host + '/' + data.datas.pusher.nsp
          var key = data.datas.viewer.key
          Pusher.options.pusherUrl = url
          Pusher.options.key = key
          DWLive.viewerid = data.datas.viewer.id
          DWLive.sessionId = data.datas.viewer.key
          DWLive.viewername = data.datas.viewer.name
          DWLive.isBan = data.datas.room.isBan//禁播
          DWLive.liveid = data.datas.liveId
          DWLive.upid = data.datas.upId
          DWLive.multiQuality = data.datas.room.multiQuality
          DWLive.documentDisplayMode = data.datas.room.documentDisplayMode
          DWLive.isBarrage = data.datas.room.barrage
          DWLive.liveCountdown = data.datas.room.liveCountdown
          DWLive.groupId = data.datas.viewer.groupId
          //初始化极速动画对象
          var drawPanel = document.getElementById("drawPanel");
          if (DWDpc.fastMode && drawPanel) {
            $('#documentDisplayMode').val(DWLive.documentDisplayMode)
            DWDpc.isDPReady = true;
            DWDpc.appendDrawPanel()
            DWDpc.init();
            window.on_hdLive_drawPanel_complete && window.on_hdLive_drawPanel_complete();
          }
          fn()
          var delay = data.datas.room.delayTime,
            foreignPublish = data.datas.room.foreignPublish
          LivePlayer.delay = delay
          if (delay <= 0) {
            DELAY_TIME = 5 * 1000
          }
          LivePlayer.foreignPublish = foreignPublish

          LivePlayer.openHostMode = data.datas.room.openHostMode
          LivePlayer.dvr = data.datas.room.dvr
          LivePlayer.barrageData = data.datas.room.barrage
          LivePlayer.warmVideoId = data.datas.room.encryptWarmVideoId
          LivePlayer.viewerid = data.datas.viewer.id

          var playerBackgroundImageUri = data.datas.room.playerBackgroundImageUri
          if (!playerBackgroundImageUri) {
            playerBackgroundImageUri = ''
          } else {
            var isHttps = window.location.protocol === 'https:'
            if (isHttps) {
              playerBackgroundImageUri = playerBackgroundImageUri.replace(/http:/g, 'https:')
            }
          }
          LivePlayer.backgroundImageUri = playerBackgroundImageUri

          if (typeof DWLive.playerBackgroundImageUri === 'function') {
            DWLive.playerBackgroundImageUri(playerBackgroundImageUri)
          }

          var playerBackgroundHint = data.datas.room.playerBackgroundHint
          if (!playerBackgroundHint) {
            playerBackgroundHint = ''
          }
          LivePlayer.backgroundHint = playerBackgroundHint

          if (typeof DWLive.playerBackgroundHint === 'function') {
            DWLive.playerBackgroundHint(playerBackgroundHint)
          }

          var announcement = data.datas.announcement
          if (typeof DWLive.onAnnouncementShow === 'function' && announcement) {
            DWLive.onAnnouncementShow(announcement)
          }

          var desc = data.datas.room.desc
          if (typeof DWLive.onLiveDesc === 'function') {
            DWLive.onLiveDesc(desc)
          }

          var count = data.datas.room.showUserCount
          if (typeof DWLive.showUserCount === 'function') {
            DWLive.showUserCount(count)
          }

          var marquee = data.datas.viewer.marquee
          if (typeof DWLive.getMarquee === 'function') {
            DWLive.getMarquee(marquee)
          }

          if (typeof DWLive.onLoginSuccess === 'function') {
            var template = {
              'desc': data.datas.template.desc,
              'type': data.datas.template.type,
              'name': data.datas.template.name,
              'id': data.datas.template.id
            }//返回给用户的模板信息
            var viewer = {
              'id': data.datas.viewer.id,
              'groupId': data.datas.viewer.groupId,
              'name': data.datas.viewer.name
            }//返回给用户的viewer信息;
            var live = data.datas.live//返回给用户的live信息
            var loginInfo = {'live': live, 'template': template, 'viewer': viewer}
            DWLive.onLoginSuccess(loginInfo)
          }

          var time = data.datas.live
          if (typeof DWLive.onLiveTime === 'function') {
            DWLive.onLiveTime(time)
          }

          Pusher.init()

          if (MobileLive.isMobile() == 'isMobile') {
            MobileLive.init()
          } else {
            LivePlayer.init()
          }

          switch (data.datas.template.type) {
            case 6:
              Qa.init()
              DWLive.sendPublicChatMsg = DWLive.sendPrivateChatMsg = function () {
                return false
              }
              break
            case 5:
              Chat.init()
              Qa.init()
              DrawPanel.init()
              break
            case 4:
              Chat.init()
              DrawPanel.init()
              DWLive.sendQuestionMsg = function () {
                return false
              }
              break
            case 3:
              Chat.init()
              DWLive.sendQuestionMsg = function () {
                return false
              }
              break
            case 2:
              Chat.init()
              Qa.init()
              break
            default:
              Chat.init()
              Qa.init()
              DrawPanel.init()
          }

        }
      })
    },

    logout: function (value) {
      if (!value) return
      $.ajax({
        url: '//view.csslcloud.net/api/live/logout',
        type: 'GET',
        dataType: 'jsonp',
        timeout: 5000,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (typeof value.success === 'function') {
            value.success(data)
          }
        },
        error: function (xhr, status, error) {
          if (typeof value.error === 'function') {
            value.error({'errorcode': '100', 'msg': '退出失败', 'info': error})
          }
        }
      })

      Pusher.socket.disconnect()
    },

    getScript: function (url, success) {

      var readyState = false,
        script = document.createElement('script')
      script.src = url

      script.onload = script.onreadystatechange = function () {
        if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
          readyState = true
          success && success()
        }
      }
      document.body.appendChild(script)

    },

    loadScript: function (res, callback) {

      if (typeof res === 'string') {
        var _res = res
        res = []
        res.push(_res)
      }
      var _this = this,
        queue = function (fs, cb) {
          _this.getScript(fs.shift(), function () {
            fs.length ? queue(fs, cb) : cb && cb()
          })
        }

      queue(res, callback)

    },

    //改名
    changeNickname: function (name) {
      if (!name || typeof name !== 'string' || name.length > 20) {
        return false
      }
      Pusher.socket.emit('change_nickname', name)
    },

    sendPublicChatMsg: function (msg) {
      if (!msg || msg.length > 300) {
        return
      }
      Pusher.socket.emit('chat_message', msg)
    },

    sendPrivateChatMsg: function (touserid, tousername, msg) {
      var h = new Date().getHours(),
        m = new Date().getMinutes(),
        s = new Date().getSeconds()
      m = m > 9 ? m : '0' + m
      s = s > 9 ? s : '0' + s
      var j = {
        'fromuserid': this.viewerid,
        'fromusername': this.viewername,
        'touserid': touserid,
        'tousername': tousername,
        'msg': $.trim(msg),
        'time': h + ':' + m + ':' + s
      }
      Pusher.socket.emit('private_chat', JSON.stringify(j))
    },

    sendQuestionMsg: function (content) {
      if (!content || content.length > 300) {
        return
      }

      var j = {
        'action': 'question',
        'value': {
          'userId': this.viewerid,
          'userName': this.viewername,
          'content': content
        }
      }

      try {
        Pusher.socket.emit('question', JSON.stringify(j))
      } catch (e) {
      }
    },

    barrage: function (msg, color) {
      // 移动H5暂不支持弹幕功能
      if (MobileLive.isMobile() == 'isMobile') {
        return
      }

      var newm = $.trim(msg)
      if (!newm) {
        return
      }
      newm = msg.replace(/\[em2?_([0-9]*)\]/g, '')

      LivePlayer.barrage({
        'txt': newm,
        'color': color == null ? 0xffffff : color
      })
    },

    getLine: function () {
      if (MobileLive.isMobile() == 'isMobile') {
        var l = MobileLive.src
        return l
      } else {
        return LivePlayer.getLine()
      }
    },

    changeLine: function (line) {
      if (MobileLive.isMobile() == 'isMobile') {
        MobileLive.changeLine(line)
      } else {
        LivePlayer.changeLine(line)
      }
    },

    onlyAudio: function () {
      if (MobileLive.isMobile() == 'isMobile') {
        MobileLive.onlyAudio()
      } else {
        LivePlayer.onlyAudio()
      }
    },
    changeVideoScale: function (t) {
      if (MobileLive.isMobile() != 'isMobile') {
        LivePlayer.changeVideoScale(t)
      }
    }
    ,
    setSound: function (n) {
      if (MobileLive.isMobile() == 'isMobile') {
        return
      }
      LivePlayer.setSound(n)
    },

    answerRollcall: function (rid, pid) {
      var j = {
        'rollcallId': rid,
        'userId': this.viewerid,
        'userName': this.viewername,
        'publisherId': pid
      }
      Pusher.socket.emit('answer_rollcall', JSON.stringify(j))
    },

    replyVote: function (voteid, option, pid) {
      var j = {
        'voteId': voteid,
        'voteOption': option,
        'publisherId': pid
      }
      Pusher.socket.emit('reply_vote', JSON.stringify(j))
    },
    docBarrage: function (msg, color) {
      if (!$.trim(msg)) {
        return
      }
      DrawPanel.barrage({
        'txt': msg,
        'color': color == null ? 0xffffff : color
      })
    },

    openBarrage: function (b) {
      LivePlayer.openBarrage(b)
    },
    openDocBarrage: function (l) {//开启doc弹幕功能
      if (MobileLive.isMobile() == 'isMobile') {
        return
      }
      if (DWDpc.fastMode) {
        DWDpc.openBarrage(l)
      }
    },
    insertDocBarrage: function (data) {//插入弹幕
      if (MobileLive.isMobile() == 'isMobile') {
        return
      }
      if (DWDpc.fastMode) {
        DWDpc.insertBarrage(data)
      }
    },
    closeDocBarrage: function () {//关闭弹幕功能
      if (MobileLive.isMobile() == 'isMobile') {
        return
      }
      if (DWDpc.fastMode) {
        DWDpc.closeBarrage()
      }
    },
    showControl: function (b) {
      LivePlayer.showControl(b)
    },

    livePlayerInit: function () {
      LivePlayer.init()
    },

    openSound: function () {
      LivePlayer.openSound()
    },

    closeSound: function () {
      LivePlayer.closeSound()
    },

    docAdapt: function (t) {
      if (DWDpc.fastMode) {
        DWDpc.docAdapt(t)
      } else {
        live.adapt = t
      }

    },

    // 请求语音互动
    requestInteraction: function (t) {
      if (window.isRequesting) {
        return
      }
      window.isRequesting = true
      var isIE = (navigator.appVersion.indexOf('MSIE') >= 0)
      if (isIE) {
        return
      }
      live.interaction.requestInteraction(t)
    },

    // 挂断双向视频
    hangupInteraction: function () {
      live.interaction.hangupInteraction()
    },

    // 进入互动房间
    enterInteractionRoom: function (callback) {
      var err = undefined
      try {
        Pusher.socket.emit('speak_enter')
      } catch (e) {
        err = e
      } finally {
        if (typeof callback === 'function') callback(err)
      }
    },

    // 发送互动信息
    sendInteractionMessage: function (p, toId, event, data, callback) {
      var type = 'audio'
      if (p.video) {
        type = 'audiovideo'
      }

      var j = {
        type: type,
        fromname: this.viewername,
        fromid: this.viewerid,
        fromrole: 'student',
        toid: toId,
        event: event,
        data: JSON.stringify(data)
      }

      var err = undefined
      try {
        Pusher.socket.emit('speak_message', JSON.stringify(j))
      } catch (e) {
        err = e
      } finally {
        if (typeof callback === 'function') callback(err)
      }
    },

    // 跑马灯
    showMarquee: function (m) {
      LivePlayer.showMarquee(m)
    },
    closeMarquee: function () {
      LivePlayer.closeMarquee()
    },
    showMarqueeDoc: function (m) {
      if (DWDpc.fastMode) {
        DWDpc.showMarquee(m)
      } else {
        DrawPanel.showMarquee(m)
      }
    },
    closeMarqueeDoc: function () {
      if (DWDpc.fastMode) {
        DWDpc.closeMarquee()
      }
    },
    setDocMode: function (t) {
      if (!DWDpc.fastMode) {
        return
      }
      DWDpc.setDocMode(t)
    },
    getDocs: function (callback) {
      if (!DWDpc.fastMode) {
        return
      }
      DWDpc.getDocs(callback)
    },
    changePageTo: function (dId, pI) {
      if (!DWDpc.fastMode) {
        return
      }
      DWDpc.changePageTo(dId, pI)
    },
    // 用户问卷功能提交接口（data -> {"subjectsAnswer":[{"subjectId":"D4D648931609E9B9","selectedOptionId":"306B84236FBD561E"},{"subjectId":"3FFFF7EC39BC96CC","selectedOptionIds":"C5E59BBB4FBD975C,BE571C8FC644B1E1"},{"subjectId":"3CFA9D81528D476B","answerContent":"asdasdasd"}],questionnaireId:'0EDEEC4D0321974B'};
    // callBack->回调返回所有数据）
    submitQuestionnaire: function (_data, callBack) {
      if (!_data) {
        return
      }
      var params = {
        questionnaireid: _data.questionnaireId,
        answers: JSON.stringify({subjectsAnswer: _data.subjectsAnswer})
      }
      $.ajax({
        url: '//eva.csslcloud.net/api/questionnaire/submit',
        type: 'GET',
        dataType: 'jsonp',
        timeout: 5000,
        data: params,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (callBack) {
            callBack(data)
          } else {
            if (console.log) {
              console.log('no callback')
            }
          }
        },
        error: function (xhr, status, error) {
          if (callBack) {
            callBack({
              errorCode: 1,
              msg: 'request was aborted', result: error
            })
          }
        }

      })

    },
    getPublishingQuestionnaire: function () {
      var path = '//eva.csslcloud.net/api/questionnaire/info'
      var info = {}
      Util.sendAjax(path, info, DWLive.onQuestionnairePublish)
    },
    //获取随堂测数据
    getPracticeInfo: function (pId, callBack) {
      var path = '//eva.csslcloud.net/api/practice/info'
      var info = {
        practiceId: pId,
        sessionId: Pusher.options.key
      }
      Util.sendAjax(path, info, callBack)
    },
    //提交随堂测
    submitPracticeInfo: function (pId, opt, callback) {
      var path = '//eva.csslcloud.net/api/practice/submit'
      var info = {
        practiceId: pId,
        options: opt,
        sessionId: Pusher.options.key
      }
      Util.sendAjax(path, info, callback)
    },
    //获取随堂测统计信息接口API
    getPracticeStatisInfo: function (pId, callback) {
      var path = '//eva.csslcloud.net/api/practice/statis'
      var info = {
        practiceId: pId,
        sessionId: Pusher.options.key
      }
      Util.sendAjax(path, info, callback)
    },
    //获取排名数据接口
    getPracticeRanking: function (pId, callback) {
      var path = '//eva.csslcloud.net/api/practice/ranking'
      // var path = "http://192.168.202.183:8080/api/practice/ranking";
      var info = {
        practiceId: pId,
        sessionId: Pusher.options.key
      }
      Util.sendAjax(path, info, callback)
    },
  }
  var options = {
    init: function () {
      this['userId'] = DWLive.userid,
        this['roomId'] = DWLive.roomid,
        this['groupId'] = DWLive.groupId,
        this['liveId'] = DWLive.liveid,
        this['viewerId'] = DWLive.viewerid,
        this['upId'] = DWLive.upid
    }
  }


  // Pusher
  var Pusher = {
    options: {
      pusherUrl: '',
      key: '',
      maxMessageCount: 300, // 保存聊天条数
      userId: '',
      roomId: '',
      livePlayerId: '',
      drawPanel: ''
    },
    drawjson: [],
    pagechangedata: [],
    publishStreamTimer: 0,
    endStreamTimer: 0,

    init: function () {

      var t = MobileLive.isMobile() == 'isMobile' ? 1 : 0

      if (!DWLive.forceNew) {
        this.socket = io.connect(this.options.pusherUrl, {
          query: {
            sessionid: Pusher.options.key,
            platform: 1,
            terminal: t
          }
        })
        debug('forceNew: false')
      } else {
        this.socket = io.connect(this.options.pusherUrl + '?sessionid=' + Pusher.options.key + '&platform=' + 1 + '&terminal=' + t, {forceNew: true})
        debug('forceNew: true')
      }

      this.bind()
    },

    bind: function () {
      var currentLayout = false

      this.socket.on('connect', function () {
        if (typeof window.onSocketConnect === 'function') {
          window.onSocketConnect()
        }
      })

      this.socket.on('disconnect', function () {
        if (typeof window.onSocketDisconnect === 'function') {
          window.onSocketDisconnect()
        }
        window.isRequesting = false
      })

      // 翻页回调
      this.socket.on('page_change', function (j) {
        if (j && typeof(j) === 'string') {
          Pusher.pagechangedata.push(JSON.parse(j))
        }
        if (typeof window.on_cc_live_dw_page_change === 'function') {
          window.on_cc_live_dw_page_change(j)
        }
        if (typeof DWLive.onPageChange === 'function') {
          var obj = JSON.parse(j)
          var data = {
            docId: obj.value.docid,
            docName: obj.value.fileName,
            docTotalPage: obj.value.totalPage,
            pageNum: obj.value.page
          }
          DWLive.onPageChange(data)
        }
      })


      // 改名
      this.socket.on('change_nickname', function (j) {
        DWLive.viewername = j
        if (typeof DWLive.onChangeNickname === 'function') {
          DWLive.onChangeNickname(j)
        }
      })

      // 动画翻页
      this.socket.on('animation_change', function (j) {
        if (typeof window.on_cc_live_dw_animation_change === 'function') {
          window.on_cc_live_dw_animation_change(j)
        }
      })

      // 画板回调
      this.socket.on('draw', function (j) {
        if (j && typeof(j) === 'string') {
          Pusher.drawjson.push(JSON.parse(j))
        }
        if (typeof window.on_cc_live_dw_draw === 'function') {
          window.on_cc_live_dw_draw(j)
        }
      })

      this.socket.on('room_user_count', function (j) {
        if (typeof DWLive.onUserCountMessage === 'function') {
          DWLive.onUserCountMessage(j)
        }
      })

      this.socket.on('publish_stream', function (j) {
        this.publishStreamTimer && clearTimeout(this.publishStreamTimer)
        this.publishStreamTimer = setTimeout(function () {
          if (LivePlayer) {
            LivePlayer.isPublishing = 1
          }
          if (LivePlayer && LivePlayer.start) {
            LivePlayer.start()
          }
          if (typeof DWLive.onLiveStart === 'function') {
            DWLive.onLiveStart(j)
          }
        }, getDelayTime())
      })

      this.socket.on('end_stream', function (j) {
        this.endStreamTimer && clearTimeout(this.endStreamTimer)
        this.endStreamTimer = setTimeout(function () {
          if (LivePlayer) {
            LivePlayer.isPublishing = 0
          }
          if (LivePlayer && LivePlayer.end) {
            LivePlayer.end()
          }
          if (DrawPanel && DrawPanel.clear) {
            DrawPanel.clear()
          }
          DWDpc.clear()
          if (typeof DWLive.onLiveEnd === 'function') {
            DWLive.onLiveEnd(j)
          }
        }, getDelayTime())
      })

      this.socket.on('kick_out', function (j) {
        Pusher.socket.disconnect()

        if (typeof DWLive.onKickOut === 'function') {
          DWLive.onKickOut(j)
        }
        if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {
          LivePlayer.getFlash()._kickOff()
        }
      })

      this.socket.on('announcement', function (data) {
        data = toJson(data)

        if (data.action == 'release') {
          if (typeof DWLive.onAnnouncementRelease === 'function') {
            DWLive.onAnnouncementRelease(data.announcement)
          }
        } else if (data.action == 'remove') {
          if (typeof DWLive.onAnnouncementRemove === 'function') {
            DWLive.onAnnouncementRemove(data)
          }
        }
      })

      // 签到功能
      this.socket.on('start_rollcall', function (data) {
        data = toJson(data)
        if (typeof DWLive.onStartRollCall === 'function') {
          DWLive.onStartRollCall(data)
        }
      })

      // 开始抽奖
      this.socket.on('start_lottery', function (data) {
        data = toJson(data)
        if (typeof DWLive.onStartLottery === 'function') {
          DWLive.onStartLottery(data)
        }
      })

      // 中奖
      this.socket.on('win_lottery', function (data) {
        data = toJson(data)
        if (typeof DWLive.onWinLottery === 'function') {
          DWLive.onWinLottery(data)
        }
      })

      // 结束抽奖
      this.socket.on('stop_lottery', function (data) {
        data = toJson(data)
        if (typeof DWLive.onStopLottery === 'function') {
          DWLive.onStopLottery(data)
        }
      })

      // 开始答题
      this.socket.on('start_vote', function (data) {
        data = toJson(data)
        if (typeof DWLive.onStartVote === 'function') {
          DWLive.onStartVote(data)
        }
      })

      // 结束答题
      this.socket.on('stop_vote', function (data) {
        data = toJson(data)
        if (typeof DWLive.onStopVote === 'function') {
          DWLive.onStopVote(data)
        }
      })

      // 答题结果
      this.socket.on('vote_result', function (data) {
        data = toJson(data)
        if (typeof DWLive.onVoteResult === 'function') {
          DWLive.onVoteResult(data)
        }
      })

      // 禁播
      this.socket.on('ban_stream', function (data) {
        data = toJson(data)
        //h5禁播
        DWLive.isBan = 1
        if (MobileLive.isMobile() == 'isMobile') {
          MobileLive.ban()

        } else {
          LivePlayer.banLive()
        }

        if (typeof DWLive.onBanStream === 'function') {
          DWLive.onBanStream(data)
        }
      })
      // 解禁
      this.socket.on('unban_stream', function (data) {
        data = toJson(data)
        //h5解禁
        DWLive.isBan = 0
        if (MobileLive.isMobile() == 'isMobile') {
          MobileLive.unban()
        } else {
          LivePlayer.unbanLive()
        }

        if (typeof DWLive.onUnBanStream === 'function') {
          DWLive.onUnBanStream(data)
        }
      })
      window.isSpeakThirdParty = false

      this.socket.on('room_setting', function (data) {
        data = toJson(data)
        if (typeof DWLive.onRoomSetting === 'function') {
          console.log('room_setting', data)

          window.allowSpeakThirdParty = data.allow_speak_third_party

          if (data.allow_speak_interaction == 'true') {
            window.isSpeakThirdParty = false
          }

          if (window.allowSpeakThirdParty.status == 'true') {
            window.isSpeakThirdParty = true
            data.allow_speak_interaction = 'true'
          }

          if(window.isSpeakThirdParty) {
            console.log('声网连麦', window.isSpeakThirdParty)
          } else {
            console.log('WebRTC连麦', window.isSpeakThirdParty)
          }

          DWLive.onRoomSetting(data)
        }
        if (data.layout_video_main != currentLayout) {
          var main = data.layout_video_main
          if (typeof DWLive.onSwitchVideoDoc === 'function') {
            DWLive.onSwitchVideoDoc(main)

          }
          currentLayout = main
        }
      })

      //禁言某人发送信息回调
      this.socket.on('silence_user_chat_message', function (data) {

        if (typeof DWLive.onSilenceUserChatMessage === 'function') {
          DWLive.onSilenceUserChatMessage(toJson(data))
        }
      })

      // 讲师接受互动信息
      this.socket.on('accept_speak', function (data) {
        if (typeof window.on_cc_live_accept_interaction === 'function') {
          window.on_cc_live_accept_interaction(toJson(data))
        }
      })

      // 互动信息
      this.socket.on('speak_message', function (data) {
        if (!window.isSpeakThirdParty && typeof window.on_cc_live_interaction_message === "function") {
          window.on_cc_live_interaction_message(toJson(data));
        }
      })

      // 已经在聊天的列表信息
      this.socket.on('speak_peer_list', function (data) {
        if (typeof window.on_cc_live_interaction_chatusers === 'function') {
          window.on_cc_live_interaction_chatusers(toJson(data))
        }
      })

      // 挂断互动信息
      this.socket.on('speak_disconnect', function (data) {
        if (typeof window.on_cc_live_interaction_disconnect_self === 'function') {
          window.on_cc_live_interaction_disconnect_self(toJson(data))
        }
      })

      this.socket.on("speak_disconnect_third_party", function (data) {
        if (typeof window.on_cc_live_interaction_disconnect_self === "function") {
          window.on_cc_live_interaction_disconnect_self(toJson(data));
        }
      })

      // 广播信息
      this.socket.on('broadcast_msg', function (data) {
        if (typeof DWLive.onBroadcastMsg === 'function') {
          DWLive.onBroadcastMsg(toJson(data).value)
        }
      })

      // 发布提问
      this.socket.on('publish_question', function (data) {
        if (typeof DWLive.onQaPublish === 'function') {
          DWLive.onQaPublish(toJson(data))
        }
      })

      /**
       * 发布问卷
       * */
      this.socket.on('questionnaire_publish', function (data) {
        data = toJson(data)

        if (typeof DWLive.onQuestionnairePublish === 'function') {
          DWLive.onQuestionnairePublish(data)
        }
      })

      /**
       * 结束发布问卷
       * */
      this.socket.on('questionnaire_publish_stop', function (data) {
        data = toJson(data)

        if (typeof DWLive.onQuestionnairePublishStop === 'function') {
          DWLive.onQuestionnairePublishStop(data)
        }
      })
      //发布随堂测功能
      this.socket.on('practice_publish', function (data) {
        data = toJson(data)
        if (typeof  DWLive.onPracticePublish === 'function') {
          DWLive.onPracticePublish(data)
        }
      })
      //停止发布随堂测功能
      this.socket.on('practice_stop', function (data) {
        data = toJson(data)
        if (typeof  DWLive.onPracticePublishStop === 'function') {
          DWLive.onPracticePublishStop(data)
        }
      })
      //关闭随堂测功能
      this.socket.on('practice_close', function (data) {
        data = toJson(data)
        if (typeof DWLive.onPracticeClose === 'function') {
          DWLive.onPracticeClose(data)
        }
      })
      // 发布奖杯
      this.socket.on('prize_send', function (data) {
        data = toJson(data)
        if (typeof DWLive.onPrizeSend === 'function') {
          DWLive.onPrizeSend(data)
        }
      })


      /**
       * 发布问卷统计
       * */
      this.socket.on('questionnaire_publish_statis', function (data) {
        data = toJson(data)

        if (typeof DWLive.onQuestionnairePublishStatis === 'function') {
          DWLive.onQuestionnairePublishStatis(data)
        }
      })

      this.socket.on('room_teachers', function (data) {

        if (typeof DWLive.onOnlineTeachers === 'function') {
          DWLive.onOnlineTeachers(toJson(data))
        }
      })

      this.socket.on('external_questionnaire_publish', function (data) {
        if (typeof DWLive.onExternalQuestionnairePublish === 'function') {
          DWLive.onExternalQuestionnairePublish(toJson(data))
        }
      })

      this.socket.on('ban_chat', function (data) {
        if (typeof DWLive.onBanChat === 'function') {
          DWLive.onBanChat(toJson(data))
        }
      })

      this.socket.on('unban_chat', function (data) {
        if (typeof DWLive.onUnBanChat === 'function') {
          DWLive.onUnBanChat(toJson(data))
        }
      })
      /**
       * 获取当前播放（数据源）场景（0：无意义(默认)，10、11:（开启/关闭）摄像头，20：图片，30：插播视频，40：区域捕获，50：桌面共享，60：自定义场景）
       * **/
      this.socket.on('switch_source', function (data) {
        if (typeof DWLive.onSwitchSource === 'function') {
          DWLive.onSwitchSource(data)
        }
      })

      var _this = this
      setTimeout(function () {
        try {
          _this.socket.emit('room_user_count')
        } catch (e) {
        }
        try {
          _this.socket.emit('room_teachers')
        } catch (e) {
        }
      }, 1500)
      setInterval(function () {
        try {
          _this.socket.emit('room_user_count')
        } catch (e) {
        }
        try {
          _this.socket.emit('room_teachers')
        } catch (e) {
        }
      }, 15000)
    },

    // 请求互动
    requestInteraction: function (p, callback) {

      var t = 'audio'

      if (p.video) {
        t += 'video'
      }

      var j = {
        'viewerId': DWLive.viewerid,
        'viewerName': DWLive.viewername,
        'type': t
      }

      var err = undefined
      try {
        this.socket.emit('request_speak', JSON.stringify(j))
      } catch (e) {
        err = e
      } finally {
        if (typeof callback === 'function') callback(err)
      }
    },

    // 取消申请
    cancelRequestInteraction: function (type, callback) {
      var j = {
        'viewerId': DWLive.viewerid,
        'viewerName': DWLive.viewername,
        'type': window.live.interaction.local.type
      }

      debug('interaction', '取消申请：' + JSON.stringify(j))

      var err = undefined
      try {
        this.socket.emit('cancel_request_speak', JSON.stringify(j))
      } catch (e) {
        err = e
      } finally {
        if (typeof callback === 'function') callback(err)
      }
    },

    //挂断互动
    hangupInteraction: function (type, callback) {
      var j = {
        'viewerId': DWLive.viewerid,
        'viewerName': DWLive.viewername,
        'type': type
      }

      debug('interaction', '挂断事件：' + JSON.stringify(j))

      var err = undefined
      try {
        if (window.isSpeakThirdParty) {
          this.socket.emit("hangup_interaction_third_party", JSON.stringify(j));
        } else {
          this.socket.emit("hangup_interaction", JSON.stringify(j));
        }
      } catch (e) {
        err = e
      } finally {
        if (typeof callback === 'function') callback(err)
      }
    }
  }

  /**
   * 语音互动支持
   *
   * */
  var Interaction = function (opts) {
    try {
      window.PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)
      window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL)
      window.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
      window.nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate)
      window.nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription)
    } catch (e) {
    }

    this.usersPcs = {
      length: 0
    }

    // 本地流信息
    this.local = {
      type: {
        video: false,
        audio: false
      },
      video: {},
      audio: {}
    }

    this.isRequesting = false

    this.client = null
    this.localStream = null

    //声网连麦
    this.initAgoraRTC = function (params) {
      if (!AgoraRTC.checkSystemRequirements()) {
        AgoraRTC.Logger.error('Your browser does not support WebRTC!')
      }
      if (AgoraRTC) {
        AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
      }
      if (!window.atob) {
        return
      }

      var self = this
      var accountId = DWLive.userid
      var roomId = DWLive.roomid
      var sessionId = DWLive.sessionId
      var channelId = params.channelId
      var appId = window.atob(this.hex2str(params.appId))
      var viewToken = params.viewToken
      var videoSize = params.videosize
      var uid = 0
      var type = this.local.type

      var options = {
        agora: {
          appId: appId,
          viewToken: viewToken,
          channelId: channelId,
          type: type,
          ui: uid,
          videoSize: videoSize
        },
        tokens: {
          accountId: accountId,
          roomId: roomId,
          sessionId: sessionId,
          channelId: channelId,
          ui: uid
        }
      }

      self.joinAgoraRTC(options)
    }

    this.hex2str = function(hex) {
      var trimedStr = hex.trim();
      var rawStr = trimedStr.substr(0,2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
      var len = rawStr.length;
      if(len % 2 !== 0) {
        alert("Illegal Format ASCII Code!");
        return "";
      }
      var curCharCode;
      var resultStr = [];
      for(var i = 0; i < len;i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16);
        resultStr.push(String.fromCharCode(curCharCode));
      }
      return resultStr.join("");
    }

    this.joinAgoraRTC = function (options) {
      if (!AgoraRTC.checkSystemRequirements()) {
        AgoraRTC.Logger.error('Your browser does not support WebRTC!')
      }
      var self = this
      AgoraRTC.Logger.enableLogUpload();
      self.client = AgoraRTC.createClient({mode: 'live', codec: 'h264'})
      self.client.init(options.agora.appId, function () {
        self.client.join(options.agora.viewToken, options.agora.channelId, options.agora.uid, function (uid) {
          self.localStream = AgoraRTC.createStream({
            streamID: uid,
            video: options.agora.type.video,
            audio: options.agora.type.audio,
            cameraId: self.cameraId,
            microphoneId: self.microphoneId,
            screen: false
          })
          var videoSize = (options.agora.videoSize).split('x')
          self.localStream.setVideoEncoderConfiguration({
            // 视频分辨率
            resolution: {
              width: parseInt(videoSize[0]),
              height: parseInt(videoSize[1])
            }
          })

          self.localStream.on('accessAllowed', function () {
          })

          self.localStream.on('accessDenied', function () {
          })

          self.localStream.on('player-status-change', function (data) {
            if (data.mediaType == 'video' && data.status == 'aborted') {
              self.localStream.close()
            }
          })

          self.localStream.init(function () {
            if (!$('#agora_local').length) {
              $('#interactionLocalVideo').after('<div id="agora_local"></div>')
            }

            self.localStream.play('agora_local')

            self.client.publish(self.localStream, function (err) {
            })

            self.client.on('stream-published', function (evt) {
            })
          }, function (err) {
          })

        }, function (err) {
        })

      }, function (err) {
      })
      self.client.on('stream-added', function (evt) {
        var stream = evt.stream

        self.client.subscribe(stream, function (err) {
        })
      })
      self.client.on('stream-subscribed', function (evt) {
        var remoteStream = evt.stream
        $('#videoInteractions').append('<div id="interactionRemoteVideo' + remoteStream.getId() + '" style="height: 100%; width: 100%;" autoplay></div>')

        remoteStream.play('interactionRemoteVideo' + remoteStream.getId(), {fit: 'contain'})
      })
      self.client.on('first-video-frame-decode', function (evt) {
        if (typeof window.on_cc_live_interaction_remote_media === 'function') {
          window.on_cc_live_interaction_remote_media(self.local.type)
        }
        $('#agora_local').hide()
        $('#livePlayer').replaceWith('<div id="livePlayer"></div>')
        window.isRequesting = false
      })
    }

    this.leaveAgoraRTC = function () {
      var self = this
      if (!self.client) {
        return
      }
      DWLive.livePlayerInit()
      self.localStream && self.localStream.close()
      if (!self.client) {
        return
      }
      self.client.leave(function () {
        $("#videoInteractions").empty();
        $("#audioInteractions").empty();
        $("#interactionLocalVideo")[0].src = "";
        $('#agora_local').html('');
      }, function (err) {
      });
      window.isRequesting = false
    }

    this.cameraId = ''
    this.microphoneId = ''

    this.getDevices = function () {
      var self = this
      AgoraRTC.getDevices(function (devices) {
        for (var i = 0; i !== devices.length; ++i) {
          var device = devices[i]
          if (device.kind === 'audioinput' && !self.microphoneId) {
            self.microphoneId = device.deviceId
          }
          if (device.kind === 'videoinput' && !self.cameraId) {
            self.cameraId = device.deviceId
          }
        }
      })
    }

    /**
     * 请求语音互动
     *
     * t = {
         *  video: true,
         *  audio: true
         * }
     * */
    this.requestInteraction = function (t, callback) {
      debug('Interaction', '请求互动')
      window.isSpeakThirdParty && this.getDevices()

      this.local.type = t

      this.isRequesting = true

      // 请求互动超时计时器
      this.setRequestTimeoutTimer()

      // 创建音视频信息
      this.createLocalMedia(function (error) {
        if (error) {
          if (typeof window.on_cc_live_interaction_error === 'function') {
            window.on_cc_live_interaction_error(live.interaction.local.type, error, '创建音视频信息出错')
          }
          return
        }

        Pusher.requestInteraction(t, callback)
      })
    }


    // 语音通话计时器
    this.setCallingTimer = function () {
      live.interaction.interactionTime = 0
      live.interaction.interactionTimeInterval = setInterval(function () {
        ++live.interaction.interactionTime
        if (typeof window.on_cc_live_interaction_interval === 'function') {
          var type = live.interaction.local.type
          var time = live.interaction.interactionTime
          window.on_cc_live_interaction_interval(type, time)
        }
      }, 1000)
    }
    // 清除语音通话计时器
    this.clearCallingTimer = function () {
      live.interaction.interactionTime = 0
      clearInterval(live.interaction.interactionTimeInterval)
    }

    // 互动请求超时定时器
    this.setRequestTimeoutTimer = function () {
      /**
       * 请求互动，60s内没有接受，则自动断开
       *
       * 通知pusher断开
       * */
      live.interaction.REQUEST_INTERACTION_TIMEOUT = setTimeout(function () {
        live.interaction.REQUEST_INTERACTION_TIMEOUT = -1

        // 超时挂断语音通话
        live.interaction.hangupInteraction(DWLive.viewerid)
        live.interaction.stopLocalStream()

        live.interaction.isRequesting = false

        if ($('#interactionLocalVideo')[0]) {
          $('#interactionLocalVideo')[0].src = ''
        }

        if (typeof window.on_cc_live_interaction_request_timeout === 'function') {
          window.on_cc_live_interaction_request_timeout(live.interaction.local.type)
        }
      }, 60000)
      window.isRequesting = false
    }
    // 清空互动请求超时定时器
    this.clearRequestTimeoutTimer = function () {
      if (live.interaction.REQUEST_INTERACTION_TIMEOUT > 0) {
        clearTimeout(live.interaction.REQUEST_INTERACTION_TIMEOUT)
        live.interaction.REQUEST_INTERACTION_TIMEOUT = -1
      }
    }

    // 停止本地流
    this.stopLocalStream = function () {
      if (live.interaction.local.video.stream) {
        try {
          live.interaction.local.video.stream.getTracks().forEach(function (track) {
            track.stop()
          })
        } catch (e) {
        }
      }

      if (live.interaction.local.audio.stream) {
        try {
          live.interaction.local.audio.stream.getTracks().forEach(function (track) {
            track.stop()
          })
        } catch (e) {
        }
      }
    }

    this.cancelInteraction = function () {
      live.interaction.isRequesting = false

      if (typeof window.on_cc_live_interaction_cancal === 'function') {
        window.on_cc_live_interaction_cancal(live.interaction.local.type)
      }
    }

    // 断开连接
    this.disconnectInteraction = function (uId) {
      DWLive.openSound()

      this.clearRequestTimeoutTimer()

      // 删除所有
      if (uId == DWLive.viewerid) {
        $.each(live.interaction.usersPcs, function (userId, up) {
          var pc = up.pc
          if (pc == null) {
            return true
          }

          pc.close()
          pc = null

          if (live.interaction.usersPcs[userId]) {
            delete live.interaction.usersPcs[userId]
            var l = live.interaction.usersPcs.length - 1
            live.interaction.usersPcs.length = l < 0 ? 0 : l
          }

        })
      } else {
        $.each(live.interaction.usersPcs, function (userId, up) {
          var pc = up.pc
          if (!pc) {
            return true
          }

          if (userId != uId) {
            return true
          }

          pc.close()
          pc = null

          if (live.interaction.usersPcs[userId]) {
            delete live.interaction.usersPcs[userId]
            var l = live.interaction.usersPcs.length - 1
            live.interaction.usersPcs.length = l < 0 ? 0 : l
          }
        })
      }

      if (live.interaction.usersPcs.length == 0) {
        this.stopLocalStream()
      }

      live.interaction.isInteractioning = false
      live.interaction.isRequesting = false
    }

    // 创建本地音视频流
    this.createLocalAudioAndVideoMedia = function (c) {
      var that = this
      getUserMedia.call(navigator, {
        video: true,
        audio: true
      }, function (stream) {
        that.local.video.stream = stream

        if (c && typeof c === 'function') {
          c(stream)
        }
      }, function (error) {
        debug('Interaction', 'getUserMedia error: ' + error)

        if (c && typeof c === 'function') {
          c(error)
        }
      })
    }

    // 创建本地音频流
    this.createLocalAudioMedia = function (c) {
      var that = this
      getUserMedia.call(navigator, {
        video: false,
        audio: true
      }, function (stream) {
        that.local.audio.stream = stream

        if (c && typeof c === 'function') {
          c(stream)
        }
      }, function (error) {
        debug('Interaction', 'getUserMedia error: ' + error)

        if (c && typeof c === 'function') {
          c(error)
        }
      })
    }

    this.createLocalMedia = function (c) {
      var that = this
      var type = that.local.type
      getUserMedia.call(navigator, type, function (stream) {
        if (type.video) {
          that.local.video.stream = stream
        } else {
          that.local.audio.stream = stream
        }

        var localVideo = $('#interactionLocalVideo')[0];
        if (localVideo) {
          localVideo.srcObject = stream;
          localVideo.volume = 0; // 静音
        }

        if (typeof window.on_cc_live_interaction_local_media === 'function') {
          window.on_cc_live_interaction_local_media(type, stream)
        }

        if (c && typeof c === 'function') {
          c()
        }
      }, function (error) {
        debug('Interaction', 'getUserMedia error: ' + error)

        if (c && typeof c === 'function') {
          c(error)
        }
      })
    }

    this.iceServers = {
      'iceServers': [{
        url: 'stun:turn.csslcloud.net:3478',
        credential: 'bokecc',
        username: 'cc'
      }, {
        url: 'turn:turn.csslcloud.net:3478',
        credential: 'bokecc',
        username: 'cc'
      }]
    }

    // 创建被动创建连接的PC
    this.createAnswerPeerConnection = function (chatuser) {
      var pc = new PeerConnection(this.iceServers)

      if (chatuser.type == 'audio') {
        if (!live.interaction.local.audio.stream) {
          this.createLocalAudioMedia()
        }
        pc.addStream(live.interaction.local.audio.stream)
      } else {
        if (!live.interaction.local.video.stream) {
          this.createLocalAudioAndVideoMedia()
        }
        pc.addStream(live.interaction.local.video.stream)
      }

      // 如果检测到媒体流连接到本地，将其绑定到一个audio标签上输出
      pc.onaddstream = function (event) {
        if (typeof window.on_cc_live_interaction_remote_media_self === 'function') {
          window.on_cc_live_interaction_remote_media_self(live.interaction.local.type, chatuser, event.stream)
        }
      }

      pc.createAnswer(function (desc) {
        pc.setLocalDescription(desc)
        DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, 'answer', desc)
      }, function (error) {
        debug('Interaction', 'Failure callback: ' + error)
      })

      pc.onicecandidate = function (event) {
        if (event.candidate !== null) {
          DWLive.sendInteractionMessage(live.interaction.local.type, chatuser.id, '', event.candidate)
        }
      }

      live.interaction.usersPcs[chatuser.id] = {
        pc: pc,
        user: chatuser
      }

      live.interaction.usersPcs.length += 1
    }

    // 创建主动创建连接的PC
    this.createOfferPeerConnection = function (chatuser) {
      var pc = new PeerConnection(this.iceServers)

      var p = live.interaction.local.type
      if (p.video) {
        pc.addStream(live.interaction.local.video.stream)
      } else {
        pc.addStream(live.interaction.local.audio.stream)
      }

      // 如果检测到媒体流连接到本地，将其绑定到一个audio标签上输出
      pc.onaddstream = function (event) {
        if (typeof window.on_cc_live_interaction_remote_media_self === 'function') {
          window.on_cc_live_interaction_remote_media_self(live.interaction.local.type, chatuser, event.stream)
        }
      }

      pc.oniceconnectionstatechange = function (d) {
        debug('Interaction', 'iceConnectionState ...' + pc.iceConnectionState)

        if (pc.iceConnectionState == 'failed') {
          debug('Interaction', 'iceConnectionState failed')

          live.interaction.hangupInteraction()

          if (typeof window.on_cc_live_interaction_disconnect_self === 'function') {
            window.on_cc_live_interaction_disconnect_self({
              disconnectid: DWLive.viewerid
            })
          }
        }
      }

      pc.createOffer(function (desc) {
        pc.setLocalDescription(desc)

        DWLive.sendInteractionMessage(p, chatuser.id, 'offer', desc)
      }, function (error) {
        if (typeof window.on_cc_live_interaction_error === 'function') {
          window.on_cc_live_interaction_error(live.interaction.local.type, error, 'createOfferPeerConnection')
        }
      })

      pc.onicecandidate = function (event) {
        if (event.candidate !== null) {
          DWLive.sendInteractionMessage(p, chatuser.id, '', event.candidate)
        }
      }

      live.interaction.usersPcs[chatuser.id] = {
        pc: pc,
        user: chatuser
      }

      live.interaction.usersPcs.length += 1
    }

    this.id = opts.interaction.id

    // 当前浏览器是否支持互动功能
    this.isSupportInteraction = function () {
      if (window.isSpeakThirdParty) {
        if (!AgoraRTC.checkSystemRequirements()) {
          AgoraRTC.Logger.error('Your browser does not support WebRTC!')
          return false
        } else {
          return true
        }
      } else {
        return window.location.protocol === 'https:' && !!(PeerConnection && URL && getUserMedia && nativeRTCIceCandidate && nativeRTCSessionDescription)
      }
    }

    // 挂断互动
    this.hangupInteraction = function (callback) {
      if (this.isInteractioning) {
        Pusher.hangupInteraction(this.type, callback)
      } else if (this.isRequesting) {
        Pusher.cancelRequestInteraction(this.type, callback)
        this.stopLocalStream()
        this.cancelInteraction()
      } else {
        this.stopLocalStream()
        this.cancelInteraction()
      }
    }
  }

  // LivePlayer
  var LivePlayer = {
    id: 'livePlayer',

    swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

    isReady: false,

    isPublishing: 0,

    delay: '',

    foreignPublish: '',

    init: function () {
      var flashvars = {
        'userid': DWLive.userid,
        'roomid': DWLive.roomid,
        'foreignPublish': this.foreignPublish,
        'warmvideoid': this.warmVideoId,
        'openhostmode': this.openHostMode, // 多主讲
        'dvr': this.dvr,
        'barrage': this.barrageData,
        'backgroundImageUri': this.backgroundImageUri,
        'backgroundHint': this.backgroundHint,
        'countDownTime': DWLive.liveCountdown,
        'openMultiQuality': DWLive.multiQuality,
        'language': DWLive.language || '',
        'type': 'liveplayer',
        'upid': DWLive.upid,
        'viewerid': this.viewerid,
        'ua': 1
      }

      var buffer = this.delay
      if (buffer > 0) {
        flashvars.buffer = buffer
      }

      var params = {
        allowFullscreen: 'true',
        allowScriptAccess: 'always',
        wmode: 'transparent'
      }

      swfobject.embedSWF(this.swfUrl, this.id, '100%', '100%', '10.0.0',
        '/flash/expressInstall.swf', flashvars, params)

    },

    getFlash: function () {
      return swfobject.getObjectById(this.id)
    },

    getPlayerTime: function () {
      var t = parseInt(this.getFlash()._time?this.getFlash()._time():0)
      if (isNaN(t) || t < 0) {
        return 0
      }
      return t
    },

    start: function () {
      if (MobileLive.isMobile() == 'isMobile') {
        //禁播
        if (DWLive.isBan) {
          $('#livePlayer').css({
            'text-align': 'center',
            'color': 'white',
            'font-size': '18px',
            'line-height': '232px'
          })
          $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>')
          return
        }

        // setTimeout(function () {
        MobileLive.init()
        // }, DELAY_TIME)
      } else {
        if (!this.getFlash()) {
          return
        }
        this.isPublishing = 1
        this.getFlash()._streamStart()
      }
    },

    end: function () {
      if (MobileLive.isMobile() == 'isMobile') {
        // setTimeout(function () {
        MobileLive.end()
        // }, DELAY_TIME)
      } else {

        if (!this.getFlash()) {
          return
        }
        this.isPublishing = 0
        this.getFlash()._streamEnd&&this.getFlash()._streamEnd()
      }
    },

    // 弹幕
    barrage: function (m) {
      if (!m) {
        return
      }

      if (!this.getFlash()) {
        return
      }

      if (this.getFlash()._jsTOASbarrage) {
        this.getFlash()._jsTOASbarrage(m)
      }
    },

    getLine: function () {
      var lines = this.getFlash().getLine?this.getFlash().getLine():0;
      if (lines) {
        lines = JSON.parse(lines)
      }
      return lines
    },

    changeLine: function (line) {
      this.getFlash().changeLine&&this.getFlash().changeLine(line)
    },
    changeVideoScale: function (t) {
      this.getFlash()._showScreenScale&&this.getFlash()._showScreenScale(t)
    },
    onlyAudio: function () {
      this.getFlash()._onlyAudio&&this.getFlash()._onlyAudio()
    },

    setSound: function (n) {
      this.getFlash()._SetSound&&this.getFlash()._SetSound(n)
    },

    // 打开声音
    openSound: function () {
      if (!this.getFlash()) {
        return
      }

      this.getFlash&&this.getFlash()._onSound()
    },

    // 关闭声音
    closeSound: function () {
      if (!this.getFlash()) {
        return
      }

      this.getFlash&&this.getFlash()._unSound()
    },

    // 开启关闭弹幕
    openBarrage: function (b) {
      if (!this.getFlash()) {
        return
      }

      this.getFlash()._barrage&&this.getFlash()._barrage(b)
    },

    showControl: function (b) {
      if (!this.getFlash()) {
        return
      }
      this.getFlash()._ShowControl&&this.getFlash()._ShowControl(b)
    },

    //封禁
    banLive: function () {
      if (!this.getFlash()) {
        return
      }
      this.getFlash()._banLive&&this.getFlash()._banLive()
    },

    //解禁
    unbanLive: function () {
      if (!this.getFlash()) {
        return
      }
      this.getFlash()._unbanLive&&this.getFlash()._unbanLive()
    },

    // 显示跑马灯功能
    showMarquee: function (marquee) {
      if (!marquee) {
        return
      }

      if (!this.getFlash()) {
        return
      }

      this.getFlash()._showMarqueePlugin&&this.getFlash()._showMarqueePlugin(marquee)
    },
    closeMarquee: function () {
      if (!this.getFlash()) {
        return
      }
      this.getFlash()._closeMarqueePlugin&&this.getFlash()._closeMarqueePlugin({name: 'PluginForMarquee'})
    }
  }

  // window.LivePlayer = LivePlayer;

  window._onStart = function () {
//		直播播放器准备开始播放
    LivePlayer.isReady = true
  }

  function initDrawPanelInfo() {
    if (!isHistoryReady) {
      setTimeout(function () {
        initDrawPanelInfo()
      }, 3000)
      return
    }

    if (DWDpc.fastMode) {
      return
    }

    if (draws.length) {
      DrawPanel.draws(draws)
      draws = []
    }

    // 显示最后一张图片
    if (pageChanges.length) {
      var ppc = pageChanges.pop()
      if (!ppc) {
        return
      }

      DrawPanel.filp(ppc)
      if (animations.length) {
        var animation = animations.pop()

        var animationJ = toJson(animation)
        var ppcJ = toJson(ppc)

        if (ppcJ.docid == animationJ.docid && ppcJ.time <= animationJ.time) {
          DrawPanel.animationFilp(animation)
        }
      }

      pageChanges = []
    }
  }


  // DrawPanel
  var DrawPanel = {
    id: 'drawPanel',

    isReady: false,

    isProcessing: false,

    getWidth: function () {
      return '100%'
    },

    getHeight: function () {
      return '100%'
    },

    swfUrl: '//zeus.csslcloud.net/flash/Player.swf',

    init: function () {
      var flashvars = {
        'type': 'drawpanel'
      }
      var params = {
        allowFullscreen: 'true',
        allowScriptAccess: 'always',
        wmode: 'transparent'
      }
      var attributes = {}

      if (!MobileLive.isIPad() && !MobileLive.isIPhone() && !MobileLive.isAndroid() && !MobileLive.isWindowsPhone()) {
        //开启极速动画模式
        if (!DWDpc.fastMode) {
          swfobject.embedSWF(this.swfUrl, this.id, this.getWidth(), this.getHeight(), '10.0.0', '/flash/expressInstall.swf', flashvars, params, attributes)
        }

      }
    },

    getSwf: function () {
      if (!this.isReady) {
        return
      }

      return swfobject.getObjectById(this.id)
    },

    clear: function () {
      var swf = this.getSwf()
      if (!swf) {
        return
      }
      swf._streamEnd()

      Pusher.pagechangedata = []
      Pusher.drawjson = []
    },

    // 画图
    draw: function (j) {
      var swf = this.getSwf()
      if (!swf) {
        return
      }
      swf.draw(j)
    },

    draws: function (js) {
      var swf = this.getSwf()
      if (!swf) {
        return
      }

      (function (jstr) {
        setTimeout(function () {
          swf.drawList(jstr)
        })
      })(js)
    },

    // 翻页
    filp: function (j) {
      var swf = this.getSwf()
      if (!swf) {
        return
      }

      var documentDisplayMode = DWLive.documentDisplayMode
      if (documentDisplayMode == 1) {
        this.displayMode = 'auto'
      } else if (documentDisplayMode == 2) {
        this.displayMode = 'width'
      } else {
        this.displayMode = 'auto'
      }

      if (live.adapt !== undefined) {
        this.displayMode = live.adapt ? 'auto' : 'width'
      }

      var jj = JSON.parse(j)
      var u = jj.url
      var isHttps = window.location.protocol === 'https:'
      if (isHttps) {
        jj.url = u.replace(/http:/g, 'https:')
      }

      swf.filp(JSON.stringify(jj), this.displayMode)

    },

    // 动画
    animationFilp: function (j) {
      var swf = this.getSwf()
      if (!swf) {
        return
      }

      swf.animation(j)
    },


    // 弹幕
    barrage: function (m) {
      if (!m) {
        return
      }

      if (!this.getSwf()) {
        return
      }

      if (this.getSwf()._jsTOASbarrage) {
        this.getSwf()._jsTOASbarrage(m)
      }
    },

    // 显示跑马灯功能
    showMarquee: function (marquee) {
      if (!marquee) {
        return
      }

      if (!this.getSwf()) {
        return
      }

      this.getSwf().showMarqueeLight(marquee)
    }
  }


  var draws = []
  var pageChanges = []
  var animations = []
  var isHistoryReady = false

  // 历史数据
  var History = function () {
    $.ajax({
      url: '//view.csslcloud.net/api/view/info?userid=' + DWLive.userid + '&roomid=' + DWLive.roomid,
      type: 'GET',
      dataType: 'jsonp',
      success: function (data) {
        if (!data.success) {
          return
        }

        if (!data.datas) {
          return
        }
        var datas = data.datas

        var meta = datas.meta
        if (!meta) {
          return
        }

        LivePlayer.isPublishing = meta.isPublishing

        // 没有推流
        if (meta.isPublishing != 1) {
          return
        }

        var answers = meta.answer ? meta.answer : []
        var questions = meta.question ? meta.question : []
        var broadcasts = meta.broadcast ? meta.broadcast : []
        for (var i = 0; i < answers.length; i++) {
          var answer = answers[i]
          for (var ii = 0; ii < questions.length; ii++) {
            var question = questions[ii]
            if (question.encryptId == answer.encryptId) {
              answer.questionUserId = question.questionUserId
            }
          }
        }

        if (questions && questions.length) {
          for (var i = 0; i < questions.length; i++) {
            var question = questions[i]
            if (typeof DWLive.onQuestion === 'function') {
              DWLive.onQuestion(JSON.stringify({
                'action': 'question',
                'value': {
                  'id': question.encryptId,
                  'content': question.content,
                  'userId': question.questionUserId,
                  'groupId': question.groupId,
                  'userName': question.questionUserName,
                  'isPublish': question.isPublish,
                  'triggerTime': question.triggerTime,
                  'userAvatar': question.userAvatar
                }
              }))
            }
          }
        }

        if (answers && answers.length) {
          for (var i = 0; i < answers.length; i++) {
            var answer = answers[i]
            if (typeof DWLive.onAnswer === 'function') {
              DWLive.onAnswer(JSON.stringify({
                'action': 'answer',
                'value': {
                  'questionId': answer.encryptId,
                  'isPrivate': answer.isPrivate,
                  'content': answer.content,
                  'userId': answer.answerUserId,
                  'groupId': answer.groupId,
                  'userName': answer.answerUserName,
                  'questionUserId': answer.questionUserId,
                  'triggerTime': answer.triggerTime,
                  'userAvatar': answer.userAvatar
                }
              }))
            }
          }
        }

        if (broadcasts && broadcasts.length) {
          for (var i = 0; i < broadcasts.length; i++) {
            var broadcast = broadcasts[i]
            if (typeof DWLive.onBroadcastMsg == 'function') {
              DWLive.onBroadcastMsg({
                content: broadcast.content,
                time: broadcast.time
              })
            }
          }
        }

        if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
          $.DrawingBoard.history(meta)
        }

        //极速动画获取历史信息
        DWDpc.history(meta)

        var chatLogs = meta.chatLog
        if (chatLogs && chatLogs.length) {
          var cls = []
          for (var i = 0; i < chatLogs.length; i++) {
            var chatLog = chatLogs[i]


            cls.push({
              'userid': chatLog.userId,
              'username': chatLog.userName,
              'userrole': chatLog.userRole,
              'useravatar': chatLog.userAvatar,
              'groupId': chatLog.groupId,
              'msg': chatLog.content,
              'time': chatLog.time,
              'chatId': chatLog.chatId,
              'status': chatLog.status,
              'usercustommark': chatLog.userCustomMark
            })
          }

          if (typeof DWLive.onPublicChatMessage === 'function') {
            for (var idx = 0; idx < cls.length; idx++) {
              DWLive.onPublicChatMessage(JSON.stringify(cls[idx]))
            }
          }
        }

        if (!DWDpc.fastMode) {
          var pageChange = meta.pageChange
          if (pageChange && pageChange.length) {
            pageChange.sort(function (p1, p2) {
              return parseInt(p1.time) - parseInt(p2.time)
            })
            var lastPage = pageChange.pop()
            pageChanges.push(JSON.stringify({
              'fileName': lastPage.docName,
              'totalPage': lastPage.docTotalPage,
              'docid': lastPage.encryptDocId,
              'url': lastPage.url,
              'page': lastPage.pageNum,
              'time': lastPage.time,
              'useSDK': lastPage.useSDK
            }))
          }

          var animation = meta.animation
          if (animation && animation.length) {
            animation.sort(function (p1, p2) {
              return parseInt(p1.time) - parseInt(p2.time)
            })
            var lastAnimation = animation.pop()
            animations.push(JSON.stringify({
              'fileName': lastAnimation.docName,
              'totalPage': lastAnimation.docTotalPage,
              'docid': lastAnimation.encryptDocId,
              'url': lastAnimation.url,
              'page': lastAnimation.pageNum,
              'time': lastAnimation.time,
              'step': lastAnimation.step
            }))
          }

          var draw = meta.draw
          if (draw && draw.length) {
            for (var i = 0; i < draw.length; i++) {
              draws.push(draw[i].data)
            }
          }
        }

        isHistoryReady = true
      }
    })
  }


  var opts = {
    // 互动信息
    interaction: {
      id: 'interactionPlayer',
      width: '100%',
      height: '100%'
    }
  }
  var Live = function (opts) {
    this.interaction = new Interaction(opts)
  }
  var live = new Live(opts)


  window.on_drampanel_ready = function () {
    // 画板Flash加载完成回调
    DrawPanel.isReady = true
    setTimeout(function () {
      initDrawPanelInfo()
    }, 1500)
  }


  // 画图事件
  window.on_cc_live_dw_draw = function (data) {
    setTimeout(function () {
      DWDpc.draw(data)
    }, getDeltaTime())
    setTimeout(function () {
      var j = toJson(data)
      DrawPanel.draw(JSON.stringify(j.value.data))
    }, getDeltaTime())
    if (MobileLive.isMobile() == 'isMobile') {
      setTimeout(function () {
        $.DrawingBoard && $.DrawingBoard.db(data)
      }, getDeltaTime())
    }
  }

  // 翻页事件
  window.on_cc_live_dw_page_change = function (data) {
    //极速动画
    setTimeout(function () {
      DWDpc.pageChange(data)
    }, getDeltaTime())
    //flash
    setTimeout(function () {
      var j = toJson(data)
      DrawPanel.filp(JSON.stringify(j.value))
    }, getDeltaTime())
    //canvas
    if (MobileLive.isMobile() == 'isMobile') {
      setTimeout(function () {
        $.DrawingBoard && $.DrawingBoard.db(data)
      }, getDeltaTime())
    }
  }

  // 动画翻页事件
  window.on_cc_live_dw_animation_change = function (data) {
    setTimeout(function () {
      DWDpc.animationChange(data)
    }, getDeltaTime())
    setTimeout(function () {
      var j = toJson(data)
      DrawPanel.animationFilp(JSON.stringify(j.value))
    }, getDeltaTime())
    if (MobileLive.isMobile() == 'isMobile') {
      setTimeout(function () {
        $.DrawingBoard && $.DrawingBoard.db(data)
      }, getDeltaTime())
    }
  }


  // Chat
  var Chat = {
    init: function () {
      Pusher.socket.on('chat_message', function (j) {
        if (typeof DWLive.onPublicChatMessage === 'function') {
          DWLive.onPublicChatMessage(j)
        }
      })
      //聊天审核
      Pusher.socket.on('chat_log_manage', function (j) {
        if (typeof DWLive.onPublicChatLogManage === 'function') {
          DWLive.onPublicChatLogManage(j)
        }
      })

      // 消息提醒
      Pusher.socket.on('notification', function (j) {
        if (typeof DWLive.onNotification === 'function') {
          DWLive.onNotification(j)
        }
      })

      Pusher.socket.on('information', function (j) {
        if (typeof DWLive.onInformation === 'function') {
          DWLive.onInformation(j)
        }
      })

      // 接收发送私聊函数
      Pusher.socket.on('private_chat_self', function (j) {
        if (typeof DWLive.onPrivateChatMessage === 'function') {
          DWLive.onPrivateChatMessage(j)
        }
      })

      // 接收回答私聊函数
      Pusher.socket.on('private_chat', function (j) {
        if (typeof DWLive.onPrivateAnswer === 'function') {
          DWLive.onPrivateAnswer(j)
        }
      })

      // 在线列表
      Pusher.socket.on('room_context', function (msg) {

      })

      // 自定义消息
      Pusher.socket.on('custom_message', function (j) {
        if (typeof DWLive.onCustomChatMessage === 'function') {
          DWLive.onCustomChatMessage(j)
        }
      })
    }
  }

  // Qa
  var Qa = {
    init: function () {

      // 问答->提交问题
      Pusher.socket.on('question', function (j) {
        if (typeof DWLive.onQuestion === 'function') {
          DWLive.onQuestion(j)
        }
        if (typeof DWLive.onQuestionSend === 'function') {
          DWLive.onQuestionSend(j)
        }
      })

      // 问答->返回答案
      Pusher.socket.on('answer', function (j) {
        if (typeof DWLive.onAnswer === 'function') {
          DWLive.onAnswer(j)
        }
        if (typeof DWLive.onAnswerSend === 'function') {
          DWLive.onAnswerSend(j)
        }
      })
    }
  }

  //事件兼容处理
  var Event = {}
  Event.addEvents = function (target, eventType, handle) {
    if (document.addEventListener) {
      Event.addEvents = function (target, eventType, handle) {
        target.addEventListener(eventType, handle, false)
      }
    } else {
      Event.addEvents = function (target, eventType, handle) {
        target.attachEvent('on' + eventType, function () {
          handle.call(target, arguments)
        })
      }
    }

    Event.addEvents(target, eventType, handle)
  }

  var MobileLive = {

    src: '',
    audio: false,
    line: 0,

    init: function () {
      var _this = this
      $.ajax({
        url: '//zeus.csslcloud.net/api/hls/play',
        type: 'GET',
        dataType: 'json',
        data: {roomid: DWLive.roomid, userid: DWLive.userid},
        success: function (data) {
          var status = data.live.status
          if (status == 0) {
            _this.m3u8 = data.live.m3u8
            _this.src = data.live.m3u8

            _this.secureHosts = data.live.secureHosts || []
            _this.audioM3u8 = data.live.audioM3u8 || []
            _this.audioSecureHosts = data.live.audioSecureHosts || []
            _this.isHttps = window.location.protocol === 'https:'
            options.init()
            options.liveId = data.live.liveId
            if (_this.isHttps && _this.secureHosts && _this.secureHosts.length) {
              _this.m3u8 = _this.secureHosts
            }

            _this.appendVideo(_this.m3u8[0])

            if (typeof DWLive.onLiveStarting === 'function') {
              DWLive.onLiveStarting()
            }

            //ios解禁播放失败处理
            var vd = $('#livePlayer>video')[0]
            var index = 0
            var handle = function () {
              if (index >= 3) {
                vd.removeEventListener('error', handle)
                return
              }
              vd.removeEventListener('error', handle)
              setTimeout(function () {
                index++
                vd.src = vd.src
                Event.addEvents(vd, 'error', handle, false)
              }, 1000)
            }

            Event.addEvents(vd, 'error', handle, false)

          } else {
            if (DWLive.isBan) {
              $('#livePlayer').css({
                'text-align': 'center',
                'color': 'white',
                'font-size': '18px',
                'line-height': '232px'
              })
              $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>')
              return
            }
          }

        }
      })
    },

    appendVideo: function (s) {
      var v = '<video id="player_live" webkit-playsinline x5-video-player-type="h5-page" playsinline controls autoplay x-webkit-airplay="allow" x5-playsinline width="100%" height="100%" src="' + s + '"></video>'
      $('#' + LivePlayer.id).html(v)
      var video = document.getElementById('player_live')
      DWLive.onKickOut = function () {
        $('#' + LivePlayer.id).html('')
      }
      this.report = new ReportLog(options, 1, 11, video, true)
    },

    ban: function () {
      $('#livePlayer').css({
        'text-align': 'center',
        'color': 'white',
        'font-size': '18px',
        'line-height': '232px'
      })
      $('#livePlayer').html('<p>直播已封禁，请联系管理员</p>')
    },

    unban: function () {
      $('#livePlayer').css({
        'text-align': '',
        'color': '',
        'font-size': '',
        'line-height': ''
      })
      this.init()
    },

    end: function () {
      $('#' + LivePlayer.id).html('')
      this.report.stopTimer()
    },

    appendDoc: function (s) {
      var isHttps = window.location.protocol === 'https:'
      if (isHttps) {
        s = s.replace(/http:/g, 'https:')
      }

      var img = '<img src="' + s + '" />'
      $('#' + DrawPanel.id).html(img)
    },

    changeLine: function (line) {
      $('#' + LivePlayer.id).find('video').attr('src', this.m3u8[line])
      this.line = line

      if (MobileLive.audio) {
        audio.src = ''
        audio.src = this.m3u8[this.line]
        audio.play()
      }
    },

    onlyAudio: function () {
      var v = $('#' + LivePlayer.id).find('video')
      MobileLive.audio = !MobileLive.audio
      if (MobileLive.audio) {
        if (this.isHttps && this.audioSecureHosts && this.audioSecureHosts.length) {
          this.m3u8 = this.audioSecureHosts
        } else {
          this.m3u8 = this.audioM3u8
        }
        audio = new Audio()
        audio.src = this.m3u8[this.line]
        audio.play()
      } else {
        if (this.isHttps && this.secureHosts && this.secureHosts.length) {
          this.m3u8 = this.secureHosts
        } else {
          this.m3u8 = this.src
        }
        audio.src = ''
        v.attr('src', this.m3u8[this.line])
      }
    },

    isMobile: function () {
      if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
        return 'isMobile'
      }
    },

    isIPad: function () {
      return navigator.userAgent.match(/iPad/i) != null
    },

    isIPhone: function () {
      return navigator.userAgent.match(/iPhone/i) != null
    },

    isAndroid: function () {
      return navigator.userAgent.match(/Android/i) != null
    },

    isWindowsPhone: function () {
      return navigator.userAgent.match(/Windows Phone/i) != null
    }

  }

  // 接受语音互动请求
  window.on_cc_live_accept_interaction = function (data) {
    if (!window.isSpeakThirdParty && live && live.livePlayer) {
      live.livePlayer.closeSound();
    }

    // 清除请求超时计时器
    live.interaction.clearRequestTimeoutTimer()
    if (window.isSpeakThirdParty) {
      live.interaction.initAgoraRTC(data)
    }

    DWLive.enterInteractionRoom()

    live.interaction.isInteractioning = true

    live.interaction.setCallingTimer()

    if (typeof window.on_cc_live_interaction_accept === 'function') {
      window.on_cc_live_interaction_accept(live.interaction.local.type, toJson(data))
    }
  }

  window.on_cc_live_interaction_disconnect_self = function (data) {
    if (window.isSpeakThirdParty) {
      live.interaction.leaveAgoraRTC()
      var type = live.interaction.local.type
      if (typeof window.on_cc_live_interaction_disconnect === 'function') {
        window.on_cc_live_interaction_disconnect(data, type)
      }
    }
    var uid = data.disconnectid
    var isPC = !!live.interaction.usersPcs[uid]
    if (uid != DWLive.viewerid && !isPC) {
      return
    }
    if (uid != DWLive.viewerid && isPC) {
      DWLive.hangupInteraction()
    }
    live.interaction.clearCallingTimer()
    live.interaction.disconnectInteraction(uid)
    // 与所有端断开连接
    if (uid == DWLive.viewerid || live.interaction.usersPcs.length == 0) {
      live.interaction.stopLocalStream()
      var type = live.interaction.local.type
      $('#videoInteractions').empty();
      $('#audioInteractions').empty();
      if ($('#interactionLocalVideo')[0]) {
        $('#interactionLocalVideo')[0].src = '';
      }
      if (type.video) {
        DWLive.livePlayerInit()
      }
      if (!window.isSpeakThirdParty && typeof window.on_cc_live_interaction_disconnect === 'function') {
        window.on_cc_live_interaction_disconnect(data, type)
      }
    } else {
      // 断开其他人
    }
    window.isRequesting = false
  }

  window.on_cc_live_interaction_remote_media_self = function (type, chatuser, stream) {
    if (typeof window.on_cc_live_interaction_remote_media === 'function') {
      window.on_cc_live_interaction_remote_media(type, chatuser, stream)
    }
    window.isRequesting = false
    if (type.video) {
      $('#livePlayer').replaceWith('<div id="livePlayer"></div>')
      var id = 'interactionRemoteVideo' + chatuser.id
      if ($('#'+id).length < 1) {
        $('#videoInteractions').append('<video cc-data="0" id="' + id + '" style="height: 100%; width: 100%;" autoplay></video>')
        $('#' + id)[0].srcObject = stream
      }
    } else {// 远程音频
      var id = 'interactionRemoteAudio' + chatuser.id
      if ($('#'+id).length < 1) {
        $('#audioInteractions').append('<audio cc-data="2" id="' + id + '" autoplay controls></audio>')
        $('#' + id)[0].srcObject = stream
      }
    }
  }

  // 主动连接语音聊天信息
  window.on_cc_live_interaction_chatusers = function (data) {
    data = toJson(data)
    $.each(data, function (index, chatuser) {
      if (chatuser.id == DWLive.viewerid) {
        return true
      }

      // 客户端只是和主播进行语音互动
      if (chatuser.role == 'publisher' && !chatuser.isMainSpeaker) {
        return true
      }

      live.interaction.createOfferPeerConnection(chatuser)
    })

  }

  // 接收互动信息
  window.on_cc_live_interaction_message = function (d) {
    var d = toJson(d)

    debug('Interaction', 'rtc互动信息:' + JSON.stringify(d))

    var toId = d.toid
    var fromId = d.fromid
    var fromName = d.fromname
    var type = d.type
    var data = d.data
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    var event = d.event

    if (event === 'offer') {
      data.type = event

      live.interaction.createAnswerPeerConnection({
        id: fromId,
        name: fromName,
        type: type
      })

      var pc = live.interaction.usersPcs[fromId].pc
      if (!pc) {
        return
      }

      pc.setRemoteDescription(new nativeRTCSessionDescription(data))
      pc.createAnswer(function () {
      }, function (error) {
        debug('Interaction', 'Failure callback: ' + error)
      })

    } else if (event === 'answer') {
      var pc = live.interaction.usersPcs[fromId].pc
      if (!pc) {
        return
      }

      data.type = event

      debug('Interaction', 'answer spark_message信息:' + data)
      pc.setRemoteDescription(new nativeRTCSessionDescription(data))

      pc.receivedAnswer = true
      if (!pc.hasAddIce && pc.RTCICE) {
        pc.addIceCandidate(pc.RTCICE)
      }

    } else {
      var u = live.interaction.usersPcs[fromId]
      if (!u) {
        u = live.interaction.usersPcs[toId]
      }
      var pc = u ? u.pc : null

      if (!pc) {
        return
      }

      // 收到answer之后再addIce
      var ice = new RTCIceCandidate(data)
      if (pc.receivedAnswer) {
        pc.hasAddIce = true
        pc.addIceCandidate(ice)
      } else {
        pc.hasAddIce = false
        pc.RTCICE = ice
      }

    }
  }

  window.isDebug = false
  // 打印debug信息
  var debug = function (t, d) {
    if (!window.isDebug) {
      return
    }

    if (console && typeof console.log === 'function') {
      console.log(t, d)
    }
  }

  function toJson(data) {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data)
      } catch (e) {
        return {}
      }
    }

    return data
  }

  window.DWLive = DWLive
  window.live = live
  DWLive.isSupportInteraction = window.live.interaction.isSupportInteraction

  window.onunload = function () {
    window.live.interaction.hangupInteraction()
  }
  window.onbeforeunload = function () {
    window.live.interaction.hangupInteraction()
  }

  // live player ready
  window._swfInit = function () {
    if (typeof window.on_cc_live_player_ready === 'function') {
      window.on_cc_live_player_ready()
    }
  }

  /**
   * Flash 加载完成
   * */
  window._swfOk = function (id) {
    if (typeof window.on_cc_swf_loading_completed === 'function') {
      window.on_cc_swf_loading_completed(id)
    }
  }

  function getDeltaTime() {
    var b = LivePlayer.delay
    if (isNaN(b) || b < 0) {
      b = 0
    }
    b = b * 1000

    // 低延迟
    if (MobileLive.isMobile() == 'isMobile') {
      if (b === 0) {
        return 5000
      } else {
        return 10000
      }
    } else {
      if (b === 0) {
        return 1300
      } else {
        return 3000
      }
    }
  }


  function getDelayTime() {
    var b = LivePlayer.delay
    if (isNaN(b) || b < 0) {
      b = 0
    }
    if (b) {
      // console.log("非低延迟模式");
    } else {
      // console.log("低延迟模式");
    }
    // b = b * 1000;

    // 低延迟
    if (MobileLive.isMobile() == 'isMobile') {
      if (b === 0) {
        return 5000
      } else {
        return 10000
      }
    } else {
      if (b === 0) {
        return 1300
      } else {
        return 3000
      }
    }
  }
})(window)