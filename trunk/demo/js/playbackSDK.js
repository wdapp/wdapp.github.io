/**
 * CC playback video
 * v3.0.0 2019/10/12
 */
!(function HuodeSceneReplay($, window, document) {
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

    // log("当前浏览器是否是IE--》 " +util.isIE());
    // if(util.isIE()){
      var xmlhttp = null;
      try{
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
        log("获取版本信息失败")
      }

      // return;
    // }
    // jQuery.support.cors = true;
    // $.ajax({
    //   url: url,
    //   method: "POST",
    //   dataType: "json",
    //   crossDomain:true,
    //   success: function (data) {
    //     log("版本信息加载完成-->" + data);
    //     var versionInfo = data;
    //     // log(versionInfo);
    //     if (versionInfo) {
    //       startTestVersion(versionInfo)
    //     }
    //   },
    //   error: function (xhr,status,errorThrown) {
    //     console.log("当前的数据"+ xhr.responseText,status,errorThrown);
    //     requestError(xhr);
    //   }
    // })
  })()


  // 直播播放器信息
  var CallbackPlayer = function (opts) {
    this.isReady = false
    this.isPublishing = 0
    this.id = opts.callbackPlayer.id

    var swfUrl = '//player.csslcloud.net/platform/live/CallbackPlayer.swf'
    var flashvars = {
      'userid': opts.userId,
      'videoid': opts.videoId,
      'recordid': opts.recordId,
      'isShowBar': opts.isShowBar,
      'upid': opts.upId,
      'viewerid': opts.viewerId,
      'roomid': opts.roomId,
      'ua': '1'
    }
    var params = {
      allowFullscreen: 'true',
      allowScriptAccess: 'always',
      wmode: 'transparent'
    }

    this.flashPlayerInit = function () {
      swfobject.embedSWF(swfUrl, opts.callbackPlayer.id, opts.callbackPlayer.width, opts.callbackPlayer.height, '10.0.0',
        '/flash/expressInstall.swf', flashvars, params)
      if (MobileLive.isMobile() != 'isMobile') {
        var report = new ReportLog(opts, 0, 1, null, false)
      }
    }

    if (!DW.isH5play) {
      this.flashPlayerInit()
    }
    this.destroy = function () {
      if(DW.isH5play&&MobileLive){
        MobileLive.destroy()
      }
    }

    this.getFlash = function () {
      return swfobject.getObjectById(this.id)
    }

    this.playbackRate = function (t) {
      if (!DW.isH5play && MobileLive.isMobile() !== 'isMobile') {
        return
      }
      var t = parseFloat(t)
      this.getH5player().playbackRate = t
    }

    this.seek = function (t) {
      if (t < 0) {
        return
      }
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        this.getH5player().currentTime = t
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        swf.seek(t)
      }
    }

    this.getFlash = function () {
      return swfobject.getObjectById(this.id)
    }

    this.getH5player = function () {
      return $('#playbackVideo')[0]
    }

    this.getPlayerTime = function () {
      if (!this.isReady) {
        return 0
      }
      var t
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        t = this.getH5player().currentTime
      } else {
        t = parseInt((typeof this.getFlash().getPosition ==="function")?(this.getFlash().getPosition()):0, 10)
      }
      if (isNaN(t) || t < 0) {
        return 0
      }

      return t
    }

    this.getDuration = function () {
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        return this.getH5player().duration
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        return swf.getDuration?swf.getDuration():0;
      }
    }

    this.getBuffer = function () {

      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        if (!this.getH5player() || !this.getH5player().buffered || !this.getH5player().buffered.end(0)) {
          return 0
        }
        var buffer = 0
        var buffered = this.getH5player().buffered
        for (var i = 0; i < buffered.length; i++) {
          buffer += buffered.end(i) - buffered.start(i)
        }
        return buffer
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        return swf.getBufferLength?swf.getBufferLength():0;
      }

    }

    this.setVolume = function (n) {
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        this.getH5player().volume = parseFloat(n)
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        if(swf.setVolume){
          return swf.setVolume(n)
        }
        return 0;

      }
    }

    this.getVolume = function () {
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        return this.getH5player().volume
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        return swf.getVolume?swf.getVolume():0;
      }
    }

    this.play = function () {
      if (DW.isH5play || MobileLive.isMobile() == 'isMobile') {
        if (MobileLive.pauseState) {
          this.getH5player().play()
        } else {
          this.getH5player().pause()
        }
      } else {
        var swf = this.getFlash()
        if (!swf) {
          return
        }
        return swf.isPlay?swf.isPlay():0;
      }
    }

    this.setZScale = function (s) {
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      return swf.setZScale(s)
    }

    this.getZScale = function () {
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      return swf.getZScale()
    }

    this.setScale = function (s) {
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      return swf.setScale(s)
    }

    this.getScale = function () {
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      return swf.getScale()
    }

    this.openSettingPanel = function () {
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      return swf.openSettingPanel()
    }
  }


  var Socket = function (opts) {

    var isHttps = window.location.protocol === 'https:'
    var host = opts.chat.host
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


    var terminal = 0
    if (MobileLive.isMobile() == 'isMobile') {
      terminal = 1
    }
    var socket
    if (!DW.forceNew) {
      socket = io.connect(document.location.protocol + '//' + host + '/replay', {
        query: {
          roomid: opts.roomId,
          sessionid: opts.viewer.sessionId,
          platform: 1,
          terminal: terminal
        }
      })
      util.log('{forceNew: false}')
    } else {
      var socket = io.connect(document.location.protocol + '//' + host + '/replay?roomid=' + opts.roomId + '&sessionid=' + opts.viewer.sessionId + '&platform=' + 1 + '&terminal=' + terminal, {forceNew: true})
      util.log('{forceNew: true}')
    }
    this.destroy = function () {

      if(socket){
        socket.disconnect();
      }
    }
  }

  var DrawPanel = function (opts, callbackPlayer) {
    this.isReady = false

    var swfUrl = '//zeus.csslcloud.net/flash/Player.swf'

    var flashvars = {
      'type': 'drawpanel'
    }
    var params = {
      allowFullscreen: 'true',
      allowScriptAccess: 'always',
      wmode: 'transparent'
    }
    var attributes = {}

    if (!DWDpc.fastMode) {
      swfobject.embedSWF(swfUrl, opts.drawPanel.id, opts.drawPanel.width, opts.drawPanel.height,
        '10.0.0', '/flash/expressInstall.swf', flashvars, params, attributes)
    }

    this.getFlash = function () {
      if (!this.isReady) {
        return
      }

      return swfobject.getObjectById(opts.drawPanel.id)
    }

    this.clear = function () {
      DWDpc.clear()
      var swf = this.getFlash()
      if (!swf) {
        return
      }
      swf.clear()
    }

    // 画图
    this.draw = function (j) {
      DWDpc.draw(j)

      var swf = this.getFlash()
      if (!swf) {
        return
      }

      swf.draw(j)
    }

    this.draws = function (js) {
      var swf = this.getFlash()
      if (!swf) {
        return
      }

      (function (jstr) {
        setTimeout(function () {
          swf.drawList(jstr)
        })
      })(js)
    }


    // 翻页
    this.filp = function (j) {
      DWDpc.pageChange(j)

      var swf = this.getFlash()
      if (!swf) {
        return
      }

      var jj = JSON.parse(j)
      var u = jj.url
      var isHttps = window.location.protocol === 'https:'
      if (isHttps) {
        jj.url = u.replace(/http:/g, 'https:')
      }

      if (options.adapt) {
        swf.filp(JSON.stringify(jj), 'auto')
      } else {
        swf.filp(JSON.stringify(jj))
      }
    }

    // 动画
    this.animation = function (j) {
      DWDpc.animationChange(j)

      var swf = this.getFlash()
      if (!swf) {
        return
      }

      swf.animation(j)
    }

    this.intervalNum = 0

    // 循环更新翻页和画板信息
    this.interval = function () {

      var ft = 0
      try {
        ft = callback.callbackPlayer.getPlayerTime()
      } catch (e) {
      }
      if (ft < 0) {
        return
      }

      if (isCustomSeek) {
        nextTime = ft
        if (Math.abs(nextTime - beforeTime) >= 2.5) {
          seekComplete && seekComplete()
        }
        beforeTime = ft
      }

      if (callback.isRequestDraws) {
        callback.drawsInfoRequestPool.isHttpRequestCurrentDraws(ft, function (data) {
          callback.draws = data
        })
      }

      try {
        if (callback.animations && callback.animations.length > 0) {
          if (callback.animationIndex < callback.animations.length) {
            var pidex = callback.pageChangeIndex
            if (pidex >= 0) {
              var pc = callback.pageChanges[pidex]
              var a = callback.animations[callback.animationIndex + 1]
              if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                if (DWDpc.fastMode) {
                  this.animation(a)
                } else {
                  this.animation(JSON.stringify({
                    'fileName': a.docName,
                    'totalPage': a.docTotalPage,
                    'docid': a.encryptDocId,
                    'url': a.url,
                    'page': a.pageNum,
                    'step': a.step
                  }))
                }
                callback.animationIndex = callback.animationIndex + 1
              }
            }
          }
        }
      } catch (e) {
      }

      try {
        if (callback.pageChanges && callback.pageChanges.length > 0) {
          if (callback.pageChangeIndex < callback.pageChanges.length) {
            var pc = callback.pageChanges[callback.pageChangeIndex + 1]
            if (ft >= pc.time) {
              if (typeof window.on_cc_callback_page_change === 'function') {
                window.on_cc_callback_page_change(pc)
              }
              if (typeof window.on_cc_request_snapshoot === 'function') {
                window.on_cc_request_snapshoot(pc)
              }
              if (DWDpc.fastMode) {
                this.filp(pc)
              } else {
                this.filp(JSON.stringify({
                  'fileName': pc.docName,
                  'totalPage': pc.docTotalPage,
                  'docid': pc.encryptDocId,
                  'url': pc.url,
                  'page': pc.pageNum,
                  'useSDK': pc.useSDK
                }))
              }

              callback.pageChangeIndex = callback.pageChangeIndex + 1

              //翻页信息回掉
              var obj = {}
              obj.docId = pc.docId
              obj.docName = pc.docName
              obj.docTotalPage = pc.docTotalPage
              obj.pageNum = pc.pageNum

              if (typeof window.on_cc_callback_pagechange === 'function') {
                window.on_cc_callback_pagechange(obj)
              }

            }
          }
        }
      } catch (e) {
      }

      try {
        if (callback.animations && callback.animations.length > 0) {
          if (callback.animationIndex < callback.animations.length) {
            var pidex = callback.pageChangeIndex
            if (pidex >= 0) {
              var pc = callback.pageChanges[pidex]
              var a = callback.animations[callback.animationIndex + 1]
              if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                if (DWDpc.fastMode) {
                  this.animation(a)
                } else {
                  this.animation(JSON.stringify({
                    'fileName': a.docName,
                    'totalPage': a.docTotalPage,
                    'docid': a.encryptDocId,
                    'url': a.url,
                    'page': a.pageNum,
                    'step': a.step
                  }))
                }
                callback.animationIndex = callback.animationIndex + 1
              }
            }
          }
        }
      } catch (e) {
      }


      try {
        if (callback.draws && callback.draws.length > 0) {
          // 画图逻辑
          if (callback.drawIndex < callback.draws.length) {
            var dc = callback.draws[callback.drawIndex + 1]
            while (ft >= dc.time) {
              if (DWDpc.fastMode) {
                this.draw(dc)
              } else {
                this.draw(dc.data)
              }

              callback.drawIndex = callback.drawIndex + 1
              dc = callback.draws[callback.drawIndex + 1]
            }
          }
        }
      } catch (e) {
      }
    }
    this.destroy = function () {
      if(callback.drawPanel.intervalNum != -1){
        clearInterval( callback.drawPanel.intervalNum );
      }
    }

    this.intervalPainting = function (callback) {
      callback.drawPanel.intervalNum = setInterval(function () {
        callback.drawPanel.interval(callback)
      }, 1000)
    }
  }

  //优化meta数据
  var substepRequest = function (opts) {
    $.ajax({
      url: opts.url,
      type: 'GET',
      data: opts.data,
      tryCount: 0,
      retryLimit: 3,
      timeout: 5000,
      dataType: 'jsonp',
      success: function (data) {
        opts.done(data)
      },
      error: function (xhr, textStatus, errorThrown) {
        if (textStatus == 'timeout') {
          this.tryCount++
          if (this.tryCount < this.retryLimit) {
            //try again
            $.ajax(this)
            return
          } else {
            if (typeof opts.fn === 'function') {
              opts.fn(textStatus)
            }
            return
          }
          return
        }
        if (xhr.status == 500) {
          //handle error
        } else {
          //handle error
        }
      }
    })
  }

  var substepRequestHistoryData = function (opts, fn) {
    var param = {
      roomid: opts.roomId,
      userid: opts.userId,
      liveid: opts.liveId,
      upid: opts.upId,
      groupid: opts.groupId,
      recordid: opts.recordId,
      viewertoken: opts.viewertoken,
      viewername: opts.viewername,
      forcibly: opts.forcibly
    }

    var sub = {
      globalData: {},
      requestLoginData: false,
      requestInfoData: false,
      requestDrawData: false,
      requestChatqaData: false,
      allRequests: 0,
    }
    param.version = VERSION;
    param.service = 3;
    param.client = 4;
    // 登录
    substepRequest({
      url: '//view.csslcloud.net/api/room/replay/login',
      data: param,
      fn: window.on_cc_login_error,
      done: function (data) {
        if (!checkout(data, window.on_cc_login_error)) {
          return false
        }
        if (data.success) {
          options.drawRequestTime = parseInt(data.datas.drawRequestTime) || 1
          window.TIMEOUT = window.TIMEOUT + (options.drawRequestTime * 1000)
          // options.drawRequestTime = (parseInt(data.datas.drawRequestTime) || 1) * 2;
          // options.drawRequestTime = 25;
          if (!DWDpc.fastMode) {
            options.drawRequestTime = ''
          }
          util.log('options', options)

          callback.state = new StateMachine()
          var snapshoot = new StateMachine()
          callback.drawsInfoRequestPool = new DrawsInfoRequestPool(callback.state, snapshoot)
        }
        concatMeta(sub.globalData, data)
        sub.requestLoginData = true
        sub.requestInfoData = false
        sub.requestDrawData = false
        sub.requestChatqaData = false
        sub.allRequests++
        success(sub)
        //登录成功
        if (typeof  window.on_cc_login_success === 'function') {
          var logInfo = data.datas
          var tmp = {
            'type': logInfo.template.type,
            'desc': logInfo.template.desc,
            'name': logInfo.template.name
          }
          var viewer = {
            'name': logInfo.viewer.name,
            'id': logInfo.viewer.id,
            'groupId': logInfo.viewer.groupId
          }
          var room = {
            'desc': logInfo.room.desc,
            'liveStartTime': logInfo.room.liveStartTime,
            'name': logInfo.room.name,
            'documentDisplayMode': logInfo.room.documentDisplayMode,
            'barrage': logInfo.room.barrage
          }
          var live = {
            'startTime': logInfo.live.endTime,
            'endTime': logInfo.live.endTime
          }
          window.on_cc_login_success({'template': tmp, 'viewer': viewer, 'room': room, 'live': live})
        }


        if (!options.drawRequestTime) {
          // 请求画笔数据
          substepRequest({
            url: '//view.csslcloud.net/api/view/replay/draw/info',
            data: param,
            fn: window.on_cc_request_draw_error,
            done: function (data) {
              if (!checkout(data)) {
                return false
              }
              concatMeta(sub.globalData, data)
              sub.requestLoginData = false
              sub.requestInfoData = false
              sub.requestDrawData = true
              sub.requestChatqaData = false
              sub.allRequests++
              success(sub)
            }
          })
        }

        // 请求聊天和问答数据
        substepRequest({
          url: '//view.csslcloud.net/api/view/replay/v2/chatqa/info',
          data: param,
          fn: window.on_cc_request_chatqa_error,
          done: function (data) {
            if (!checkout(data, window.on_cc_request_chatqa_error)) {
              return false
            }
            concatMeta(sub.globalData, data)
            sub.requestLoginData = false
            sub.requestInfoData = false
            sub.requestDrawData = false
            sub.requestChatqaData = true
            sub.allRequests++
            success(sub)
          }
        })

        // 广播，翻页，animation及后续新增数据
        substepRequest({
          url: '//view.csslcloud.net/api/view/replay/v2/info',
          data: param,
          fn: window.on_cc_request_info_error,
          done: function (data) {
            if (!checkout(data, window.on_cc_request_info_error)) {
              return false
            }
            concatMeta(sub.globalData, data)
            sub.requestLoginData = false
            sub.requestInfoData = true
            sub.requestDrawData = false
            sub.requestChatqaData = false
            sub.allRequests++
            success(sub)
          }
        })

      }
    })


    var checkout = function (data, fn) {
      if (!data.success) {
        if (typeof fn === 'function') {
          fn(data)
        }
        return false
      }

      if (!data.datas) {
        return false
      }

      return true
    }

    var concatMeta = function (d1, d2) {
      extend(d1, d2)
      if (!d1.datas.meta) {
        d1.datas.meta = {}
      }
      extend(d1.datas.meta, d2.datas.meta)
    }

    var extend = function (o, n) {
      for (var p in n) {
        if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p)))
          o[p] = n[p]
      }
    }

    var success = function (sub) {
      fn(sub)
    }

  }

  //优化meta数据 画笔数据--------------------

  //状态机
  var StateMachine = function () {

    this.requestState = false
    this.result = 0
    this.startTime = 0
    this.endTime = 0
    this.key = 0//key 为每一个状态机块的索引， id 或 index。
    this.index = 0//自动排列 key
    this.ajax = {}
    this.states = []
    this.snapshoot = []
    this.drawsAlready = 0

    this.roomId = options.roomId
    this.userId = options.userId
    this.recordId = options.recordId
    this.liveId = options.liveId
    this.drawRequestTime = options.drawRequestTime

    this.setSnapshoot = function (docId, data) {
      this.snapshoot[docId] = data
    }

    this.getSnapshoot = function () {
      return this.snapshoot
    }

    //初始化状态机
    this.init = function (options) {

      //分时间块，状态机记录
      for (var i = 0; i < this.drawRequestTime; i++) {
        var s = {
          requestState: false,
          result: 0,
          startTime: options.startTime,
          endTime: options.endTime,
          key: i
        }

        options.startTime = options.startTime + options.blockTime
        options.endTime = options.startTime + options.blockTime
        this.setState(s)
      }
    }

    this.httpRequest = function (options, callback) {
      var self = this
      self.requestState = true

      this.ajax = $.ajax({
        url: options.url,
        type: 'GET',
        data: options.param,
        tryCount: 0,
        retryLimit: 3,
        timeout: window.TIMEOUT,//20秒超时
        dataType: 'jsonp',
        success: function (data) {
          self.result = data
          if (!data.success) {
            util.log('data.success', data.success)
            return
          }
          callback(data)
          self.requestState = false
        },
        error: function (xhr, textStatus, errorThrown) {
          if (textStatus == 'timeout') {
            this.tryCount++
            if (this.tryCount < this.retryLimit) {
              //try again
              $.ajax(this)
              util.log('ajax[' + self.key + '] try again tryCount', this.tryCount)
              return
            } else {
              util.log('数据请求失败且重试多次')
              self.requestState = false
              return
            }
            return
          }
          if (xhr.status == 500) {
            //handle error
          } else {
            //handle error
          }
        }
      })
    }

    this.abort = function () {
      //模拟中断http请求
      this.ajax.abort()
      this.requestState = false
    }

    this.setState = function (options) {
      if (typeof options !== 'object') {
        return
      }
      //key 为每一个状态机块的索引， id 或 index。
      var key = (options.key || this.index++)
      if (options.key && !isNaN(options.key)) {
        this.index = parseInt(options.key) + 1
      }
      var state = new StateMachine()
      state.requestState = options.requestState || this.requestState
      state.result = options.result || this.result
      state.startTime = options.startTime || this.startTime
      state.endTime = options.endTime || this.endTime
      state.ajax = options.ajax || this.ajax
      state.snapshoot = options.snapshoot || this.snapshoot
      state.key = key
      this.states[key] = state
    }

    this.getState = function (key) {
      return this.states[key]
    }

    this.getStates = function () {
      return this.states
    }

    this.getCurrentStateIndex = function (currentTime) {
      var index = 0
      for (var i = 0; i < this.states.length; i++) {
        if (currentTime > this.states[i].startTime && currentTime <= this.states[i].endTime) {
          index = i
          break
        }
      }
      return index
    }

    this.isDrawsAlready = function () {
      return parseInt(this.drawRequestTime, 10) === parseInt(this.drawsAlready, 10)
    }
  }

  //画笔信息请求池管理
  var DrawsInfoRequestPool = function (state, snapshoot) {
    this.state = state
    this.requestNumber = 2
    this.httpRequestPool = []
    this.draws = []
    this.preState = {}

    this.isHttpRequestCurrentDraws = function (currentTime, fn) {
      if (!state.drawRequestTime) {
        return
      }
      var drawsAlready = state.isDrawsAlready()
      if (drawsAlready) {
        util.log('画笔数据加载完毕，不在预加载某一段数据')
        return
      }

      var states = state.getStates()
      var index = state.getCurrentStateIndex(currentTime)
      var _state = states[index]

      if (this.preState != _state && this.preState.requestState) {
        util.log('发现新的预加载请求，中断上一个预加载请求;index=' + this.preState.key)
        this.preState.abort()
      }
      this.preState = _state

      //请求数据
      if (!drawsAlready && !_state.result && !_state.requestState) {
        util.log('预加载数据', index)
        var options = {
          index: index,
          states: states
        }
        this.httpRequestCurrentDraws(options, fn)
      } else {
        util.log('预加载过这段数据或已有数据;index=' + index)
      }
    }

    this.httpRequestCurrentDraws = function (options, fn) {
      var self = this
      var states = options.states
      var index = options.index
      var _state = states[index]

      var param = {
        url: '//view.csslcloud.net/api/view/replay/v2/draw/range',
        param: {
          starttime: _state.startTime,
          endtime: _state.endTime,
          userid: _state.userId,
          recordid: _state.recordId,
          liveid: _state.liveId,
        }
      }
      _state.httpRequest(param, function (data) {
        var draw = data.datas.meta.draw
        util.log('*** 预加载成功 callback.draws[' + index + '] ***', draw)
        self.draws = distinct(self.draws, draw)
        self.draws.sort(function (p1, p2) {
          return parseInt(p1.time) - parseInt(p2.time)
        })
        fn(self.draws)
        callback.state.drawsAlready++
      })
    }

    this.httpRequestStream = function (fn) {
      var self = this
      var drawsAlready = self.state.isDrawsAlready()
      if (drawsAlready) {
        util.log('httpRequestStream draws already', self.draws)
        util.log('callback.state', callback.state)
        util.log('snapshoot', snapshoot)
        return
      }
      var states = self.state.getStates()

      //获取符合条件的请求
      for (var i = 0; i < states.length; i++) {
        var state = states[i]
        if (!state.result && !state.requestState) {
          if (self.httpRequestPool.length < self.requestNumber) {
            self.httpRequestPool.push(state)
          } else {
            break
          }
        }
      }

      //处理请求池，发起请求
      for (var j = 0; j < self.httpRequestPool.length; j++) {
        var state = self.httpRequestPool[j]
        if (!state.result && !state.requestState) {
          (function (state) {
            var options = {
              url: '//view.csslcloud.net/api/view/replay/v2/draw/range',
              param: {
                starttime: state.startTime,
                endtime: state.endTime,
                userid: state.userId,
                recordid: state.recordId,
                liveid: state.liveId,
              }
            }
            state.httpRequest(options, function (data) {
              var draw = data.datas.meta.draw
              util.log('请求流 draw[' + state.key + ']', draw)
              //合并分段请求返回的画笔数据
              if (callback.isRequestDraws) {
                self.draws = distinct(self.draws, draw)
              } else {
                self.draws = self.draws.concat(draw)
              }

              //排序
              self.draws.sort(function (p1, p2) {
                return parseInt(p1.time) - parseInt(p2.time)
              })
              //回调画笔数据
              fn(self.draws)
              //请求池管理，删除已完成的请求
              for (var k = 0; k < self.httpRequestPool.length; k++) {
                if (self.httpRequestPool[k].key == state.key) {
                  self.httpRequestPool.splice(k, 1)
                  break
                }
              }
              //继续监测请求池中符合请求条件的请求，发起请求
              callback.state.drawsAlready++
              self.httpRequestStream(fn)
            })
          })(state)
        }
      }
    }

    this.httpRequestSnapshoot = function (e, currentTime, fn) {
      var self = this
      var drawsAlready = state.isDrawsAlready()
      if (drawsAlready) {
        util.log('画笔数据请求完整，不在请求快照数据')
        return
      }

      var states = state.getStates()
      var currentTime = currentTime
      var index = state.getCurrentStateIndex(currentTime)
      var _state = states[index]

      if (!_state) {
        return
      }

      var _snapshoot = snapshoot.getSnapshoot()
      var _isSnapshoot = _snapshoot[e.docId + '_' + e.pageNum + '_' + e.url]

      //请求快照
      if (!_state.result && !_isSnapshoot) {//当前时间段是否有数据 && 当前页是否存在快照
        util.log('_snapshoot.getSnapshoot()', _snapshoot)
        //中断没有请求完的快照，快照只能存在一个请求
        if (snapshoot.requestState) {
          snapshoot.abort()
        }

        var options = {
          url: '//view.csslcloud.net/api/view/replay/v2/draw/snapshot',
          param: {
            docid: e.docId,
            currentpage: e.pageNum,
            userid: snapshoot.userId,
            recordid: snapshoot.recordId,
          }
        }
        snapshoot.httpRequest(options, function (data) {
          //缓存快照数据
          snapshoot.setSnapshoot(e.docId + '_' + e.pageNum + '_' + e.url, data)

          if (!_state.result) {
            callback.isRequestDraws = true
            var draw = data.datas.meta.draw
            util.log('*** 快照 callback.draws[' + e.docId + '_' + e.pageNum + '_' + e.url + '] ***', draw)
            self.draws = distinct(self.draws, draw)
            self.draws.sort(function (p1, p2) {
              return parseInt(p1.time) - parseInt(p2.time)
            })
            fn(self.draws)
          } else {
            util.log('快照请求成功，当前时间段数据存在，丢弃快照' + index + '')
          }
        })
      } else {
        util.log('当前时间段存在数据或存在快照', index + '')
      }
    }

    function distinct(a, b) {
      // 数组去重
      var arr = a.concat(b)
      var result = []
      var obj = {}
      for (var i in arr) {
        if (!obj[JSON.stringify(arr[i])]) {
          result.push(arr[i])
          obj[JSON.stringify(arr[i])] = 1
        }
      }
      return result
    }

    function unique(oldDraws, newDraws) {
      //分段数据与快照合并
      var _oldDraws = oldDraws
      var _newDraws = newDraws
      var draws = []
      for (var i = 0; i < _newDraws.length; i++) {
        var newDraw = _newDraws[i]
        for (var j = 0; j < _oldDraws.length; j++) {
          var oldDraw = _oldDraws[j]
          if (isObjectValueEqual(oldDraw, newDraw)) {
            _oldDraws.splice(j, 1)
            break
          }
        }
      }
      draws = _oldDraws.concat(_newDraws)
      return draws
    }

    function isObjectValueEqual(a, b) {
      // Of course, we can do it use for in
      // Create arrays of property names
      var aProps = Object.getOwnPropertyNames(a)
      var bProps = Object.getOwnPropertyNames(b)

      // If number of properties is different,
      // objects are not equivalent
      if (aProps.length != bProps.length) {
        return false
      }

      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
          return false
        }
      }

      // If we made it this far, objects
      // are considered equivalent
      return true
    }

  }

  //防止获取不到duration
  window.ListenerDuration = function () {
    if (!on_cc_limit_request_draws) {
      return
    }
    var t = setInterval(function () {
      var duration = parseInt(callback.callbackPlayer.getDuration())
      if (duration) {
        util.log('ListenerDuration')
        on_cc_limit_request_draws && on_cc_limit_request_draws()
        clearInterval(t)
      }
    }, 50)
    window.ListenerDuration = null
  }

  window.on_cc_limit_request_draws = function () {
    if (!options.drawRequestTime) {
      return
    }

    util.log('分页请求画笔数据', options.drawRequestTime)
    var duration = (callback.callbackPlayer.getDuration()) + 1
    util.log('duration', duration + '')
    //请求数据左包含，右不包含，duration+1秒，防止最后一秒数据无法请求到。
    var blockTime = Math.ceil(duration / options.drawRequestTime)
    var startTime = 0
    var endTime = startTime + blockTime

    var blockDuration = {
      blockTime: blockTime,
      startTime: startTime,
      endTime: endTime
    }
    callback.state.init(blockDuration)

    util.log('callback.state', callback.state)

    callback.drawsInfoRequestPool.httpRequestStream(function (data) {
      callback.draws = data
      callback.isHistoryReady = true
      callback.drawPanel.isReady = true
    })

    setTimeout(function () {
      initDrawPanelInfo()
    }, 1500)

    window.on_cc_limit_request_draws = null
  }

  window.on_cc_request_snapshoot = function (pageChange) {
    if (!options.drawRequestTime) {
      return
    }
    util.log('pageChange', pageChange)
    var currentTime = callback.callbackPlayer.getPlayerTime()
    callback.drawsInfoRequestPool.httpRequestSnapshoot(pageChange, currentTime, function (data) {
      callback.draws = data
      callback.isHistoryReady = true
      callback.drawPanel.isReady = true
    })
  }

  // 历史数据
  var History = function (opts, callback) {

    substepRequestHistoryData(opts, success)

    //canplay
    var onCCH5PlayerLoad = false

    function success(sub) {

      var data = sub.globalData

      if (sub.requestLoginData) {

        var drawPanel = document.getElementById("playbackPanel");
        //初始化极速动画对象
        if (DWDpc.fastMode && drawPanel) {
           $('#documentDisplayMode').val(data.datas.room.documentDisplayMode)
          var script = document.createElement("script");
          script.src = '//image.csslcloud.net/live/1.0.1/sdk/js/dpc.js?v=' + (Math.floor(Math.random() * 1000000))
          script.onload = function(){
            DWDpc.appendDrawPanel()
            DWDpc.init()
            DWDpc.isDPReady = true;
            window.on_hdLive_drawPanel_complete && window.on_hdLive_drawPanel_complete();
          }
          document.body.appendChild(script);
        }

        opts.chat = {
          host: data.datas.pusherNode.primary
        }
        opts.viewer.sessionId = data.datas.sessionId
        opts.liveId = data.datas.encryptLiveId
        opts.upId = data.datas.upId
        opts.viewerId = data.datas.viewer.id
        callback.socket = new Socket(opts)
        $.DW.groupId = data.datas.viewer.groupId
        if (typeof window.on_cc_callback_player === 'function') {
          window.on_cc_callback_player(data.datas)
        }

        //encryptRecordId
        if (!opts.recordId) {
          opts.recordId = data.datas.encryptRecordId
        }

        if (DW.isH5play) {
          MobileLive.init(opts)
        } else if (MobileLive.isMobile() == 'isMobile') {
          MobileLive.init(opts)
        }
      }

      var datas = data.datas
      var meta = datas.meta
      if (!meta) {
        return
      }

      if (sub.requestInfoData) {
        var pages = meta.pageChange
        if (pages) {
          for (var i = 0; i < pages.length; i++) {
            var imgUrl = pages[i].url
            var isHttps = window.location.protocol === 'https:'
            if (imgUrl.indexOf('//') > 0 && isHttps) {
              imgUrl = imgUrl.replace('http:', 'https:')
              pages[i].url = imgUrl
            }
          }

          if (typeof window.on_cc_callback_pages === 'function') {
            window.on_cc_callback_pages(pages)
          }
        }

        var pageChanges = meta.pageChange
        if (pageChanges && pageChanges.length) {
          pageChanges.sort(function (a,b) {
            return a.serverTime - b.serverTime
          })
          pageChanges.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })

          var len = pageChanges.length;
          var lastTime = -1;
          var pages=[];
          for(var i=0 ;i<len;i++){
            var obj = pageChanges[i];
            if(obj.time == lastTime){
              pages[pages.length - 1] = obj;

            }else{
              pages.push(obj);
            }
            lastTime = obj.time;
          }
          callback.pageChanges = pages;
        }

        //文档信息加载完成，首先渲染首页
        if(callback.pageChanges && callback.pageChanges.length) {
          callback.drawPanel.filp(callback.pageChanges[0])
        }

        var animations = meta.animation
        if (animations && animations.length) {
          animations.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })
          callback.animations = animations
        }

        //广播
        var broadcasts = meta.broadcast
        window.chatLogs = meta.broadcast
        if (broadcasts && broadcasts.length) {
          broadcasts.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })
          for (var i = 0; i < broadcasts.length; i++) {
            var broadcast = broadcasts[i]
            if (typeof window.on_cc_live_broadcast_msg == 'function') {
              window.on_cc_live_broadcast_msg({
                content: broadcast.content,
                time: broadcast.time
              })
            }
          }
          callback.broadcasts = broadcasts
        }
      }

      if (sub.requestChatqaData) {
        var questions = meta.question
        if (questions && questions.length) {
          questions.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })
          callback.questions = questions
          for (var i = 0; i < callback.questions.length; i++) {
            var question = questions[i]

            if (typeof window.on_cc_live_qa_question === 'function') {
              window.on_cc_live_qa_question({
                'action': 'question',
                'value': {
                  'id': question.encryptId,
                  'content': question.content,
                  'groupId': question.groupId,
                  'userId': question.questionUserId,
                  'userName': question.questionUserName,
                  'userAvatar': question.questionUserAvatar,
                  'isPublish': question.isPublish
                }
              })
            }
          }
        }

        var answers = meta.answer
        if (answers && answers.length) {
          answers.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })
          callback.answers = answers

          for (var i = 0; i < callback.answers.length; i++) {
            var answer = answers[i]

            if (typeof window.on_cc_live_qa_answer === 'function') {
              window.on_cc_live_qa_answer({
                'action': 'answer',
                'value': {
                  'questionId': answer.encryptId,
                  'content': answer.content,
                  'userId': answer.answerUserId,
                  'isPrivate': answer.isPrivate,
                  'groupId': answer.groupId,
                  'userName': answer.answerUserName,
                  'userAvatar': answer.answerUserAvatar,
                  'userRole': answer.answerUserRole
                }
              })
            }
          }
        }

        var chatLogs = meta.chatLog
        window.chatLogs = meta.chatLog
        if (chatLogs && chatLogs.length) {
          chatLogs.sort(function (p1, p2) {
            return parseInt(p1.time) - parseInt(p2.time)
          })
          for (var i = 0; i < chatLogs.length; i++) {
            var chatLog = chatLogs[i]
            if (typeof window.on_cc_live_chat_msg === 'function') {
              window.on_cc_live_chat_msg({
                userid: chatLog.userId,
                username: chatLog.userName,
                time: chatLog.time,
                msg: chatLog.content,
                groupId: chatLog.groupId,
                chatId: chatLog.chatId,
                status: chatLog.status,
                useravatar: chatLog.userAvatar,
                userRole: chatLog.userRole,
                usercustommark: chatLog.userCustomMark,
                role: chatLog.role
              })
            }
          }
          callback.chatLogs = chatLogs
        }

        if (window.chatLogs && window.chatLogs.length) {
          window.CHATLOGS = window.chatLogs
          cc_live_callback_chat_interval()
        }

        if (window.broadcasts && window.broadcasts.length) {
          //广播
          window.BROADCASTS = window.broadcasts
          cc_live_callback_broadcasts_interval()
        }
      }

      if (sub.requestDrawData) {
        var draws = meta.draw
        if (draws && draws.length) {
          callback.draws = draws
        }

        callback.isHistoryReady = true

        callback.drawPanel.isReady = true
        setTimeout(function () {
          initDrawPanelInfo()
        }, 1500)
      }

      window.on_cc_h5_player_load = function () {
        callback.callbackPlayer.isReady = true
        if (onCCH5PlayerLoad) {
          return
        }
        onCCH5PlayerLoad = true

        var playbackPanel = document.getElementById('drawPanel')
        if (playbackPanel) {
          $.Callback.config({playerId: 'playbackVideo'}, meta)
        }

      }

    }

  }

  //广播
  var BroadcastCache = function () {
    this.cache = []
    this.lastTimeRefresh = new Date().getTime()

    this.INTERVAL_TIME = setInterval(function () {
      callback.broadcastCache && callback.broadcastCache.refresh && callback.broadcastCache.refresh()
    }, 80)

    //
    this.push = function (data) {
      // 缓存中超过5000条数据，则丢弃
      if (this.cache.length > 5000) {
        return
      }
      this.cache.push(data)
    }
    this.destroy = function () {
      if(this.INTERVAL_TIME !=-1){
        clearInterval(this.INTERVAL_TIME);
      }
    }

    this.ableRefresh = function () {
      var n = new Date().getTime()

      if (this.cache.length == 0) {
        return false
      }

      if ((n - this.lastTimeRefresh) >= 80) {
        return true
      }
      return false
    }

    this.refresh = function () {
      if (!this.ableRefresh()) {
        return
      }

      clearInterval(this.INTERVAL_TIME)

      var d = []
      var l = Math.min(this.cache.length, 10)
      for (var i = 0; i < l; i++) {
        d.push(this.cache.shift())
      }

      if (typeof window.on_cc_live_broadcast_msg_sync === 'function') {
        window.on_cc_live_broadcast_msg_sync(d)
      }

      this.lastTimeRefresh = new Date().getTime()

      this.INTERVAL_TIME = setInterval(function () {
        callback.broadcastCache.refresh()
      }, 80)
    }
  }

  var ChatMessageCache = function () {
    this.cache = []
    this.lastTimeRefresh = new Date().getTime()

    this.INTERVAL_TIME = setInterval(function () {
      callback.chatMessageCache.refresh()
    }, 80)

    this.destroy = function () {
      if(this.INTERVAL_TIME !=-1){
          clearInterval(this.INTERVAL_TIME);
      }
    }
    //
    this.push = function (data) {
      // 缓存中超过5000条数据，则丢弃
      if (this.cache.length > 5000) {
        return
      }
      this.cache.push(data)
    }

    this.ableRefresh = function () {
      var n = new Date().getTime()

      if (this.cache.length == 0) {
        return false
      }

      if ((n - this.lastTimeRefresh) >= 80) {
        return true
      }
      return false
    }

    this.refresh = function () {
      if (!this.ableRefresh()) {
        return
      }

      clearInterval(this.INTERVAL_TIME)

      var d = []
      var l = Math.min(this.cache.length, 10)
      for (var i = 0; i < l; i++) {
        d.push(this.cache.shift())
      }

      if (typeof window.on_cc_live_chat_msg_sync === 'function') {
        window.on_cc_live_chat_msg_sync(d)
      }

      this.lastTimeRefresh = new Date().getTime()

      this.INTERVAL_TIME = setInterval(function () {
        callback.chatMessageCache.refresh()
      }, 80)
    }
  }

  var Callback = function (opts) {
    this.chatLogs = []
    this.broadcasts = []
    this.draws = []
    this.pageChanges = []
    // 获取历史数据成功
    this.isHistoryReady = false
    this.questions = []
    this.answers = []
    this.pageChanges = []
    this.draws = []
    this.animations = []
    this.pageChangeIndex = -1
    this.drawIndex = -1
    this.animationIndex = -1
    this.isRequestDraws = false

    //this.callbackPlayer = new CallbackPlayer(opts);
    //this.socket = new Socket(opts);
    this.drawPanel = new DrawPanel(opts, this)
    this.history = new History(opts, this)
    this.chatMessageCache = new ChatMessageCache()
    //广播
    this.broadcastCache = new BroadcastCache()
    this.destroy = function () {
      this.chatLogs = []
      this.broadcasts = []
      this.draws = []
      this.pageChanges = []
      // 获取历史数据成功
      this.isHistoryReady = false
      this.questions = []
      this.answers = []
      this.pageChanges = []
      this.draws = []
      this.animations = []
      this.pageChangeIndex = -1
      this.drawIndex = -1
      this.animationIndex = -1
      this.isRequestDraws = false

      this.history =null;
      if(this.drawPanel){
        this.drawPanel.destroy();
        this.drawPanel = null;
      }
      if(this.chatMessageCache){
        this.chatMessageCache.destroy();
        this.chatMessageCache = null
      }
      if(this.broadcastCache){
        this.broadcastCache.destroy();
        //广播
        this.broadcastCache =null;
      }
    }
  }

  var callback = {}

  window.isDebug = false
  var util = {
    isDebug: window.isDebug,
    log: function (arg1, arg2) {
      if (window.isDebug && window.console && typeof console.log === 'function') {
        if (arg2) {
          console.log(arg1 + ' => ', arg2)
        } else {
          console.log(arg1)
        }
      }
    },
    isIE: function () {
      if (navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1) {
        if (navigator.userAgent.indexOf('MSIE 9.0') > -1) {
          return true
        }
        if (navigator.userAgent.indexOf('MSIE 10.0') > -1) {
          return true
        }
        return true
      }
      var isIE11 = navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf('rv:11.0') > -1
      if (isIE11) {
        return true
      }
      return false
    },
    isMp4: function (url) {
      var l = url.split('?')[0]
      var u = l.slice(l.length - 4)
      return u === '.mp4'
    }
  }
  window.TIMEOUT = 5000

  var options = {
    userId: $('#userId').val(),
    roomId: $('#roomId').val(),
    liveId: $('#liveId').val(),
    recordId: $('#recordId').val(),
    videoId: $('#videoId').val(),
    adapt: false,
    isShowBar: 0,
    viewerId: $('#viewerId').val(),
    upId: $('#upId').val(),
    // 观看者用户信息
    viewer: {
      id: $('#viewerId').val(),
      name: $('#viewerName').val(),
      role: $('#viewerRole').val(),
      sessionId: $('#sessionId').val()
    },

    // 直播播放器信息
    callbackPlayer: {
      id: 'playbackPlayer',
      width: '100%',
      height: '100%'
    },

    // 画板信息
    drawPanel: {
      id: 'playbackPanel',
      width: '100%',
      height: '100%'
    }
  }

  //极速文档模式
  var DWDpc = {
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
      $('#playbackPanel').parent().append(dp)
      // $('div#playbackPanel').remove()

      if (typeof window.on_cc_live_db_flip === 'function') {
        window.on_cc_live_db_flip()
      }
    },
    destroy: function () {
      this.clear()
      this.dpc.dispose()
      this.dpc.resetDpc();
      $("#dpa").remove();
    },
    pageChange: function (pc) {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      this.dpc.pageChange(pc)
    },
    animationChange: function (ac) {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      this.dpc.animationChange(ac)
    },
    history: function (h) {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      this.dpc.history(h)
    },
    draw: function (d) {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      this.dpc.draw(d)
    },
    clear: function () {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      this.dpc.clear()
    },
    docAdapt: function (t) {
      if(!this.isDPReady)return
      if (!this.fastMode) {
        return
      }
      var displayMode = t ? '1' : '2'
      this.dpc.setDisplayMode(displayMode)
    }
  }

  function init(opts) {
    options.viewerId = opts.viewerid
    options = $.extend(options, opts)

    callback = new Callback(options)
  }

  var DW = {
    isH5play: true,
    fastMode: true,
    forceNew: false,
    setFastMode: function (opts) {
      if (typeof opts.fastMode == 'string') {
        if (opts.fastMode === 'false') {
          this.fastMode = false
        } else {
          this.fastMode = true
        }
      } else if (typeof opts.fastMode == 'boolean') {
        this.fastMode = opts.fastMode
      } else {
        this.fastMode = true
      }
    },
    // 初始化DW对象
    config: function (opts) {
      if (checkVideo()) {
        if ( opts.isH5play + '' === 'false') {
          this.isH5play = false
        } else {
          this.isH5play = true
        }
      }else {
        this.isH5play = false
      }
      if(!opts.recordId){
        throw new Error("未传入有效的recordId");
        return;
      }

      this.setFastMode(opts)
      DWDpc.fastMode = this.fastMode

      var scriptArray = [
        // '//static.csslcloud.net/js/hls.min.js',
        '//static.csslcloud.net/js/socket.io.js',
        '//static.csslcloud.net/js/swfobject.js',
        '//static.csslcloud.net/js/json3.min.js',
        '//static.csslcloud.net/js/module/drawingBoard-2.0.0.js',
        '//static.csslcloud.net/js/module/drawingBoardPlayback.js',
        '//static.csslcloud.net/js/report.js'
      ]
      if (DWDpc.fastMode) {
        scriptArray.splice(3, 2)
      }

      this.loadScript(scriptArray, function () {
        init(opts)
        if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard && !DWDpc.fastMode) {
          DW.appendDrawPanel()
        }
      })

      if (typeof opts.forceNew === 'boolean') {
        this.forceNew = opts.forceNew
      }
    },
    appendDrawPanel: function () {
      var dp = '<canvas id="drawPanel" width="1200" height="1200" style="position: absolute;z-index:2;top:0;left: 0"></canvas>'
        + '<iframe id="dpa" src="" frameborder="0" style="position: absolute;top:0;left: 0"></iframe>'
      $('#playbackPanel').parent().append(dp)
      $('div#playbackPanel').hide()
    },
    logout: function (callback) {
      $.ajax({
        url: '//view.csslcloud.net/api/callback/logout',
        type: 'GET',
        dataType: 'jsonp',
        timeout: 5000,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if(!callback)return
          callback.success && callback.success(data)
        },
        error: function (xhr, status, error) {
          if(!callback)return
          callback.error && callback.error(xhr, status, error)
        }
      })
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

    playbackRate: function (t) {
      callback.callbackPlayer.playbackRate(t)
    },

    seek: function (t) {
      clearInterval(callback.drawPanel.intervalNum)
      callback.callbackPlayer.seek(t)
    },

    getPlayerTime: function () {

      return callback.callbackPlayer.getPlayerTime()

    },
    destroy:function(){
      if(callback){
        callback.destroy();
        if(callback.socket){
          callback.socket.destroy();
        }
        if(callback.callbackPlayer){
          callback.callbackPlayer.destroy();
        }
      }
      if(DWDpc){
        DWDpc.destroy();
      }
      clearAllInterval();
      HuodeSceneReplay && HuodeSceneReplay(jQuery, window, document, undefined)
    },

    getDuration: function () {
      if (DW.isH5play) {
        return MobileLive.getDuration()
      } else if (MobileLive.isMobile() == 'isMobile') {
        return MobileLive.getDuration()
      } else {
        return callback.callbackPlayer.getDuration()
      }
    },

    docAdapt: function (t) {
      if (DWDpc.fastMode) {
        DWDpc.docAdapt(t)
      }
      options.adapt = t
    },

    isShowBar: function (n) {
      options.isShowBar = n
    },

    getBuffer: function () {
      return callback.callbackPlayer.getBuffer()
    },

    setVolume: function (n) {
      return callback.callbackPlayer.setVolume(n)
    },

    getVolume: function () {
      return callback.callbackPlayer.getVolume()
    },

    play: function () {
      return callback.callbackPlayer.play()
    },

    setZScale: function (s) {
      return callback.callbackPlayer.setZScale(s)
    },

    getZScale: function () {
      return callback.callbackPlayer.getZScale()
    },

    setScale: function (s) {
      return callback.callbackPlayer.setScale(s)
    },

    getScale: function () {
      return callback.callbackPlayer.getScale()
    },

    openSettingPanel: function () {
      return callback.callbackPlayer.openSettingPanel()
    },
    getReplayPractice:function () {
      practice.getReplayPracticeInfo({
        recordId:options.recordId
      })
    }
  }

  $.extend({
    DW: DW
  })

  function isLivePlayerReady() {
    if (!callback.callbackPlayer.isReady) {
      setTimeout(function () {
        isLivePlayerReady()
      }, 500)
      return
    }
    callback.drawPanel.intervalPainting(callback)
  }

  // 初始化画板数据
  function initDrawPanelInfo() {
    // 等待历史数据加载成功
    if (!callback.isHistoryReady) {
      setTimeout(function () {
        initDrawPanelInfo()
      }, 300)
      return
    }
    isLivePlayerReady()
  }

  window.on_cc_callback_player = function (data) {
    options.videoId = data.live.encryptRecordvideoId
    options.recordId = data.encryptRecordId
    callback.callbackPlayer = new CallbackPlayer(options)
  }
  var chatIntervalId = -1;
  var broadcastsIntervalId = -1;
  // 播放器加载完成，开始播放
  window.on_cc_live_player_init = function () {
    callback.callbackPlayer.isReady = true
    try {
      callback.callbackPlayer.getFlash().start()
    } catch (e) {
    }
    if(chatIntervalId !=-1){
      clearInterval(chatIntervalId);
    }
    if(broadcastsIntervalId !=-1){
      clearInterval(broadcastsIntervalId);
    }
    // 同时开始实时显示聊天信息
    chatIntervalId =  setInterval(function () {
      var ft = 0
      try {
        ft = callback.callbackPlayer.getPlayerTime()
      } catch (e) {
      }
      if (ft <= 0) {
        return
      }

      if (!callback.chatLogs.length) {
        return
      }

      var chatLog = callback.chatLogs[0]
      while (chatLog.time <= ft) {
        chatLog = callback.chatLogs.shift()

        callback.chatMessageCache.push({
          userid: chatLog.userId,
          username: chatLog.userName,
          time: chatLog.time,
          msg: chatLog.content,
          groupId: chatLog.groupId,
          chatId: chatLog.chatId,
          status: chatLog.status,
          useravatar: chatLog.userAvatar,
          userRole: chatLog.userRole,
          usercustommark: chatLog.userCustomMark,
          role: chatLog.role,
        })

        if (!callback.chatLogs.length) {
          break
        }

        chatLog = callback.chatLogs[0]
      }
    }, 1000)

    // 同时开始实时显示广播
    broadcastsIntervalId = setInterval(function () {
      var ft = 0
      try {
        ft = callback.callbackPlayer.getPlayerTime()
      } catch (e) {
      }
      if (ft <= 0) {
        return
      }

      if (!callback.broadcasts.length) {
        return
      }

      var broadcast = callback.broadcasts[0]
      while (broadcast.time <= ft) {
        broadcast = callback.broadcasts.shift()

        callback.broadcastCache.push({
          content: broadcast.content,
          time: broadcast.time
        })

        if (!callback.broadcasts.length) {
          break
        }

        broadcast = callback.broadcasts[0]
      }
    }, 1000)

    if (typeof window.on_cc_live_player_load === 'function') {
      window.on_cc_live_player_load()
    }

    if (on_cc_limit_request_draws) {
      var duration = parseInt(callback.callbackPlayer.getDuration())
      if (duration) {
        on_cc_limit_request_draws && on_cc_limit_request_draws()
      } else {
        ListenerDuration && ListenerDuration()
      }
    }

  }

  function cc_live_callback_chat_interval() {
    if(chatIntervalId !=-1){
      clearInterval(chatIntervalId);
    }
    chatIntervalId = setInterval(function () {
      var ft = 0
      try {
        ft = parseInt($('#playbackVideo')[0].currentTime, 10)
      } catch (e) {
      }
      if (ft <= 0) {
        return
      }

      if (!window.CHATLOGS.length) {
        return
      }

      var chatLog = window.CHATLOGS[0]

      while (chatLog.time <= ft) {
        var cl = window.CHATLOGS.shift()
        callback.chatMessageCache.push({
          userid: cl.userId,
          username: cl.userName,
          time: cl.time,
          msg: cl.content,
          groupId: cl.groupId,
          useravatar: cl.userAvatar,
          userRole: cl.userRole,
          chatId: chatLog.chatId,
          status: chatLog.status,
          usercustommark: cl.userCustomMark,
          role: cl.role
        })
        if (!window.CHATLOGS.length) {
          break
        }
        chatLog = window.CHATLOGS[0]
      }

    }, 1000)
  }


  function cc_live_callback_broadcasts_interval() {
    if(broadcastsIntervalId !=-1){
      clearInterval(broadcastsIntervalId);
    }
    broadcastsIntervalId = setInterval(function () {
      var ft = 0
      try {
        ft = parseInt($('#playbackVideo')[0].currentTime, 10)
      } catch (e) {
      }
      if (ft <= 0) {
        return
      }

      //广播
      if (!window.BROADCASTS.length) {
        return
      }

      var broadcast = window.BROADCASTS[0]

      while (broadcast.time <= ft) {
        var bc = window.BROADCASTS.shift()
        callback.broadcastCache.push({
          content: bc.content,
          time: bc.time
        })

        if (!window.BROADCASTS.length) {
          break
        }
        broadcast = window.BROADCASTS[0]
      }

    }, 1000)
  }

  // 画板Flash加载完成回调
  window.on_drampanel_ready = function () {
    callback.drawPanel.isReady = true

    setTimeout(function () {
      initDrawPanelInfo()
    }, 1500)
  }
  //清除所有定时器
   function clearAllInterval(){
     if(chatIntervalId !=-1){
       clearInterval(chatIntervalId);
     }
     if(broadcastsIntervalId !=-1){
       clearInterval(broadcastsIntervalId);
     }
     // if(callback.drawPanel.intervalNum!=-1){
     //   clearInterval(callback.drawPanel.intervalNum);
     // }
   }

  window.seekStart = function () {
    clearInterval(callback.drawPanel.intervalNum)
  }

  // 拖动时间轴或跳动播放成功后回调函数
  window.seekComplete = function () {
    callback.drawPanel.clear()
    //clearInterval(callback.drawPanel.intervalNum);

    var ft = callback.callbackPlayer.getPlayerTime()
    if (ft < 0) {
      ft = 0
    }

    callback.pageChangeIndex = -1
    callback.drawIndex = -1
    callback.animationIndex = -1

    var meta = {
      pageChange: [],
      animation: [],
      draw: []
    }

    if (callback.pageChanges && callback.pageChanges.length > 0) {
      for (var i = 0; i < callback.pageChanges.length; i++) {
        var pc = callback.pageChanges[i]
        if (ft >= pc.time) {
          callback.pageChangeIndex = i
        }
      }

      if (callback.pageChangeIndex >= 0) {
        var pc = callback.pageChanges[callback.pageChangeIndex]
        if (typeof window.on_cc_callback_page_change === 'function') {
          window.on_cc_callback_page_change(pc)
        }
        if (typeof window.on_cc_request_snapshoot === 'function') {
          window.on_cc_request_snapshoot(pc)
        }
        if(DWDpc.fastMode){
          callback.drawPanel.filp(pc);
        }else{
          callback.drawPanel.filp(JSON.stringify({
            'fileName': pc.docName,
            'totalPage': pc.docTotalPage,
            'docid': pc.encryptDocId,
            'url': pc.url,
            'page': pc.pageNum,
            'useSDK': pc.useSDK
          }))
        }
        meta.pageChange.push(pc)
      }
    }

    if (callback.animations && callback.animations.length > 0) {
      for (var i = 0; i < callback.animations.length; i++) {
        var a = callback.animations[i]
        if (ft >= a.time) {
          callback.animationIndex = i
        }
      }

      if (callback.animationIndex >= 0) {
        var pidex = callback.pageChangeIndex
        if (pidex >= 0) {
          var pc = callback.pageChanges[pidex]
          var a = callback.animations[callback.animationIndex]

          if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
            callback.drawPanel.animation(JSON.stringify({
              'fileName': a.docName,
              'totalPage': a.docTotalPage,
              'docid': a.encryptDocId,
              'url': a.url,
              'page': a.pageNum,
              'step': a.step
            }))

            meta.animation.push(a)

          }
        }
      }
    }

    if (callback.draws && callback.draws.length > 0) {
      for (var i = 0; i < callback.draws.length; i++) {
        var dc = callback.draws[i]
        if (dc) {
          if (ft >= dc.time) {
            //callback.drawPanel.draw(dc.data);
            callback.drawIndex = i
          }
        }

      }

      var ds = callback.draws.slice(0, (callback.drawIndex + 1))
      if (ds.length > 0) {
        var dcdatas = []
        for (var i = 0; i < ds.length; i++) {
          var dc = ds[i]
          dcdatas.push(dc.data)
          meta.draw.push(dc)
        }
        callback.drawPanel.draws(dcdatas)
      }
    }

    DWDpc.history(meta)

    if(callback.drawPanel.intervalNum !=-1){
      clearInterval(callback.drawPanel.intervalNum);
    }
    callback.drawPanel.intervalNum = setInterval(function () {
      callback.drawPanel.interval()
    }, 1000)
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

  //video兼容处理
  function checkVideo() {
    if (!!document.createElement('video').canPlayType) {
      var vidTest = document.createElement('video')
      var oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"')
      if (!oggTest) {
        var h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')
        if (!h264Test) {
          return false
        }
        else {
          if (h264Test == 'probably') {
            return true
          }
          else {
            return false
          }
        }
      }
      else {
        if (oggTest == 'probably') {
          return true
        }
        else {
          return false
        }
      }
    }
    else {
      return false
    }
  }

  var beforeTime = 0
  var nextTime = 0
  // var skipOnceSeek = false;
  var isCustomSeek = true

  var MobileLive = {
    pauseState: false,
    useHls: false,
    init: function (ots) {
      var _this = this

      function getInfo(opts) {
        $.ajax({
          url: '//view.csslcloud.net/api/vod/v2/play/h5',
          type: 'GET',
          dataType: 'jsonp',
          data: {
            userid: opts.userId,
            roomid: opts.roomId,
            recordid: opts.recordId,
            mp4: isMp4
          },
          success: function (data) {
            if (data.isValid === 'false') {
              // 加密视频仍然用flash播放
              DW.isH5play = false
              callback.callbackPlayer.flashPlayerInit()
            } else {
              if (data && data.video && data.video.length > 0) {
                var pvdefault = data.video[0]

                var playurl = pvdefault.playurl
                var secureplayurl = pvdefault.secureplayurl

                var isHttps = window.location.protocol === 'https:'
                if (isHttps && !!secureplayurl) {
                  playurl = secureplayurl
                }
                _this.appendVideo(playurl, opts)
              } else {
                window.on_cc_live_player_load_fail && window.on_cc_live_player_load_fail()
              }
            }
          }

        })
      }

      var isMp4 = 0
      if (!MobileLive.isMobile()) {
        if (DW.isH5play) {
          util.log('浏览器版本是否是IE', util.isIE())
          if (util.isIE()) {
            isMp4 = 1
            this.useHls = false
            // DW.getH5src(opts);
            getInfo(ots)
            return
          } else {
            isMp4 = 0
            this.useHls = true
            var script = document.createElement('script')
            script.src = '//static.csslcloud.net/js/hls.js?v=' + parseInt(Math.random() * 2000, 10)
            script.onload = function () {
              // DW.getH5src(opts);
              getInfo(ots)
            }
            document.body.appendChild(script)
            return
          }
        }
      }
      getInfo(ots)
    },
    destroy:function(){
      if(this.hls){
        this.hls.destroy();
        this.hls=null;
      }
      $("#playbackVideo").remove();

    },
    appendVideo: function (src, opts) {
      var _this = this

      var v = '<video id="playbackVideo" x5-video-player-type="h5-page" webkit-playsinline playsinline controls autoplay x-webkit-airplay="deny" x5-playsinline width="100%" height="100%" src="' + src + '"></video>'
      $('#' + playbackPlayer.id).html(v)
      var playerContainer = document.getElementById(playbackPlayer.id);
      // console.log("当前父容齐对象-》"+playerContainer);
      // playerContainer.innerHTML = v
      var video = document.getElementById('playbackVideo')

      if (this.useHls && !util.isMp4(src)) {
        if (Hls.isSupported()) {
          _this.hls = new Hls()
          _this.hls.attachMedia(video)
          _this.hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            _this.hls.loadSource(src)
          })
        }
      } else {
        $('#playbackVideo').attr('src', src)

      }
      if (opts.isShowBar) {
        video.removeAttribute('controls')
      }

      var isMobie = 0
      var ua = 1
      if (MobileLive.isMobile() == 'isMobile') {
        isMobie = 1
        ua = 11
      }
      var report = new ReportLog(opts, isMobie, ua, video, false)
      if (!this.isAndroid()) {
        this.pauseState = true
      }

      Event.addEvents(video, 'canplay', function () {
        if (MobileLive.isMobile() == 'isMobile') {
          window.on_cc_live_player_load && window.on_cc_live_player_load()
          window.on_cc_h5_player_load && window.on_cc_h5_player_load()
        } else if (DW.isH5play) {
          window.on_cc_live_player_init && window.on_cc_live_player_init()
        }

        if (on_cc_limit_request_draws) {
          var duration = parseInt(callback.callbackPlayer.getDuration())
          if (duration) {
            on_cc_limit_request_draws && on_cc_limit_request_draws()
          } else {
            ListenerDuration && ListenerDuration()
          }
        }

      }, false)

      Event.addEvents(video, 'playing', function () {
        _this.pauseState = false
        window.on_player_start && on_player_start()
        window.on_spark_player_resume && on_spark_player_resume()
      }, false)

      Event.addEvents(video, 'pause', function () {
        _this.pauseState = true
        window.on_spark_player_pause && on_spark_player_pause()
      }, false)

      Event.addEvents(video, 'ended', function () {
        window.on_spark_player_end && on_spark_player_end()
      }, false)

      Event.addEvents(video, 'seeking', function () {
        isCustomSeek = false
        seekStart && seekStart()
      }, false)

      Event.addEvents(video, 'seeked', function () {
        isCustomSeek = false
        seekComplete && seekComplete()
      }, false)
    },

    getDuration: function () {
      var v = document.getElementById('playbackVideo')
      if (!v) {
        return
      }
      return Math.floor(v.duration)
    },

    getPlayerTime: function () {
      var v = document.getElementById('playbackVideo')
      if (!v) {
        return
      }
      return Math.floor(v.currentTime)
    },

    end: function () {
      $('#' + playbackPlayer.id).html('end')
    },

    appendDoc: function (s) {
      var img = '<img src="' + s + '" />'
      $('#' + playbackPanel.id).append(img)
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
  var practice = {
    getReplayPracticeInfo:function (t) {
      $.ajax({
        url: "//eva.csslcloud.net/api/v1/practice/replay/info",
        data: t,
        type: options.type || "GET",
        dataType: options.dataType || "jsonp",
        timeout: options.timeout || 5000,
        success: function (data) {
          // console.log("请求回放随堂测数据-->" + JSON.stringify(data))
          window.on_hdReplay_practice_info&&window.on_hdReplay_practice_info(data);
        },
        error: function (error) {
          window.on_hdReplay_practice_info&&window.on_hdReplay_practice_info(error);
        }
      });
    }
  }


})(jQuery, window, document, undefined)