/**
 * CC playback video
 * v3.0.2 2019/08/07
 * 直播在线剪辑定制sdk 播放器支持video播放m3u8 支持文档
 */
!(function ($, window, document) {
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
    }

    if (!DW.isH5play) {
      this.flashPlayerInit()
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
        t = parseInt(this.getFlash().getPosition(), 10)
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
        return swf.getDuration()
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
        return swf.getBufferLength()
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
        return swf.setVolume(n)
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
        return swf.getVolume()
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
        return swf.isPlay()
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

    if (!DW.forceNew) {
      var socket = io.connect(document.location.protocol + '//' + host + '/replay', {
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

    this.intervalPainting = function (callback) {
      callback.drawPanel.intervalNum = setInterval(function () {
        callback.drawPanel.interval(callback)
      }, 1000)
    }
  }

  //优化meta数据
  var substepRequest = function (opts) {
    var data = {
      'success': true, 'data': {
        'pageChange': [{
          'time': 0,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 0,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档1',
          'serverTime': 1563867724120,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/0.jpg'
        }, {
          'time': 58,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 1,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档2',
          'serverTime': 1563867782040,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/1.jpg'
        }, {
          'time': 59,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 2,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档3',
          'serverTime': 1563867782756,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/2.jpg'
        }, {
          'time': 60,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563867783495,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 60,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563867784094,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 84,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 5,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档6',
          'serverTime': 1563867807585,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/5.jpg'
        }, {
          'time': 93,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 0,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档1',
          'serverTime': 1563867816767,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/0.jpg'
        }, {
          'time': 95,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 1,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档2',
          'serverTime': 1563867819253,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/1.jpg'
        }, {
          'time': 96,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 2,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档3',
          'serverTime': 1563867819864,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/2.jpg'
        }, {
          'time': 99,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563867822933,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 114,
          'mode': 0,
          'docId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'docName': 'WhiteBorad',
          'docTotalPage': 0,
          'pageNum': 1,
          'encryptDocId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'useSDK': false,
          'width': 1000,
          'height': 600,
          'pageTitle': '',
          'serverTime': 1563867838305,
          'url': '#'
        }, {
          'time': 162,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563867885609,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 163,
          'mode': 0,
          'docId': '9A1A9B0C7BAB3721',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': '9A1A9B0C7BAB3721',
          'useSDK': false,
          'width': 1080,
          'height': 410,
          'pageTitle': '',
          'serverTime': 1563867886508,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/9A1A9B0C7BAB3721/0.jpg'
        }, {
          'time': 171,
          'mode': 0,
          'docId': 'B3A62520E544878F',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'B3A62520E544878F',
          'useSDK': false,
          'width': 1280,
          'height': 35,
          'pageTitle': '',
          'serverTime': 1563867895227,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/B3A62520E544878F/0.jpg'
        }, {
          'time': 174,
          'mode': 0,
          'docId': 'C99A9BB4F17955C3',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'C99A9BB4F17955C3',
          'useSDK': false,
          'width': 410,
          'height': 1080,
          'pageTitle': '',
          'serverTime': 1563867897732,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/C99A9BB4F17955C3/0.jpg'
        }, {
          'time': 183,
          'mode': 0,
          'docId': 'B3A62520E544878F',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'B3A62520E544878F',
          'useSDK': false,
          'width': 1280,
          'height': 35,
          'pageTitle': '',
          'serverTime': 1563867906669,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/B3A62520E544878F/0.jpg'
        }, {
          'time': 184,
          'mode': 0,
          'docId': 'C99A9BB4F17955C3',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'C99A9BB4F17955C3',
          'useSDK': false,
          'width': 410,
          'height': 1080,
          'pageTitle': '',
          'serverTime': 1563867907634,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/C99A9BB4F17955C3/0.jpg'
        }, {
          'time': 190,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563867913676,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 192,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563867915423,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 193,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 5,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档6',
          'serverTime': 1563867916700,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/5.jpg'
        }, {
          'time': 195,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563867918426,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 206,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563867929406,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 211,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563867934923,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 212,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563867936108,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 213,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 2,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档3',
          'serverTime': 1563867937011,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/2.jpg'
        }, {
          'time': 215,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 1,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档2',
          'serverTime': 1563867939118,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/1.jpg'
        }, {
          'time': 216,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 0,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档1',
          'serverTime': 1563867939686,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/0.jpg'
        }, {
          'time': 218,
          'mode': 0,
          'docId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'docName': 'WhiteBorad',
          'docTotalPage': 0,
          'pageNum': 1,
          'encryptDocId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'useSDK': false,
          'width': 1000,
          'height': 600,
          'pageTitle': '',
          'serverTime': 1563867942142,
          'url': '#'
        }, {
          'time': 220,
          'mode': 0,
          'docId': 'C99A9BB4F17955C3',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'C99A9BB4F17955C3',
          'useSDK': false,
          'width': 410,
          'height': 1080,
          'pageTitle': '',
          'serverTime': 1563867943488,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/C99A9BB4F17955C3/0.jpg'
        }, {
          'time': 231,
          'mode': 0,
          'docId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'docName': 'WhiteBorad',
          'docTotalPage': 0,
          'pageNum': 1,
          'encryptDocId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'useSDK': false,
          'width': 1000,
          'height': 600,
          'pageTitle': '',
          'serverTime': 1563867955344,
          'url': '#'
        }, {
          'time': 270,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 0,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档1',
          'serverTime': 1563867993862,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/0.jpg'
        }, {
          'time': 271,
          'mode': 0,
          'docId': 'C99A9BB4F17955C3',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'C99A9BB4F17955C3',
          'useSDK': false,
          'width': 410,
          'height': 1080,
          'pageTitle': '',
          'serverTime': 1563867995291,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/C99A9BB4F17955C3/0.jpg'
        }, {
          'time': 573,
          'mode': 0,
          'docId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'docName': 'WhiteBorad',
          'docTotalPage': 0,
          'pageNum': 1,
          'encryptDocId': '{13e1a95e-0c86-4f6f-b01d-b23f817ed132}',
          'useSDK': false,
          'width': 1000,
          'height': 600,
          'pageTitle': '',
          'serverTime': 1563868296801,
          'url': '#'
        }, {
          'time': 581,
          'mode': 0,
          'docId': '9A1A9B0C7BAB3721',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': '9A1A9B0C7BAB3721',
          'useSDK': false,
          'width': 1080,
          'height': 410,
          'pageTitle': '',
          'serverTime': 1563868305379,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/9A1A9B0C7BAB3721/0.jpg'
        }, {
          'time': 584,
          'mode': 0,
          'docId': 'B3A62520E544878F',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'B3A62520E544878F',
          'useSDK': false,
          'width': 1280,
          'height': 35,
          'pageTitle': '',
          'serverTime': 1563868307700,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/B3A62520E544878F/0.jpg'
        }, {
          'time': 587,
          'mode': 0,
          'docId': 'C99A9BB4F17955C3',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'docTotalPage': 1,
          'pageNum': 0,
          'encryptDocId': 'C99A9BB4F17955C3',
          'useSDK': false,
          'width': 410,
          'height': 1080,
          'pageTitle': '',
          'serverTime': 1563868310906,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/C99A9BB4F17955C3/0.jpg'
        }, {
          'time': 599,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 0,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档1',
          'serverTime': 1563868322871,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/0.jpg'
        }, {
          'time': 601,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 1,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档2',
          'serverTime': 1563868324740,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/1.jpg'
        }, {
          'time': 602,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 2,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档3',
          'serverTime': 1563868325797,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/2.jpg'
        }, {
          'time': 603,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 3,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档4',
          'serverTime': 1563868326790,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/3.jpg'
        }, {
          'time': 605,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 4,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档5',
          'serverTime': 1563868328655,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/4.jpg'
        }, {
          'time': 607,
          'mode': 0,
          'docId': 'BCB53EA6D52B7AAE',
          'docName': '动画ppt.pptx',
          'docTotalPage': 6,
          'pageNum': 5,
          'encryptDocId': 'BCB53EA6D52B7AAE',
          'useSDK': false,
          'width': 1800,
          'height': 1013,
          'pageTitle': '动画测试文档6',
          'serverTime': 1563868330453,
          'url': 'http://image.csslcloud.net/image/907DE174D77ED2C39C33DC5901307461/BCB53EA6D52B7AAE/5.jpg'
        }],
        'draw': [{
          'time': 0,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { }, "page" : 0, "thickness" : 5, "type" : 0 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 0,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "page" : 0, "type" : 8 }',
          'docName': '0',
          'pageNum': 0
        }, {
          'time': 2,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.474444", "y" : "0.220138" }, { "x" : "0.446111", "y" : "0.234946" }, { "x" : "0.403889", "y" : "0.260612" }, { "x" : "0.383889", "y" : "0.272458" }, { "x" : "0.368889", "y" : "0.289240" }, { "x" : "0.360000", "y" : "0.307009" }, { "x" : "0.350000", "y" : "0.340573" }, { "x" : "0.349444", "y" : "0.361303" }, { "x" : "0.350000", "y" : "0.384995" }, { "x" : "0.359444", "y" : "0.421520" }, { "x" : "0.378333", "y" : "0.455084" }, { "x" : "0.403889", "y" : "0.483712" }, { "x" : "0.472778", "y" : "0.516288" }], "drawid" : "2019-07-23-15:42:02-731731", "drawtime" : 189, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 3,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.472778", "y" : "0.516288" }, { "x" : "0.542778", "y" : "0.519250" }, { "x" : "0.568333", "y" : "0.510365" }, { "x" : "0.590556", "y" : "0.500494" }, { "x" : "0.610000", "y" : "0.489635" }, { "x" : "0.619444", "y" : "0.483712" }, { "x" : "0.623889", "y" : "0.479763" }, { "x" : "0.625000", "y" : "0.479763" }, { "x" : "0.622222", "y" : "0.482725" }, { "x" : "0.587778", "y" : "0.517275" }, { "x" : "0.549444", "y" : "0.554788" }, { "x" : "0.520000", "y" : "0.584403" }, { "x" : "0.501111", "y" : "0.601185" }, { "x" : "0.493889", "y" : "0.609082" }, { "x" : "0.492778", "y" : "0.611056" }, { "x" : "0.491667", "y" : "0.611056" }], "drawid" : "2019-07-23-15:42:02-731731", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 3,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.491667", "y" : "0.611056" }, { "x" : "0.497778", "y" : "0.598223" }, { "x" : "0.497778", "y" : "0.601185" }, { "x" : "0.488333", "y" : "0.639684" }, { "x" : "0.471111", "y" : "0.680158" }, { "x" : "0.452778", "y" : "0.716683" }, { "x" : "0.407778", "y" : "0.757157" }], "drawid" : "2019-07-23-15:42:02-731731", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 3,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.407778", "y" : "0.757157" }, { "x" : "0.381111", "y" : "0.760118" }, { "x" : "0.354444", "y" : "0.755183" }, { "x" : "0.325000", "y" : "0.733465" }, { "x" : "0.298889", "y" : "0.700888" }, { "x" : "0.279444", "y" : "0.665350" }, { "x" : "0.269444", "y" : "0.637710" }, { "x" : "0.265556", "y" : "0.622902" }, { "x" : "0.265556", "y" : "0.615992" }, { "x" : "0.269444", "y" : "0.604146" }, { "x" : "0.284444", "y" : "0.584403" }, { "x" : "0.316111", "y" : "0.557749" }, { "x" : "0.388333", "y" : "0.510365" }, { "x" : "0.421111", "y" : "0.495558" }, { "x" : "0.447222", "y" : "0.482725" }, { "x" : "0.460556", "y" : "0.475814" }], "drawid" : "2019-07-23-15:42:02-731731", "drawtime" : 191, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 3,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.460556", "y" : "0.475814" }, { "x" : "0.468333", "y" : "0.474827" }, { "x" : "0.468889", "y" : "0.472853" }], "drawid" : "2019-07-23-15:42:02-731731", "drawtime" : 64, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 4,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.348333", "y" : "0.448174" }, { "x" : "0.347778", "y" : "0.449161" }, { "x" : "0.347778", "y" : "0.453110" }, { "x" : "0.347778", "y" : "0.456071" }, { "x" : "0.347778", "y" : "0.469891" }, { "x" : "0.347778", "y" : "0.486673" }, { "x" : "0.349444", "y" : "0.512340" }, { "x" : "0.350556", "y" : "0.546890" }, { "x" : "0.353889", "y" : "0.577493" }, { "x" : "0.357778", "y" : "0.595262" }, { "x" : "0.361667", "y" : "0.607108" }, { "x" : "0.378333", "y" : "0.617966" }, { "x" : "0.393333", "y" : "0.617966" }, { "x" : "0.412778", "y" : "0.617966" }, { "x" : "0.435556", "y" : "0.615005" }], "drawid" : "2019-07-23-15:42:04-105105", "drawtime" : 197, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 4,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.435556", "y" : "0.615005" }, { "x" : "0.458889", "y" : "0.608095" }, { "x" : "0.486111", "y" : "0.598223" }, { "x" : "0.516111", "y" : "0.585390" }, { "x" : "0.547222", "y" : "0.567621" }, { "x" : "0.577778", "y" : "0.549852" }, { "x" : "0.603889", "y" : "0.537019" }, { "x" : "0.623333", "y" : "0.526160" }, { "x" : "0.636667", "y" : "0.520237" }, { "x" : "0.645000", "y" : "0.516288" }, { "x" : "0.651667", "y" : "0.514314" }, { "x" : "0.654444", "y" : "0.512340" }, { "x" : "0.655556", "y" : "0.512340" }, { "x" : "0.656111", "y" : "0.512340" }, { "x" : "0.656111", "y" : "0.510365" }, { "x" : "0.656111", "y" : "0.509378" }, { "x" : "0.656111", "y" : "0.507404" }, { "x" : "0.655556", "y" : "0.506417" }], "drawid" : "2019-07-23-15:42:04-105105", "drawtime" : 207, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 4,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.655556", "y" : "0.506417" }, { "x" : "0.654444", "y" : "0.500494" }, { "x" : "0.650556", "y" : "0.489635" }, { "x" : "0.648333", "y" : "0.475814" }, { "x" : "0.646111", "y" : "0.461007" }, { "x" : "0.643889", "y" : "0.446199" }, { "x" : "0.642222", "y" : "0.434353" }, { "x" : "0.639444", "y" : "0.424482" }, { "x" : "0.638333", "y" : "0.414610" }, { "x" : "0.635000", "y" : "0.407700" }, { "x" : "0.627778", "y" : "0.399803" }, { "x" : "0.616111", "y" : "0.394867" }, { "x" : "0.598333", "y" : "0.391905" }, { "x" : "0.541111", "y" : "0.391905" }, { "x" : "0.510000", "y" : "0.399803" }, { "x" : "0.480000", "y" : "0.406713" }], "drawid" : "2019-07-23-15:42:04-105105", "drawtime" : 201, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 4,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.480000", "y" : "0.406713" }, { "x" : "0.453889", "y" : "0.418559" }, { "x" : "0.428333", "y" : "0.431392" }, { "x" : "0.411667", "y" : "0.444225" }, { "x" : "0.397778", "y" : "0.458045" }, { "x" : "0.386667", "y" : "0.467917" }, { "x" : "0.378333", "y" : "0.478776" }, { "x" : "0.371111", "y" : "0.488648" }, { "x" : "0.365556", "y" : "0.498519" }, { "x" : "0.362778", "y" : "0.505429" }, { "x" : "0.360000", "y" : "0.513327" }, { "x" : "0.359444", "y" : "0.520237" }, { "x" : "0.358889", "y" : "0.526160" }, { "x" : "0.357778", "y" : "0.536032" }, { "x" : "0.357778", "y" : "0.550839" }, { "x" : "0.357778", "y" : "0.566634" }, { "x" : "0.357222", "y" : "0.580454" }], "drawid" : "2019-07-23-15:42:04-105105", "drawtime" : 206, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 4,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.357222", "y" : "0.580454" }, { "x" : "0.357222", "y" : "0.591313" }, { "x" : "0.357222", "y" : "0.597236" }, { "x" : "0.357778", "y" : "0.601185" }], "drawid" : "2019-07-23-15:42:04-105105", "drawtime" : 39, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 6,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.793333", "y" : "0.770977" }, { "x" : "0.793889", "y" : "0.775913" }, { "x" : "0.798889", "y" : "0.795656" }, { "x" : "0.799444", "y" : "0.801579" }, { "x" : "0.800000", "y" : "0.802567" }, { "x" : "0.800000", "y" : "0.804541" }, { "x" : "0.800000", "y" : "0.805528" }, { "x" : "0.800000", "y" : "0.806515" }, { "x" : "0.801111", "y" : "0.808490" }, { "x" : "0.801667", "y" : "0.809477" }, { "x" : "0.802778", "y" : "0.812438" }, { "x" : "0.803333", "y" : "0.815400" }, { "x" : "0.803889", "y" : "0.818361" }, { "x" : "0.803889", "y" : "0.821323" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 401, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 6,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.803889", "y" : "0.821323" }, { "x" : "0.805000", "y" : "0.822310" }, { "x" : "0.805556", "y" : "0.823297" }, { "x" : "0.805556", "y" : "0.826259" }, { "x" : "0.807222", "y" : "0.828233" }, { "x" : "0.808333", "y" : "0.830207" }, { "x" : "0.808889", "y" : "0.833169" }, { "x" : "0.810556", "y" : "0.835143" }, { "x" : "0.811111", "y" : "0.837117" }, { "x" : "0.812222", "y" : "0.839092" }, { "x" : "0.813333", "y" : "0.840079" }, { "x" : "0.814444", "y" : "0.842053" }, { "x" : "0.816111", "y" : "0.845015" }, { "x" : "0.816667", "y" : "0.846002" }, { "x" : "0.817222", "y" : "0.846989" }, { "x" : "0.818333", "y" : "0.848963" }, { "x" : "0.820000", "y" : "0.851925" }, { "x" : "0.821111", "y" : "0.852912" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 198, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 6,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.821111", "y" : "0.852912" }, { "x" : "0.822222", "y" : "0.855874" }, { "x" : "0.823889", "y" : "0.856861" }, { "x" : "0.823889", "y" : "0.859822" }, { "x" : "0.825556", "y" : "0.860809" }, { "x" : "0.826111", "y" : "0.862784" }, { "x" : "0.826667", "y" : "0.865745" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 6,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.826667", "y" : "0.865745" }, { "x" : "0.829444", "y" : "0.865745" }, { "x" : "0.832222", "y" : "0.866732" }, { "x" : "0.836111", "y" : "0.867720" }, { "x" : "0.839444", "y" : "0.869694" }, { "x" : "0.843333", "y" : "0.870681" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 7,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.843333", "y" : "0.870681" }, { "x" : "0.845556", "y" : "0.873643" }, { "x" : "0.847778", "y" : "0.875617" }, { "x" : "0.851111", "y" : "0.876604" }, { "x" : "0.852778", "y" : "0.876604" }, { "x" : "0.854444", "y" : "0.877591" }, { "x" : "0.855556", "y" : "0.879566" }, { "x" : "0.858333", "y" : "0.879566" }, { "x" : "0.860556", "y" : "0.880553" }, { "x" : "0.862778", "y" : "0.880553" }, { "x" : "0.864444", "y" : "0.880553" }, { "x" : "0.866111", "y" : "0.880553" }, { "x" : "0.867778", "y" : "0.880553" }, { "x" : "0.870000", "y" : "0.880553" }, { "x" : "0.871667", "y" : "0.882527" }, { "x" : "0.872778", "y" : "0.882527" }, { "x" : "0.874444", "y" : "0.882527" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 197, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 7,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.874444", "y" : "0.882527" }, { "x" : "0.875556", "y" : "0.882527" }, { "x" : "0.877778", "y" : "0.882527" }, { "x" : "0.879444", "y" : "0.882527" }, { "x" : "0.880000", "y" : "0.882527" }, { "x" : "0.881667", "y" : "0.882527" }, { "x" : "0.883889", "y" : "0.882527" }, { "x" : "0.885556", "y" : "0.882527" }, { "x" : "0.887222", "y" : "0.882527" }, { "x" : "0.888889", "y" : "0.882527" }, { "x" : "0.891111", "y" : "0.882527" }, { "x" : "0.893333", "y" : "0.882527" }, { "x" : "0.895556", "y" : "0.882527" }, { "x" : "0.898333", "y" : "0.880553" }, { "x" : "0.899444", "y" : "0.879566" }, { "x" : "0.902222", "y" : "0.877591" }, { "x" : "0.903333", "y" : "0.877591" }, { "x" : "0.906111", "y" : "0.877591" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 201, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 7,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.906111", "y" : "0.877591" }, { "x" : "0.908333", "y" : "0.876604" }, { "x" : "0.910000", "y" : "0.875617" }, { "x" : "0.912222", "y" : "0.873643" }, { "x" : "0.913889", "y" : "0.872655" }, { "x" : "0.916111", "y" : "0.872655" }, { "x" : "0.916667", "y" : "0.870681" }, { "x" : "0.918333", "y" : "0.870681" }, { "x" : "0.919444", "y" : "0.869694" }, { "x" : "0.920000", "y" : "0.869694" }, { "x" : "0.920000", "y" : "0.867720" }, { "x" : "0.920556", "y" : "0.867720" }, { "x" : "0.921667", "y" : "0.865745" }, { "x" : "0.923333", "y" : "0.863771" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 205, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 7,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.923333", "y" : "0.863771" }, { "x" : "0.923889", "y" : "0.860809" }, { "x" : "0.926111", "y" : "0.856861" }, { "x" : "0.927222", "y" : "0.853899" }, { "x" : "0.929444", "y" : "0.851925" }, { "x" : "0.930000", "y" : "0.846989" }, { "x" : "0.932778", "y" : "0.843040" }, { "x" : "0.933333", "y" : "0.840079" }, { "x" : "0.935000", "y" : "0.836130" }, { "x" : "0.935556", "y" : "0.835143" }, { "x" : "0.937222", "y" : "0.832182" }, { "x" : "0.937778", "y" : "0.828233" }, { "x" : "0.939444", "y" : "0.825271" }, { "x" : "0.940556", "y" : "0.822310" }, { "x" : "0.942222", "y" : "0.818361" }, { "x" : "0.942778", "y" : "0.815400" }, { "x" : "0.943333", "y" : "0.812438" }, { "x" : "0.944444", "y" : "0.809477" }, { "x" : "0.945000", "y" : "0.806515" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 206, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 7,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.945000", "y" : "0.806515" }, { "x" : "0.945000", "y" : "0.805528" }, { "x" : "0.945000", "y" : "0.801579" }, { "x" : "0.946111", "y" : "0.797631" }, { "x" : "0.946667", "y" : "0.788746" }, { "x" : "0.948333", "y" : "0.774926" }, { "x" : "0.948333", "y" : "0.768016" }, { "x" : "0.948333", "y" : "0.764067" }, { "x" : "0.948333", "y" : "0.760118" }, { "x" : "0.948333", "y" : "0.755183" }, { "x" : "0.948333", "y" : "0.752221" }, { "x" : "0.948333", "y" : "0.748272" }, { "x" : "0.948333", "y" : "0.744324" }, { "x" : "0.948889", "y" : "0.740375" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 202, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 8,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.948889", "y" : "0.740375" }, { "x" : "0.948889", "y" : "0.738401" }, { "x" : "0.948889", "y" : "0.730503" }, { "x" : "0.948889", "y" : "0.726555" }, { "x" : "0.950000", "y" : "0.721619" }, { "x" : "0.950000", "y" : "0.719645" }, { "x" : "0.950000", "y" : "0.716683" }, { "x" : "0.950556", "y" : "0.714709" }, { "x" : "0.950556", "y" : "0.713722" }, { "x" : "0.950556", "y" : "0.712734" }, { "x" : "0.950556", "y" : "0.710760" }, { "x" : "0.950556", "y" : "0.707799" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 411, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 8,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.950556", "y" : "0.707799" }, { "x" : "0.950556", "y" : "0.706811" }, { "x" : "0.950556", "y" : "0.703850" }, { "x" : "0.950000", "y" : "0.702863" }, { "x" : "0.950000", "y" : "0.700888" }, { "x" : "0.948889", "y" : "0.700888" }, { "x" : "0.948889", "y" : "0.698914" }, { "x" : "0.948333", "y" : "0.696940" }, { "x" : "0.947222", "y" : "0.693978" }, { "x" : "0.946667", "y" : "0.693978" }, { "x" : "0.946667", "y" : "0.692991" }, { "x" : "0.946667", "y" : "0.691017" }, { "x" : "0.946111", "y" : "0.690030" }, { "x" : "0.945000", "y" : "0.690030" }, { "x" : "0.944444", "y" : "0.689042" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 8,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.944444", "y" : "0.689042" }, { "x" : "0.944444", "y" : "0.687068" }, { "x" : "0.943333", "y" : "0.687068" }, { "x" : "0.942778", "y" : "0.686081" }, { "x" : "0.941111", "y" : "0.684107" }, { "x" : "0.940556", "y" : "0.683119" }, { "x" : "0.939444", "y" : "0.682132" }, { "x" : "0.937778", "y" : "0.682132" }, { "x" : "0.937222", "y" : "0.680158" }, { "x" : "0.935556", "y" : "0.679171" }, { "x" : "0.933333", "y" : "0.677196" }, { "x" : "0.931667", "y" : "0.677196" }, { "x" : "0.930000", "y" : "0.677196" }, { "x" : "0.928889", "y" : "0.676209" }, { "x" : "0.926111", "y" : "0.676209" }, { "x" : "0.923333", "y" : "0.676209" }, { "x" : "0.920556", "y" : "0.676209" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 198, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 9,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.920556", "y" : "0.676209" }, { "x" : "0.917778", "y" : "0.676209" }, { "x" : "0.915556", "y" : "0.676209" }, { "x" : "0.912778", "y" : "0.676209" }, { "x" : "0.911667", "y" : "0.676209" }, { "x" : "0.908889", "y" : "0.676209" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 193, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 9,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.908889", "y" : "0.676209" }, { "x" : "0.906111", "y" : "0.676209" }, { "x" : "0.901111", "y" : "0.676209" }, { "x" : "0.895000", "y" : "0.676209" }, { "x" : "0.889444", "y" : "0.676209" }, { "x" : "0.883889", "y" : "0.676209" }, { "x" : "0.879444", "y" : "0.676209" }, { "x" : "0.876111", "y" : "0.676209" }, { "x" : "0.873889", "y" : "0.676209" }, { "x" : "0.872222", "y" : "0.676209" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 9,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.872222", "y" : "0.676209" }, { "x" : "0.870556", "y" : "0.676209" }, { "x" : "0.868889", "y" : "0.676209" }, { "x" : "0.867778", "y" : "0.676209" }, { "x" : "0.866111", "y" : "0.676209" }, { "x" : "0.864444", "y" : "0.676209" }, { "x" : "0.862778", "y" : "0.676209" }, { "x" : "0.860556", "y" : "0.677196" }, { "x" : "0.858333", "y" : "0.677196" }, { "x" : "0.856667", "y" : "0.679171" }, { "x" : "0.855000", "y" : "0.680158" }, { "x" : "0.853333", "y" : "0.680158" }, { "x" : "0.850556", "y" : "0.682132" }, { "x" : "0.848889", "y" : "0.683119" }, { "x" : "0.847778", "y" : "0.684107" }, { "x" : "0.846667", "y" : "0.684107" }, { "x" : "0.845000", "y" : "0.684107" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 199, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 9,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.845000", "y" : "0.684107" }, { "x" : "0.843333", "y" : "0.686081" }, { "x" : "0.842778", "y" : "0.687068" }, { "x" : "0.841111", "y" : "0.687068" }, { "x" : "0.839444", "y" : "0.689042" }, { "x" : "0.837778", "y" : "0.689042" }, { "x" : "0.836111", "y" : "0.690030" }, { "x" : "0.833333", "y" : "0.692991" }, { "x" : "0.831667", "y" : "0.693978" }, { "x" : "0.830000", "y" : "0.693978" }, { "x" : "0.830000", "y" : "0.695953" }, { "x" : "0.828333", "y" : "0.695953" }, { "x" : "0.827778", "y" : "0.695953" }, { "x" : "0.825556", "y" : "0.695953" }, { "x" : "0.824444", "y" : "0.696940" }, { "x" : "0.822222", "y" : "0.698914" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 203, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 9,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.822222", "y" : "0.698914" }, { "x" : "0.820556", "y" : "0.699901" }, { "x" : "0.818333", "y" : "0.699901" }, { "x" : "0.817222", "y" : "0.699901" }, { "x" : "0.815000", "y" : "0.700888" }, { "x" : "0.815000", "y" : "0.702863" }, { "x" : "0.813333", "y" : "0.702863" }, { "x" : "0.812222", "y" : "0.702863" }, { "x" : "0.811111", "y" : "0.702863" }, { "x" : "0.810556", "y" : "0.703850" }, { "x" : "0.809444", "y" : "0.705824" }, { "x" : "0.808889", "y" : "0.705824" }, { "x" : "0.807222", "y" : "0.705824" }, { "x" : "0.806667", "y" : "0.705824" }, { "x" : "0.805000", "y" : "0.706811" }, { "x" : "0.803333", "y" : "0.707799" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 199, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 10,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.803333", "y" : "0.707799" }, { "x" : "0.802778", "y" : "0.707799" }, { "x" : "0.801667", "y" : "0.707799" }, { "x" : "0.801111", "y" : "0.707799" }, { "x" : "0.800000", "y" : "0.709773" }, { "x" : "0.800000", "y" : "0.710760" }, { "x" : "0.799444", "y" : "0.710760" }, { "x" : "0.799444", "y" : "0.712734" }, { "x" : "0.798889", "y" : "0.712734" }, { "x" : "0.798889", "y" : "0.713722" }, { "x" : "0.797778", "y" : "0.714709" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 202, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 10,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.797778", "y" : "0.714709" }, { "x" : "0.797778", "y" : "0.716683" }, { "x" : "0.797222", "y" : "0.717670" }, { "x" : "0.797222", "y" : "0.719645" }, { "x" : "0.796111", "y" : "0.720632" }, { "x" : "0.796111", "y" : "0.721619" }, { "x" : "0.796111", "y" : "0.723593" }, { "x" : "0.796111", "y" : "0.726555" }, { "x" : "0.795556", "y" : "0.727542" }, { "x" : "0.795556", "y" : "0.729516" }, { "x" : "0.795556", "y" : "0.730503" }, { "x" : "0.795556", "y" : "0.731491" }, { "x" : "0.795556", "y" : "0.733465" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 216, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 10,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.795556", "y" : "0.733465" }, { "x" : "0.795556", "y" : "0.737414" }, { "x" : "0.795556", "y" : "0.738401" }, { "x" : "0.795556", "y" : "0.741362" }, { "x" : "0.795556", "y" : "0.743337" }, { "x" : "0.795556", "y" : "0.744324" }, { "x" : "0.795556", "y" : "0.745311" }, { "x" : "0.795556", "y" : "0.747285" }, { "x" : "0.795556", "y" : "0.748272" }, { "x" : "0.795556", "y" : "0.751234" }, { "x" : "0.795556", "y" : "0.752221" }, { "x" : "0.795556", "y" : "0.754195" }, { "x" : "0.795556", "y" : "0.757157" }, { "x" : "0.795556", "y" : "0.760118" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 189, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 10,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.795556", "y" : "0.760118" }, { "x" : "0.795556", "y" : "0.762093" }, { "x" : "0.795556", "y" : "0.765054" }, { "x" : "0.795556", "y" : "0.767029" }, { "x" : "0.795556", "y" : "0.769003" }, { "x" : "0.795556", "y" : "0.770977" }, { "x" : "0.795000", "y" : "0.770977" }, { "x" : "0.795000", "y" : "0.771964" }, { "x" : "0.793889", "y" : "0.774926" }, { "x" : "0.793889", "y" : "0.775913" }, { "x" : "0.793889", "y" : "0.778875" }, { "x" : "0.793333", "y" : "0.780849" }, { "x" : "0.792222", "y" : "0.781836" }], "drawid" : "2019-07-23-15:42:05-986986", "drawtime" : 203, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 11,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.803333", "y" : "0.707799" }, { "x" : "0.802778", "y" : "0.707799" }, { "x" : "0.803333", "y" : "0.707799" }, { "x" : "0.803889", "y" : "0.707799" }, { "x" : "0.809444", "y" : "0.707799" }, { "x" : "0.811111", "y" : "0.707799" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 197, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 11,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.811111", "y" : "0.707799" }, { "x" : "0.813333", "y" : "0.707799" }, { "x" : "0.815000", "y" : "0.706811" }, { "x" : "0.817222", "y" : "0.705824" }, { "x" : "0.818889", "y" : "0.705824" }, { "x" : "0.820556", "y" : "0.703850" }, { "x" : "0.822222", "y" : "0.702863" }, { "x" : "0.823889", "y" : "0.700888" }, { "x" : "0.825556", "y" : "0.700888" }, { "x" : "0.826667", "y" : "0.699901" }, { "x" : "0.827778", "y" : "0.698914" }, { "x" : "0.829444", "y" : "0.696940" }, { "x" : "0.830556", "y" : "0.696940" }, { "x" : "0.831667", "y" : "0.696940" }, { "x" : "0.832222", "y" : "0.696940" }, { "x" : "0.833889", "y" : "0.696940" }, { "x" : "0.834444", "y" : "0.696940" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 11,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.834444", "y" : "0.696940" }, { "x" : "0.835556", "y" : "0.696940" }, { "x" : "0.837222", "y" : "0.696940" }, { "x" : "0.839444", "y" : "0.696940" }, { "x" : "0.841111", "y" : "0.696940" }, { "x" : "0.841667", "y" : "0.696940" }, { "x" : "0.842778", "y" : "0.696940" }, { "x" : "0.843889", "y" : "0.696940" }, { "x" : "0.845556", "y" : "0.696940" }, { "x" : "0.847222", "y" : "0.698914" }, { "x" : "0.848889", "y" : "0.699901" }, { "x" : "0.850556", "y" : "0.699901" }, { "x" : "0.851667", "y" : "0.699901" }, { "x" : "0.852778", "y" : "0.700888" }, { "x" : "0.854444", "y" : "0.700888" }, { "x" : "0.855556", "y" : "0.700888" }, { "x" : "0.856667", "y" : "0.700888" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 209, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 12,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.856667", "y" : "0.700888" }, { "x" : "0.857222", "y" : "0.700888" }, { "x" : "0.858889", "y" : "0.700888" }, { "x" : "0.860000", "y" : "0.700888" }, { "x" : "0.862222", "y" : "0.700888" }, { "x" : "0.863889", "y" : "0.700888" }, { "x" : "0.865000", "y" : "0.700888" }, { "x" : "0.866667", "y" : "0.699901" }, { "x" : "0.868889", "y" : "0.698914" }, { "x" : "0.870000", "y" : "0.696940" }, { "x" : "0.870556", "y" : "0.696940" }, { "x" : "0.872222", "y" : "0.695953" }, { "x" : "0.872778", "y" : "0.693978" }, { "x" : "0.874444", "y" : "0.693978" }, { "x" : "0.875556", "y" : "0.692991" }, { "x" : "0.877222", "y" : "0.691017" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 192, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 12,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.877222", "y" : "0.691017" }, { "x" : "0.879444", "y" : "0.690030" }, { "x" : "0.881111", "y" : "0.690030" }, { "x" : "0.881667", "y" : "0.689042" }, { "x" : "0.886111", "y" : "0.684107" }, { "x" : "0.890556", "y" : "0.683119" }, { "x" : "0.895000", "y" : "0.680158" }, { "x" : "0.898889", "y" : "0.677196" }, { "x" : "0.902222", "y" : "0.676209" }, { "x" : "0.906111", "y" : "0.675222" }, { "x" : "0.910000", "y" : "0.672261" }, { "x" : "0.913889", "y" : "0.670286" }, { "x" : "0.917778", "y" : "0.670286" }, { "x" : "0.920556", "y" : "0.669299" }, { "x" : "0.925000", "y" : "0.668312" }, { "x" : "0.927778", "y" : "0.666338" }, { "x" : "0.931111", "y" : "0.665350" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 12,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.931111", "y" : "0.665350" }, { "x" : "0.935000", "y" : "0.665350" }, { "x" : "0.942778", "y" : "0.663376" }, { "x" : "0.948333", "y" : "0.662389" }, { "x" : "0.952222", "y" : "0.660415" }, { "x" : "0.954444", "y" : "0.660415" }, { "x" : "0.956667", "y" : "0.659427" }, { "x" : "0.959444", "y" : "0.658440" }, { "x" : "0.960556", "y" : "0.656466" }, { "x" : "0.962222", "y" : "0.656466" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 202, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 13,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.962222", "y" : "0.656466" }, { "x" : "0.962222", "y" : "0.658440" }, { "x" : "0.962222", "y" : "0.659427" }, { "x" : "0.962222", "y" : "0.660415" }, { "x" : "0.962222", "y" : "0.662389" }, { "x" : "0.962222", "y" : "0.663376" }, { "x" : "0.962222", "y" : "0.665350" }, { "x" : "0.962222", "y" : "0.666338" }, { "x" : "0.962222", "y" : "0.668312" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 1014, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 13,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.962222", "y" : "0.668312" }, { "x" : "0.962222", "y" : "0.672261" }, { "x" : "0.962222", "y" : "0.673248" }, { "x" : "0.962222", "y" : "0.676209" }, { "x" : "0.962222", "y" : "0.677196" }, { "x" : "0.962222", "y" : "0.682132" }, { "x" : "0.962222", "y" : "0.683119" }, { "x" : "0.962222", "y" : "0.686081" }, { "x" : "0.962222", "y" : "0.687068" }, { "x" : "0.962222", "y" : "0.690030" }, { "x" : "0.962222", "y" : "0.691017" }, { "x" : "0.962222", "y" : "0.692991" }, { "x" : "0.962222", "y" : "0.696940" }, { "x" : "0.962222", "y" : "0.698914" }, { "x" : "0.961667", "y" : "0.700888" }, { "x" : "0.961667", "y" : "0.702863" }, { "x" : "0.961667", "y" : "0.705824" }, { "x" : "0.961667", "y" : "0.707799" }, { "x" : "0.961667", "y" : "0.710760" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 224, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 13,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.961667", "y" : "0.710760" }, { "x" : "0.961667", "y" : "0.713722" }, { "x" : "0.961667", "y" : "0.717670" }, { "x" : "0.961667", "y" : "0.721619" }, { "x" : "0.960556", "y" : "0.726555" }, { "x" : "0.960556", "y" : "0.729516" }, { "x" : "0.960556", "y" : "0.733465" }, { "x" : "0.960556", "y" : "0.737414" }, { "x" : "0.960556", "y" : "0.741362" }, { "x" : "0.960556", "y" : "0.744324" }, { "x" : "0.960556", "y" : "0.747285" }, { "x" : "0.960556", "y" : "0.751234" }, { "x" : "0.960556", "y" : "0.752221" }, { "x" : "0.960556", "y" : "0.754195" }, { "x" : "0.960556", "y" : "0.755183" }, { "x" : "0.961667", "y" : "0.757157" }, { "x" : "0.962222", "y" : "0.760118" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 186, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 14,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.962222", "y" : "0.760118" }, { "x" : "0.965556", "y" : "0.760118" }], "drawid" : "2019-07-23-15:42:11-236236", "drawtime" : 197, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 14,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.900556", "y" : "0.641658" }, { "x" : "0.900556", "y" : "0.642646" }, { "x" : "0.900556", "y" : "0.644620" }, { "x" : "0.900556", "y" : "0.645607" }, { "x" : "0.901111", "y" : "0.646594" }, { "x" : "0.902222", "y" : "0.648569" }, { "x" : "0.902778", "y" : "0.648569" }, { "x" : "0.904444", "y" : "0.651530" }, { "x" : "0.905000", "y" : "0.651530" }, { "x" : "0.907778", "y" : "0.652517" }, { "x" : "0.908333", "y" : "0.652517" }, { "x" : "0.910000", "y" : "0.655479" }, { "x" : "0.911667", "y" : "0.655479" }, { "x" : "0.912222", "y" : "0.656466" }, { "x" : "0.912778", "y" : "0.658440" }, { "x" : "0.913889", "y" : "0.658440" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 206, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 14,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.913889", "y" : "0.658440" }, { "x" : "0.914444", "y" : "0.659427" }, { "x" : "0.914444", "y" : "0.660415" }, { "x" : "0.915556", "y" : "0.660415" }, { "x" : "0.916111", "y" : "0.660415" }, { "x" : "0.917778", "y" : "0.660415" }, { "x" : "0.918333", "y" : "0.660415" }, { "x" : "0.920000", "y" : "0.660415" }, { "x" : "0.920556", "y" : "0.660415" }, { "x" : "0.922222", "y" : "0.660415" }, { "x" : "0.923333", "y" : "0.660415" }, { "x" : "0.923889", "y" : "0.660415" }, { "x" : "0.925556", "y" : "0.660415" }, { "x" : "0.926111", "y" : "0.660415" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 196, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 15,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.926111", "y" : "0.660415" }, { "x" : "0.928889", "y" : "0.662389" }, { "x" : "0.929444", "y" : "0.662389" }, { "x" : "0.930000", "y" : "0.662389" }, { "x" : "0.931667", "y" : "0.662389" }, { "x" : "0.932778", "y" : "0.663376" }, { "x" : "0.933333", "y" : "0.663376" }, { "x" : "0.933889", "y" : "0.663376" }, { "x" : "0.935556", "y" : "0.665350" }, { "x" : "0.937222", "y" : "0.666338" }, { "x" : "0.937778", "y" : "0.668312" }, { "x" : "0.938889", "y" : "0.668312" }, { "x" : "0.940556", "y" : "0.670286" }, { "x" : "0.942222", "y" : "0.672261" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 220, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 15,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.942222", "y" : "0.672261" }, { "x" : "0.943333", "y" : "0.675222" }, { "x" : "0.945000", "y" : "0.677196" }, { "x" : "0.945000", "y" : "0.679171" }, { "x" : "0.946667", "y" : "0.680158" }, { "x" : "0.947222", "y" : "0.682132" }, { "x" : "0.948889", "y" : "0.684107" }, { "x" : "0.950000", "y" : "0.687068" }, { "x" : "0.951111", "y" : "0.689042" }, { "x" : "0.951111", "y" : "0.690030" }, { "x" : "0.952222", "y" : "0.690030" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 186, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 15,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.952222", "y" : "0.690030" }, { "x" : "0.952222", "y" : "0.692991" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 200, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 15,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.952222", "y" : "0.692991" }, { "x" : "0.953889", "y" : "0.699901" }, { "x" : "0.961667", "y" : "0.716683" }, { "x" : "0.964444", "y" : "0.723593" }, { "x" : "0.966111", "y" : "0.729516" }, { "x" : "0.968333", "y" : "0.733465" }, { "x" : "0.970000", "y" : "0.737414" }, { "x" : "0.970000", "y" : "0.738401" }, { "x" : "0.970000", "y" : "0.740375" }, { "x" : "0.970000", "y" : "0.741362" }, { "x" : "0.971111", "y" : "0.744324" }, { "x" : "0.971111", "y" : "0.745311" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 217, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 15,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.971111", "y" : "0.745311" }, { "x" : "0.971111", "y" : "0.748272" }, { "x" : "0.971111", "y" : "0.752221" }, { "x" : "0.971111", "y" : "0.755183" }, { "x" : "0.971111", "y" : "0.758144" }, { "x" : "0.971111", "y" : "0.760118" }, { "x" : "0.971111", "y" : "0.762093" }, { "x" : "0.971111", "y" : "0.765054" }, { "x" : "0.971111", "y" : "0.768016" }, { "x" : "0.971111", "y" : "0.773939" }, { "x" : "0.967778", "y" : "0.785785" }, { "x" : "0.966111", "y" : "0.791708" }, { "x" : "0.964444", "y" : "0.798618" }, { "x" : "0.962222", "y" : "0.802567" }, { "x" : "0.961667", "y" : "0.806515" }, { "x" : "0.960556", "y" : "0.811451" }, { "x" : "0.960000", "y" : "0.814413" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 206, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 16,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.960000", "y" : "0.814413" }, { "x" : "0.959444", "y" : "0.816387" }, { "x" : "0.957778", "y" : "0.819348" }, { "x" : "0.956667", "y" : "0.822310" }, { "x" : "0.956111", "y" : "0.826259" }, { "x" : "0.954444", "y" : "0.829220" }, { "x" : "0.952778", "y" : "0.835143" }, { "x" : "0.951111", "y" : "0.840079" }, { "x" : "0.950000", "y" : "0.846002" }, { "x" : "0.947222", "y" : "0.849951" }, { "x" : "0.946667", "y" : "0.855874" }, { "x" : "0.943333", "y" : "0.859822" }, { "x" : "0.942222", "y" : "0.860809" }, { "x" : "0.940556", "y" : "0.863771" }, { "x" : "0.939444", "y" : "0.863771" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 187, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 16,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.939444", "y" : "0.863771" }, { "x" : "0.938889", "y" : "0.865745" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 200, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 16,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.938889", "y" : "0.865745" }, { "x" : "0.935000", "y" : "0.865745" }, { "x" : "0.928889", "y" : "0.865745" }, { "x" : "0.921667", "y" : "0.865745" }, { "x" : "0.912778", "y" : "0.866732" }, { "x" : "0.906111", "y" : "0.867720" }, { "x" : "0.900556", "y" : "0.870681" }, { "x" : "0.894444", "y" : "0.873643" }, { "x" : "0.889444", "y" : "0.876604" }, { "x" : "0.886111", "y" : "0.877591" }, { "x" : "0.883333", "y" : "0.877591" }, { "x" : "0.881111", "y" : "0.879566" }, { "x" : "0.877222", "y" : "0.879566" }, { "x" : "0.873889", "y" : "0.879566" }, { "x" : "0.871667", "y" : "0.880553" }, { "x" : "0.868333", "y" : "0.880553" }, { "x" : "0.865000", "y" : "0.880553" }, { "x" : "0.862222", "y" : "0.880553" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 213, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 16,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.862222", "y" : "0.880553" }, { "x" : "0.858889", "y" : "0.882527" }, { "x" : "0.855556", "y" : "0.882527" }, { "x" : "0.851111", "y" : "0.882527" }, { "x" : "0.847222", "y" : "0.882527" }, { "x" : "0.842778", "y" : "0.880553" }, { "x" : "0.838333", "y" : "0.876604" }, { "x" : "0.833889", "y" : "0.872655" }, { "x" : "0.829444", "y" : "0.866732" }, { "x" : "0.824444", "y" : "0.859822" }, { "x" : "0.818333", "y" : "0.853899" }, { "x" : "0.813333", "y" : "0.848963" }, { "x" : "0.809444", "y" : "0.840079" }, { "x" : "0.801667", "y" : "0.822310" }, { "x" : "0.798889", "y" : "0.814413" }, { "x" : "0.796111", "y" : "0.809477" }, { "x" : "0.795556", "y" : "0.806515" }], "drawid" : "2019-07-23-15:42:14-520520", "drawtime" : 211, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 18,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.960556", "y" : "0.498519" }, { "x" : "0.959444", "y" : "0.498519" }, { "x" : "0.954444", "y" : "0.498519" }, { "x" : "0.952222", "y" : "0.498519" }, { "x" : "0.950000", "y" : "0.499506" }, { "x" : "0.946667", "y" : "0.502468" }, { "x" : "0.944444", "y" : "0.505429" }, { "x" : "0.943333", "y" : "0.506417" }, { "x" : "0.942778", "y" : "0.507404" }, { "x" : "0.942222", "y" : "0.509378" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 408, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 18,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.942222", "y" : "0.509378" }, { "x" : "0.941111", "y" : "0.510365" }, { "x" : "0.939444", "y" : "0.512340" }, { "x" : "0.939444", "y" : "0.514314" }, { "x" : "0.937778", "y" : "0.516288" }, { "x" : "0.937778", "y" : "0.519250" }, { "x" : "0.937222", "y" : "0.519250" }, { "x" : "0.937222", "y" : "0.520237" }, { "x" : "0.937222", "y" : "0.523198" }, { "x" : "0.937222", "y" : "0.526160" }, { "x" : "0.937222", "y" : "0.527147" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 196, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 19,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.937222", "y" : "0.527147" }, { "x" : "0.937222", "y" : "0.529121" }, { "x" : "0.937778", "y" : "0.530109" }, { "x" : "0.938889", "y" : "0.530109" }, { "x" : "0.939444", "y" : "0.531096" }, { "x" : "0.940556", "y" : "0.533070" }, { "x" : "0.941111", "y" : "0.533070" }, { "x" : "0.942222", "y" : "0.533070" }, { "x" : "0.942778", "y" : "0.534057" }, { "x" : "0.943333", "y" : "0.534057" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 207, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 19,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.943333", "y" : "0.534057" }, { "x" : "0.945000", "y" : "0.537019" }, { "x" : "0.946667", "y" : "0.537019" }, { "x" : "0.947222", "y" : "0.537019" }, { "x" : "0.948333", "y" : "0.537019" }, { "x" : "0.948889", "y" : "0.537019" }, { "x" : "0.950000", "y" : "0.537019" }, { "x" : "0.950556", "y" : "0.537019" }, { "x" : "0.952222", "y" : "0.537019" }, { "x" : "0.952778", "y" : "0.537019" }, { "x" : "0.953889", "y" : "0.537019" }, { "x" : "0.955000", "y" : "0.538006" }, { "x" : "0.956111", "y" : "0.538006" }, { "x" : "0.956667", "y" : "0.538006" }, { "x" : "0.957778", "y" : "0.538006" }, { "x" : "0.958333", "y" : "0.538006" }, { "x" : "0.959444", "y" : "0.538006" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 199, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 19,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.959444", "y" : "0.538006" }, { "x" : "0.960000", "y" : "0.538006" }, { "x" : "0.960556", "y" : "0.538006" }, { "x" : "0.961667", "y" : "0.538006" }, { "x" : "0.962222", "y" : "0.538006" }, { "x" : "0.963333", "y" : "0.538006" }, { "x" : "0.963889", "y" : "0.538006" }, { "x" : "0.965556", "y" : "0.538006" }, { "x" : "0.966111", "y" : "0.537019" }, { "x" : "0.966111", "y" : "0.536032" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 19,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.966111", "y" : "0.536032" }, { "x" : "0.967778", "y" : "0.533070" }, { "x" : "0.968333", "y" : "0.531096" }, { "x" : "0.970000", "y" : "0.527147" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 19,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.970000", "y" : "0.527147" }, { "x" : "0.970000", "y" : "0.526160" }, { "x" : "0.970000", "y" : "0.524186" }, { "x" : "0.970000", "y" : "0.523198" }, { "x" : "0.970000", "y" : "0.522211" }, { "x" : "0.970000", "y" : "0.520237" }, { "x" : "0.970000", "y" : "0.519250" }, { "x" : "0.970000", "y" : "0.517275" }, { "x" : "0.970000", "y" : "0.516288" }, { "x" : "0.970000", "y" : "0.514314" }, { "x" : "0.970000", "y" : "0.513327" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 205, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 20,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.970000", "y" : "0.513327" }, { "x" : "0.970000", "y" : "0.512340" }, { "x" : "0.970000", "y" : "0.510365" }, { "x" : "0.971111", "y" : "0.510365" }, { "x" : "0.971111", "y" : "0.507404" }, { "x" : "0.971111", "y" : "0.506417" }, { "x" : "0.971111", "y" : "0.505429" }, { "x" : "0.971111", "y" : "0.503455" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 20,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.971111", "y" : "0.503455" }, { "x" : "0.971111", "y" : "0.500494" }, { "x" : "0.971111", "y" : "0.499506" }, { "x" : "0.971111", "y" : "0.498519" }, { "x" : "0.971111", "y" : "0.496545" }, { "x" : "0.971111", "y" : "0.495558" }, { "x" : "0.971111", "y" : "0.493583" }, { "x" : "0.971111", "y" : "0.492596" }, { "x" : "0.971111", "y" : "0.491609" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 200, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 20,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.971111", "y" : "0.491609" }, { "x" : "0.970000", "y" : "0.491609" }, { "x" : "0.969444", "y" : "0.491609" }, { "x" : "0.968333", "y" : "0.491609" }, { "x" : "0.967778", "y" : "0.491609" }, { "x" : "0.967222", "y" : "0.489635" }, { "x" : "0.966111", "y" : "0.489635" }, { "x" : "0.964444", "y" : "0.489635" }, { "x" : "0.963889", "y" : "0.489635" }, { "x" : "0.963333", "y" : "0.489635" }, { "x" : "0.962222", "y" : "0.489635" }, { "x" : "0.961667", "y" : "0.489635" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 201, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 20,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.961667", "y" : "0.489635" }, { "x" : "0.960556", "y" : "0.489635" }, { "x" : "0.959444", "y" : "0.489635" }, { "x" : "0.957778", "y" : "0.489635" }, { "x" : "0.956111", "y" : "0.489635" }, { "x" : "0.955000", "y" : "0.489635" }, { "x" : "0.954444", "y" : "0.489635" }, { "x" : "0.953889", "y" : "0.491609" }, { "x" : "0.953889", "y" : "0.492596" }, { "x" : "0.952778", "y" : "0.492596" }, { "x" : "0.952222", "y" : "0.492596" }, { "x" : "0.952222", "y" : "0.493583" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 211, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 20,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.952222", "y" : "0.493583" }, { "x" : "0.951111", "y" : "0.493583" }, { "x" : "0.950556", "y" : "0.493583" }, { "x" : "0.950556", "y" : "0.495558" }, { "x" : "0.950000", "y" : "0.495558" }, { "x" : "0.948889", "y" : "0.495558" }, { "x" : "0.948889", "y" : "0.496545" }, { "x" : "0.948889", "y" : "0.498519" }, { "x" : "0.948333", "y" : "0.499506" }, { "x" : "0.947222", "y" : "0.500494" }, { "x" : "0.946667", "y" : "0.502468" }, { "x" : "0.946667", "y" : "0.503455" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 199, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 21,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.946667", "y" : "0.503455" }, { "x" : "0.946111", "y" : "0.503455" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 198, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 21,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.946111", "y" : "0.503455" }, { "x" : "0.946667", "y" : "0.503455" }, { "x" : "0.947222", "y" : "0.503455" }, { "x" : "0.948333", "y" : "0.502468" }, { "x" : "0.948889", "y" : "0.500494" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 202, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 21,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.948889", "y" : "0.500494" }, { "x" : "0.951111", "y" : "0.499506" }, { "x" : "0.952778", "y" : "0.496545" }, { "x" : "0.953889", "y" : "0.496545" }, { "x" : "0.954444", "y" : "0.496545" }, { "x" : "0.955000", "y" : "0.496545" }, { "x" : "0.955000", "y" : "0.495558" }, { "x" : "0.956111", "y" : "0.495558" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 202, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 21,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.956111", "y" : "0.495558" }, { "x" : "0.957778", "y" : "0.493583" }, { "x" : "0.958333", "y" : "0.493583" }, { "x" : "0.959444", "y" : "0.493583" }, { "x" : "0.960000", "y" : "0.493583" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 208, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 21,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.960000", "y" : "0.493583" }, { "x" : "0.960556", "y" : "0.493583" }], "drawid" : "2019-07-23-15:42:18-354354", "drawtime" : 205, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 22,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.463333", "y" : "0.204344" }, { "x" : "0.455556", "y" : "0.208292" }, { "x" : "0.451667", "y" : "0.211254" }, { "x" : "0.451111", "y" : "0.213228" }, { "x" : "0.451111", "y" : "0.214215" }, { "x" : "0.451111", "y" : "0.215202" }, { "x" : "0.453333", "y" : "0.215202" }, { "x" : "0.458333", "y" : "0.215202" }, { "x" : "0.468889", "y" : "0.215202" }, { "x" : "0.487778", "y" : "0.208292" }, { "x" : "0.514444", "y" : "0.201382" }, { "x" : "0.544444", "y" : "0.194472" }, { "x" : "0.596111", "y" : "0.175716" }, { "x" : "0.609444", "y" : "0.168806" }, { "x" : "0.616111", "y" : "0.166831" }, { "x" : "0.618333", "y" : "0.165844" }], "drawid" : "2019-07-23-15:42:22-758758", "drawtime" : 204, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 23,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.618333", "y" : "0.165844" }, { "x" : "0.618333", "y" : "0.166831" }, { "x" : "0.618333", "y" : "0.168806" }, { "x" : "0.618333", "y" : "0.170780" }, { "x" : "0.618333", "y" : "0.172754" }, { "x" : "0.619444", "y" : "0.175716" }, { "x" : "0.625000", "y" : "0.182626" }, { "x" : "0.631667", "y" : "0.190523" }, { "x" : "0.642222", "y" : "0.200395" }, { "x" : "0.653889", "y" : "0.208292" }, { "x" : "0.662222", "y" : "0.215202" }, { "x" : "0.669444", "y" : "0.220138" }, { "x" : "0.673333", "y" : "0.224087" }, { "x" : "0.674444", "y" : "0.225074" }], "drawid" : "2019-07-23-15:42:22-758758", "drawtime" : 193, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 23,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.674444", "y" : "0.225074" }, { "x" : "0.675556", "y" : "0.228036" }, { "x" : "0.677222", "y" : "0.237907" }, { "x" : "0.678889", "y" : "0.251728" }, { "x" : "0.678889", "y" : "0.261599" }, { "x" : "0.678889", "y" : "0.267522" }, { "x" : "0.678889", "y" : "0.268509" }, { "x" : "0.678889", "y" : "0.269497" }, { "x" : "0.678889", "y" : "0.268509" }], "drawid" : "2019-07-23-15:42:22-758758", "drawtime" : 199, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 26,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.147222", "y" : "0.898322" }, { "x" : "0.256667", "y" : "0.695953" }, { "x" : "0.280556", "y" : "0.652517" }, { "x" : "0.283333", "y" : "0.645607" }, { "x" : "0.283333", "y" : "0.644620" }], "drawid" : "2019-07-23-15:42:26-842842", "drawtime" : 92, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 27,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.244444", "y" : "0.634748" }, { "x" : "0.223333", "y" : "0.612043" }, { "x" : "0.220000", "y" : "0.598223" }, { "x" : "0.218333", "y" : "0.580454" }], "drawid" : "2019-07-23-15:42:27-028028", "drawtime" : 55, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 27,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.252778", "y" : "0.352419" }, { "x" : "0.252778", "y" : "0.354393" }], "drawid" : "2019-07-23-15:42:27-195195", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 27,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.263333", "y" : "0.366239" }, { "x" : "0.268333", "y" : "0.374136" }, { "x" : "0.281667", "y" : "0.415597" }, { "x" : "0.288333", "y" : "0.444225" }, { "x" : "0.291111", "y" : "0.472853" }, { "x" : "0.293889", "y" : "0.506417" }], "drawid" : "2019-07-23-15:42:27-355355", "drawtime" : 76, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 27,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.297778", "y" : "0.673248" }, { "x" : "0.296667", "y" : "0.686081" }, { "x" : "0.295000", "y" : "0.700888" }, { "x" : "0.291111", "y" : "0.714709" }, { "x" : "0.287222", "y" : "0.729516" }, { "x" : "0.282778", "y" : "0.745311" }, { "x" : "0.276667", "y" : "0.762093" }], "drawid" : "2019-07-23-15:42:27-527527", "drawtime" : 74, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 27,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.227222", "y" : "0.798618" }, { "x" : "0.212778", "y" : "0.788746" }, { "x" : "0.200556", "y" : "0.775913" }, { "x" : "0.185556", "y" : "0.750247" }, { "x" : "0.173889", "y" : "0.721619" }, { "x" : "0.161111", "y" : "0.684107" }, { "x" : "0.151667", "y" : "0.639684" }, { "x" : "0.145000", "y" : "0.591313" }], "drawid" : "2019-07-23-15:42:27-699699", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.168333", "y" : "0.322804" }, { "x" : "0.188889", "y" : "0.281343" }, { "x" : "0.208333", "y" : "0.250740" }, { "x" : "0.216111", "y" : "0.245805" }, { "x" : "0.223333", "y" : "0.243830" }, { "x" : "0.231111", "y" : "0.243830" }, { "x" : "0.237222", "y" : "0.244817" }, { "x" : "0.244444", "y" : "0.250740" }, { "x" : "0.252222", "y" : "0.257651" }, { "x" : "0.260000", "y" : "0.268509" }, { "x" : "0.269444", "y" : "0.276407" }, { "x" : "0.277778", "y" : "0.285291" }, { "x" : "0.289444", "y" : "0.298124" }, { "x" : "0.304444", "y" : "0.309970" }, { "x" : "0.341667", "y" : "0.340573" }, { "x" : "0.359444", "y" : "0.353406" }], "drawid" : "2019-07-23-15:42:27-896896", "drawtime" : 205, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.359444", "y" : "0.353406" }, { "x" : "0.373333", "y" : "0.363277" }, { "x" : "0.385000", "y" : "0.370188" }, { "x" : "0.392222", "y" : "0.374136" }, { "x" : "0.398333", "y" : "0.377098" }, { "x" : "0.401667", "y" : "0.380059" }], "drawid" : "2019-07-23-15:42:27-896896", "drawtime" : 54, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.401667", "y" : "0.386969" }, { "x" : "0.401667", "y" : "0.388944" }], "drawid" : "2019-07-23-15:42:28-236236", "drawtime" : 106, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.556111", "y" : "0.367226" }, { "x" : "0.589444", "y" : "0.361303" }, { "x" : "0.642778", "y" : "0.352419" }, { "x" : "0.661667", "y" : "0.350444" }, { "x" : "0.674444", "y" : "0.350444" }, { "x" : "0.685000", "y" : "0.350444" }, { "x" : "0.692778", "y" : "0.352419" }, { "x" : "0.698333", "y" : "0.356367" }, { "x" : "0.703333", "y" : "0.360316" }], "drawid" : "2019-07-23-15:42:28-434434", "drawtime" : 111, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.731111", "y" : "0.411649" }, { "x" : "0.734444", "y" : "0.422507" }, { "x" : "0.736111", "y" : "0.437315" }, { "x" : "0.738333", "y" : "0.449161" }, { "x" : "0.738333", "y" : "0.461994" }, { "x" : "0.738333", "y" : "0.475814" }, { "x" : "0.736111", "y" : "0.512340" }], "drawid" : "2019-07-23-15:42:28-619619", "drawtime" : 94, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 28,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.674444", "y" : "0.655479" }, { "x" : "0.671667", "y" : "0.658440" }], "drawid" : "2019-07-23-15:42:28-801801", "drawtime" : 84, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 29,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.439444", "y" : "0.780849" }, { "x" : "0.431667", "y" : "0.790721" }, { "x" : "0.426667", "y" : "0.798618" }, { "x" : "0.421111", "y" : "0.809477" }, { "x" : "0.416667", "y" : "0.821323" }, { "x" : "0.411667", "y" : "0.829220" }, { "x" : "0.407222", "y" : "0.836130" }, { "x" : "0.403333", "y" : "0.843040" }, { "x" : "0.399444", "y" : "0.846989" }, { "x" : "0.397778", "y" : "0.849951" }], "drawid" : "2019-07-23-15:42:29-158158", "drawtime" : 107, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 29,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.385000", "y" : "0.876604" }, { "x" : "0.385000", "y" : "0.877591" }, { "x" : "0.388333", "y" : "0.876604" }, { "x" : "0.396111", "y" : "0.873643" }, { "x" : "0.410556", "y" : "0.867720" }, { "x" : "0.428333", "y" : "0.866732" }, { "x" : "0.447778", "y" : "0.863771" }], "drawid" : "2019-07-23-15:42:29-353353", "drawtime" : 112, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 29,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.569444", "y" : "0.774926" }, { "x" : "0.616111", "y" : "0.705824" }, { "x" : "0.622222", "y" : "0.695953" }, { "x" : "0.625556", "y" : "0.693978" }, { "x" : "0.632778", "y" : "0.689042" }], "drawid" : "2019-07-23-15:42:29-564564", "drawtime" : 96, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 29,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.678889", "y" : "0.637710" }, { "x" : "0.682778", "y" : "0.632774" }, { "x" : "0.686111", "y" : "0.631787" }, { "x" : "0.690556", "y" : "0.627838" }, { "x" : "0.694444", "y" : "0.625864" }, { "x" : "0.702222", "y" : "0.621915" }], "drawid" : "2019-07-23-15:42:29-746746", "drawtime" : 85, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 29,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.724444", "y" : "0.614018" }, { "x" : "0.724444", "y" : "0.615992" }], "drawid" : "2019-07-23-15:42:29-928928", "drawtime" : 72, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 30,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.743889", "y" : "0.604146" }, { "x" : "0.761111", "y" : "0.598223" }, { "x" : "0.812778", "y" : "0.575518" }, { "x" : "0.841667", "y" : "0.554788" }, { "x" : "0.870556", "y" : "0.533070" }, { "x" : "0.898333", "y" : "0.506417" }], "drawid" : "2019-07-23-15:42:30-114114", "drawtime" : 71, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 30,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.922222", "y" : "0.425469" }, { "x" : "0.887778", "y" : "0.366239" }, { "x" : "0.871667", "y" : "0.322804" }, { "x" : "0.856667", "y" : "0.284304" }, { "x" : "0.843333", "y" : "0.248766" }, { "x" : "0.834444", "y" : "0.217177" }, { "x" : "0.826667", "y" : "0.190523" }], "drawid" : "2019-07-23-15:42:30-286286", "drawtime" : 90, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 30,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.818333", "y" : "0.169793" }, { "x" : "0.818333", "y" : "0.171767" }], "drawid" : "2019-07-23-15:42:30-467467", "drawtime" : 85, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 30,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.749444", "y" : "0.158934" }, { "x" : "0.672778", "y" : "0.136229" }, { "x" : "0.638889", "y" : "0.125370" }, { "x" : "0.605000", "y" : "0.118460" }, { "x" : "0.576111", "y" : "0.112537" }, { "x" : "0.554444", "y" : "0.112537" }, { "x" : "0.537778", "y" : "0.115499" }, { "x" : "0.525556", "y" : "0.121422" }], "drawid" : "2019-07-23-15:42:30-653653", "drawtime" : 95, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 30,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.514444", "y" : "0.129319" }, { "x" : "0.514444", "y" : "0.131293" }], "drawid" : "2019-07-23-15:42:30-839839", "drawtime" : 78, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 31,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.405556", "y" : "0.163870" }, { "x" : "0.333333", "y" : "0.187562" }, { "x" : "0.282778", "y" : "0.217177" }, { "x" : "0.267222", "y" : "0.227048" }], "drawid" : "2019-07-23-15:42:31-035035", "drawtime" : 64, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 34,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.248889", "y" : "0.903258" }, { "x" : "0.248333", "y" : "0.903258" }, { "x" : "0.247222", "y" : "0.901283" }, { "x" : "0.246111", "y" : "0.901283" }, { "x" : "0.239444", "y" : "0.897335" }, { "x" : "0.235556", "y" : "0.893386" }, { "x" : "0.229444", "y" : "0.887463" }], "drawid" : "2019-07-23-15:42:34-718718", "drawtime" : 132, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.148889", "y" : "0.755183" }, { "x" : "0.139444", "y" : "0.734452" }, { "x" : "0.127778", "y" : "0.709773" }, { "x" : "0.122222", "y" : "0.700888" }, { "x" : "0.118333", "y" : "0.695953" }, { "x" : "0.116111", "y" : "0.691017" }, { "x" : "0.114444", "y" : "0.689042" }, { "x" : "0.113333", "y" : "0.689042" }], "drawid" : "2019-07-23-15:42:34-932932", "drawtime" : 96, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.112778", "y" : "0.687068" }, { "x" : "0.112778", "y" : "0.689042" }], "drawid" : "2019-07-23-15:42:35-138138", "drawtime" : 121, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.126111", "y" : "0.609082" }, { "x" : "0.126111", "y" : "0.605133" }, { "x" : "0.126111", "y" : "0.602172" }, { "x" : "0.125556", "y" : "0.597236" }, { "x" : "0.122778", "y" : "0.577493" }, { "x" : "0.122222", "y" : "0.557749" }, { "x" : "0.121111", "y" : "0.531096" }, { "x" : "0.121111", "y" : "0.488648" }], "drawid" : "2019-07-23-15:42:35-336336", "drawtime" : 95, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.150556", "y" : "0.296150" }, { "x" : "0.160556", "y" : "0.284304" }, { "x" : "0.175556", "y" : "0.268509" }, { "x" : "0.191667", "y" : "0.257651" }, { "x" : "0.208333", "y" : "0.241856" }, { "x" : "0.218333", "y" : "0.231984" }, { "x" : "0.225556", "y" : "0.223100" }, { "x" : "0.230000", "y" : "0.217177" }, { "x" : "0.231667", "y" : "0.215202" }], "drawid" : "2019-07-23-15:42:35-533533", "drawtime" : 100, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.231667", "y" : "0.214215" }, { "x" : "0.231667", "y" : "0.216190" }], "drawid" : "2019-07-23-15:42:35-726726", "drawtime" : 84, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 35,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.267778", "y" : "0.179664" }, { "x" : "0.289444", "y" : "0.162883" }, { "x" : "0.318889", "y" : "0.145114" }, { "x" : "0.346667", "y" : "0.129319" }, { "x" : "0.376111", "y" : "0.114511" }, { "x" : "0.403889", "y" : "0.099704" }, { "x" : "0.428333", "y" : "0.084896" }, { "x" : "0.453333", "y" : "0.075025" }], "drawid" : "2019-07-23-15:42:35-913913", "drawtime" : 83, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 36,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.543333", "y" : "0.050346" }, { "x" : "0.545556", "y" : "0.050346" }, { "x" : "0.546667", "y" : "0.050346" }], "drawid" : "2019-07-23-15:42:36-102102", "drawtime" : 90, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 36,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.722778", "y" : "0.034551" }, { "x" : "0.744444", "y" : "0.034551" }, { "x" : "0.786111", "y" : "0.043435" }, { "x" : "0.801111", "y" : "0.048371" }, { "x" : "0.824444", "y" : "0.061204" }, { "x" : "0.832222", "y" : "0.065153" }], "drawid" : "2019-07-23-15:42:36-509509", "drawtime" : 67, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 36,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.877222", "y" : "0.092794" }, { "x" : "0.877222", "y" : "0.094768" }], "drawid" : "2019-07-23-15:42:36-696696", "drawtime" : 83, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 37,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.963333", "y" : "0.356367" }, { "x" : "0.964444", "y" : "0.367226" }, { "x" : "0.966111", "y" : "0.376111" }, { "x" : "0.967778", "y" : "0.381046" }], "drawid" : "2019-07-23-15:42:37-082082", "drawtime" : 72, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 37,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.967778", "y" : "0.381046" }, { "x" : "0.967778", "y" : "0.384995" }], "drawid" : "2019-07-23-15:42:37-249249", "drawtime" : 78, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 37,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.969444", "y" : "0.520237" }, { "x" : "0.969444", "y" : "0.538006" }, { "x" : "0.968333", "y" : "0.547878" }, { "x" : "0.967778", "y" : "0.561698" }, { "x" : "0.966111", "y" : "0.577493" }, { "x" : "0.965556", "y" : "0.594274" }, { "x" : "0.963889", "y" : "0.614018" }], "drawid" : "2019-07-23-15:42:37-446446", "drawtime" : 89, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 37,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.957778", "y" : "0.687068" }, { "x" : "0.957778", "y" : "0.689042" }], "drawid" : "2019-07-23-15:42:37-640640", "drawtime" : 92, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 38,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.726111", "y" : "0.915104" }, { "x" : "0.707222", "y" : "0.920039" }, { "x" : "0.690000", "y" : "0.923988" }, { "x" : "0.682778", "y" : "0.924975" }, { "x" : "0.676667", "y" : "0.927937" }, { "x" : "0.671667", "y" : "0.928924" }, { "x" : "0.667778", "y" : "0.933860" }, { "x" : "0.665556", "y" : "0.936821" }], "drawid" : "2019-07-23-15:42:38-034034", "drawtime" : 106, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 38,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.663889", "y" : "0.940770" }, { "x" : "0.663889", "y" : "0.942744" }], "drawid" : "2019-07-23-15:42:38-253253", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 38,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.555000", "y" : "0.938796" }, { "x" : "0.529444", "y" : "0.938796" }, { "x" : "0.517778", "y" : "0.938796" }, { "x" : "0.505556", "y" : "0.938796" }, { "x" : "0.497222", "y" : "0.938796" }, { "x" : "0.491667", "y" : "0.940770" }, { "x" : "0.487222", "y" : "0.940770" }, { "x" : "0.484444", "y" : "0.940770" }], "drawid" : "2019-07-23-15:42:38-451451", "drawtime" : 97, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 38,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.476111", "y" : "0.945706" }, { "x" : "0.476111", "y" : "0.947680" }], "drawid" : "2019-07-23-15:42:38-657657", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 38,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.487222", "y" : "0.890424" }, { "x" : "0.496667", "y" : "0.822310" }, { "x" : "0.500556", "y" : "0.791708" }, { "x" : "0.502778", "y" : "0.751234" }, { "x" : "0.502778", "y" : "0.736426" }, { "x" : "0.503333", "y" : "0.721619" }], "drawid" : "2019-07-23-15:42:38-856856", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 39,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.521667", "y" : "0.580454" }, { "x" : "0.521667", "y" : "0.571570" }, { "x" : "0.521667", "y" : "0.566634" }], "drawid" : "2019-07-23-15:42:39-082082", "drawtime" : 58, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 39,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.521667", "y" : "0.566634" }, { "x" : "0.521667", "y" : "0.556762" }, { "x" : "0.521667", "y" : "0.539980" }], "drawid" : "2019-07-23-15:42:39-259259", "drawtime" : 83, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 39,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.508889", "y" : "0.378085" }, { "x" : "0.508333", "y" : "0.374136" }, { "x" : "0.507222", "y" : "0.370188" }, { "x" : "0.505556", "y" : "0.364265" }, { "x" : "0.504444", "y" : "0.357354" }, { "x" : "0.502778", "y" : "0.349457" }, { "x" : "0.500556", "y" : "0.342547" }, { "x" : "0.497778", "y" : "0.333662" }, { "x" : "0.495000", "y" : "0.325765" }], "drawid" : "2019-07-23-15:42:39-457457", "drawtime" : 114, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 39,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.442222", "y" : "0.279368" }, { "x" : "0.435556", "y" : "0.279368" }, { "x" : "0.408889", "y" : "0.295163" }, { "x" : "0.399444", "y" : "0.305035" }, { "x" : "0.390556", "y" : "0.315893" }, { "x" : "0.381111", "y" : "0.326752" }, { "x" : "0.373333", "y" : "0.337611" }, { "x" : "0.366667", "y" : "0.347483" }, { "x" : "0.361667", "y" : "0.356367" }], "drawid" : "2019-07-23-15:42:39-689689", "drawtime" : 105, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 39,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.338889", "y" : "0.451135" }, { "x" : "0.338889", "y" : "0.467917" }, { "x" : "0.338889", "y" : "0.483712" }, { "x" : "0.338889", "y" : "0.505429" }, { "x" : "0.340556", "y" : "0.523198" }, { "x" : "0.346111", "y" : "0.538006" }, { "x" : "0.352222", "y" : "0.552813" }, { "x" : "0.360000", "y" : "0.564659" }, { "x" : "0.367778", "y" : "0.575518" }, { "x" : "0.378333", "y" : "0.583416" }, { "x" : "0.387778", "y" : "0.587364" }], "drawid" : "2019-07-23-15:42:39-885885", "drawtime" : 127, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 40,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.537222", "y" : "0.568608" }, { "x" : "0.552778", "y" : "0.559724" }, { "x" : "0.566667", "y" : "0.546890" }, { "x" : "0.582778", "y" : "0.537019" }, { "x" : "0.596667", "y" : "0.527147" }, { "x" : "0.608333", "y" : "0.519250" }, { "x" : "0.623889", "y" : "0.509378" }, { "x" : "0.635556", "y" : "0.502468" }, { "x" : "0.646667", "y" : "0.495558" }], "drawid" : "2019-07-23-15:42:40-106106", "drawtime" : 98, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 40,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.732222", "y" : "0.468904" }, { "x" : "0.740000", "y" : "0.468904" }, { "x" : "0.748333", "y" : "0.467917" }, { "x" : "0.756111", "y" : "0.467917" }, { "x" : "0.762778", "y" : "0.465943" }, { "x" : "0.767222", "y" : "0.465943" }, { "x" : "0.769444", "y" : "0.465943" }, { "x" : "0.771111", "y" : "0.464956" }, { "x" : "0.772222", "y" : "0.464956" }], "drawid" : "2019-07-23-15:42:40-313313", "drawtime" : 104, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 40,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.772222", "y" : "0.464956" }, { "x" : "0.772222", "y" : "0.466930" }], "drawid" : "2019-07-23-15:42:40-514514", "drawtime" : 78, "height" : 1013, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 43,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.070556", "y" : "0.910168" }, { "x" : "0.095556", "y" : "0.849951" }, { "x" : "0.153333", "y" : "0.720632" }, { "x" : "0.176111", "y" : "0.673248" }, { "x" : "0.199444", "y" : "0.620928" }, { "x" : "0.204444", "y" : "0.612043" }, { "x" : "0.208333", "y" : "0.607108" }, { "x" : "0.211667", "y" : "0.601185" }, { "x" : "0.215556", "y" : "0.594274" }], "drawid" : "2019-07-23-15:42:43-443443", "drawtime" : 120, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 43,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.271111", "y" : "0.531096" }, { "x" : "0.279444", "y" : "0.526160" }, { "x" : "0.287222", "y" : "0.519250" }, { "x" : "0.302778", "y" : "0.513327" }, { "x" : "0.309444", "y" : "0.512340" }, { "x" : "0.315000", "y" : "0.510365" }, { "x" : "0.320000", "y" : "0.510365" }], "drawid" : "2019-07-23-15:42:43-663663", "drawtime" : 72, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 43,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.340556", "y" : "0.513327" }, { "x" : "0.345556", "y" : "0.517275" }, { "x" : "0.348333", "y" : "0.520237" }, { "x" : "0.353333", "y" : "0.524186" }, { "x" : "0.357222", "y" : "0.531096" }, { "x" : "0.361111", "y" : "0.537019" }, { "x" : "0.365556", "y" : "0.542942" }, { "x" : "0.371111", "y" : "0.549852" }], "drawid" : "2019-07-23-15:42:43-783783", "drawtime" : 99, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 44,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.387778", "y" : "0.703850" }, { "x" : "0.375000", "y" : "0.747285" }, { "x" : "0.353889", "y" : "0.792695" }, { "x" : "0.345556", "y" : "0.811451" }, { "x" : "0.336111", "y" : "0.823297" }, { "x" : "0.328889", "y" : "0.833169" }], "drawid" : "2019-07-23-15:42:43-980980", "drawtime" : 82, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 44,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.228889", "y" : "0.792695" }, { "x" : "0.182222", "y" : "0.714709" }, { "x" : "0.172222", "y" : "0.684107" }, { "x" : "0.166667", "y" : "0.653504" }, { "x" : "0.165000", "y" : "0.614018" }, { "x" : "0.167778", "y" : "0.566634" }], "drawid" : "2019-07-23-15:42:44-165165", "drawtime" : 83, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 44,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.318889", "y" : "0.243830" }, { "x" : "0.345556", "y" : "0.230010" }, { "x" : "0.368889", "y" : "0.220138" }, { "x" : "0.390000", "y" : "0.213228" }, { "x" : "0.411667", "y" : "0.211254" }, { "x" : "0.432222", "y" : "0.208292" }, { "x" : "0.453889", "y" : "0.208292" }, { "x" : "0.474444", "y" : "0.207305" }], "drawid" : "2019-07-23-15:42:44-348348", "drawtime" : 84, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 44,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.510556", "y" : "0.220138" }, { "x" : "0.510556", "y" : "0.228036" }], "drawid" : "2019-07-23-15:42:44-542542", "drawtime" : 85, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 44,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.575000", "y" : "0.255676" }, { "x" : "0.596667", "y" : "0.271471" }, { "x" : "0.638333", "y" : "0.288253" }, { "x" : "0.652778", "y" : "0.293189" }, { "x" : "0.663889", "y" : "0.296150" }, { "x" : "0.671667", "y" : "0.299112" }], "drawid" : "2019-07-23-15:42:44-936936", "drawtime" : 73, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 45,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.776667", "y" : "0.461007" }, { "x" : "0.776667", "y" : "0.471866" }, { "x" : "0.776667", "y" : "0.482725" }, { "x" : "0.776667", "y" : "0.495558" }, { "x" : "0.773333", "y" : "0.510365" }, { "x" : "0.771111", "y" : "0.530109" }, { "x" : "0.767222", "y" : "0.544916" }], "drawid" : "2019-07-23-15:42:45-292292", "drawtime" : 74, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 45,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "BCB53EA6D52B7AAE", "draw" : [{ "x" : "0.708889", "y" : "0.321816" }, { "x" : "0.728333", "y" : "0.337611" }, { "x" : "0.736111", "y" : "0.346496" }, { "x" : "0.743333", "y" : "0.356367" }, { "x" : "0.751111", "y" : "0.367226" }], "drawid" : "2019-07-23-15:42:45-123123", "drawtime" : 72, "height" : 1013, "page" : "0", "thickness" : 8, "type" : 2, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 0
        }, {
          'time': 51,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 438, "page" : 0, "pos" : [1003497782, 997665565, 990194882, 982593001, 975318826, 968765455, 963719279, 959787177, 957362389], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 51,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 642, "page" : 0, "pos" : [953823490, 952709391, 951398678, 949891356, 947859746, 945565986, 943141154, 940912930, 938225954, 933769513, 929640745, 926298409, 922956073, 921841961, 921448745], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 51,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 201, "msec" : 843, "page" : 0, "pos" : [922169641], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 52,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 240, "msec" : 83, "page" : 0, "pos" : [921448745, 920334633, 918434089, 916599081, 915484969, 914698537, 914370857, 913977641, 913191202, 912863522, 912077090, 911356194, 910635298, 909455650], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 52,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 189, "msec" : 273, "page" : 0, "pos" : [907620642, 904999215, 902770998, 900870460, 899035459, 896807247, 894906710, 892285283, 889663855, 886321532, 883700099, 881865097, 880357775, 879243663, 878129551, 877015439, 875114895], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 52,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 200, "msec" : 473, "page" : 0, "pos" : [872493455], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 52,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 197, "msec" : 670, "page" : 0, "pos" : [871903638, 869609891, 868168131, 863646198, 858468925, 851718851, 842740541, 836055959, 827077653], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 52,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 876, "page" : 0, "pos" : [825570354, 824063052, 821834856, 820327554, 817378466, 815084738, 812135650, 809121030, 804009270, 793589103, 784610726, 775632365, 763704896, 756233869, 745748237], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 53,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 80, "page" : 0, "pos" : [738277242, 735393706, 732444634, 732444675, 732444695, 732444709, 729430064, 729430069, 729430072], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 53,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 203, "msec" : 283, "page" : 0, "pos" : [729430087], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 53,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 487, "page" : 0, "pos" : [726480988, 726481008, 726481033, 726481055, 726481077, 726481101, 726481124, 726481143, 726481162, 729430303, 735394097, 738277699, 744241491, 747256161, 753219953, 760691076], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 53,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 200, "msec" : 687, "page" : 0, "pos" : [778647977, 789068219, 799553996, 807614942, 811350507, 815086072, 818100737, 820328968, 822557195, 824850958], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 54,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 205, "msec" : 91, "page" : 0, "pos" : [827800088, 838285873, 842742336, 847264334, 850999901, 856177254, 859912819, 863648382, 866663046, 870398606, 872888982, 874396317, 876624547, 878852776, 881474221, 884488882], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 54,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 201, "msec" : 292, "page" : 0, "pos" : [887110327, 890452669, 894188226, 897530567, 901266125, 904608464, 908344019, 911358679, 913980120, 916601563, 918436573, 919943903, 920664800], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 54,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 205, "msec" : 498, "page" : 0, "pos" : [922172128, 925579997], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 54,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 201, "msec" : 699, "page" : 0, "pos" : [930429656, 936393426, 942619336, 946158271, 948976309, 951401131, 953236133, 954546845, 955857555, 956775051, 957954690, 958872186, 959593074, 960510568, 961296992, 962017880, 962607701], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 54,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 202, "msec" : 901, "page" : 0, "pos" : [963131979, 963525189, 964246075, 965032499, 966539814, 968178201, 969685518, 971192829, 972503534, 973617633, 974338510, 975321523, 975649190, 975845787, 976042383], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 55,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 207, "msec" : 108, "page" : 0, "pos" : [976435591, 976566657, 976566654], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 55,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 203, "msec" : 311, "page" : 0, "pos" : [976566647, 976566636, 976566617, 976566583, 976566535, 977877108, 978270279, 978860056, 979056606], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 55,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 198, "msec" : 509, "page" : 0, "pos" : [979974033, 980498253, 980891418, 981481197, 982202035, 982791811, 983316045, 983709222, 983905795, 984036841, 984036825], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 55,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 204, "msec" : 915, "page" : 0, "pos" : [983709120, 982922646, 982791519, 982594838, 982201532, 982201452, 982004776, 981480414, 981480324, 981283632, 981086947, 980890275, 980890224, 980693584, 980693578, 980693571], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 56,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 210, "msec" : 125, "page" : 0, "pos" : [980496963], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 56,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 196, "msec" : 321, "page" : 0, "pos" : [980496931, 980300272, 980300220, 980300169, 980300105, 980300041, 980496578, 981282933, 981807157, 982593538, 982921156, 983117738, 983314346], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 56,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 202, "msec" : 523, "page" : 0, "pos" : [984035217, 985345885], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 56,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "duration" : 202, "msec" : 708, "page" : 0, "pos" : [986656554, 988557060, 990785207, 993209949, 995241488, 997338563, 998845827, 999959887, 1000877340, 1001794793, 1002908866, 1004022914, 1005136975, 1006906321, -1140802560], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 61,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.128697", "widthRadius" : "0.072428", "x" : "0.726630", "y" : "0.413223" }, "drawid" : "2019-07-23-15:43:01-960960", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 62,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.095306", "widthRadius" : "0.053636", "x" : "0.555151", "y" : "0.663661" }, "drawid" : "2019-07-23-15:43:02-592592", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 62,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.070262", "widthRadius" : "0.039542", "x" : "0.586472", "y" : "0.634444" }, "drawid" : "2019-07-23-15:43:02-838838", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 62,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.016000", "widthRadius" : "0.009005", "x" : "0.324165", "y" : "0.363135" }, "drawid" : "2019-07-23-15:43:02-998998", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 63,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.009739", "widthRadius" : "0.005481", "x" : "0.270137", "y" : "0.613574" }, "drawid" : "2019-07-23-15:43:03-521521", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 63,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.006957", "widthRadius" : "0.003915", "x" : "0.241166", "y" : "0.701227" }, "drawid" : "2019-07-23-15:43:03-859859", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 64,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.002783", "widthRadius" : "0.001566", "x" : "0.313202", "y" : "0.869577" }, "drawid" : "2019-07-23-15:43:04-031031", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 64,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.013913", "widthRadius" : "0.007830", "x" : "0.512869", "y" : "0.851490" }, "drawid" : "2019-07-23-15:43:04-184184", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 64,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.043827", "widthRadius" : "0.024665", "x" : "0.775176", "y" : "0.616356" }, "drawid" : "2019-07-23-15:43:04-538538", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 64,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.006957", "widthRadius" : "0.003915", "x" : "0.860524", "y" : "0.464702" }, "drawid" : "2019-07-23-15:43:04-700700", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 64,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.011131", "widthRadius" : "0.006264", "x" : "0.669470", "y" : "0.336700" }, "drawid" : "2019-07-23-15:43:04-881881", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 65,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.018087", "widthRadius" : "0.010179", "x" : "0.412644", "y" : "0.283830" }, "drawid" : "2019-07-23-15:43:05-243243", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 65,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.011131", "widthRadius" : "0.006264", "x" : "0.317117", "y" : "0.260178" }, "drawid" : "2019-07-23-15:43:05-410410", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 65,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.019479", "widthRadius" : "0.010962", "x" : "0.241949", "y" : "0.354788" }, "drawid" : "2019-07-23-15:43:05-598598", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 65,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.012522", "widthRadius" : "0.007047", "x" : "0.288146", "y" : "0.550964" }, "drawid" : "2019-07-23-15:43:05-801801", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 68,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.025739", "widthRadius" : "0.014486", "x" : "0.241166", "y" : "0.816707" }, "drawid" : "2019-07-23-15:43:08-614614", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 68,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.012522", "widthRadius" : "0.007047", "x" : "0.274835", "y" : "0.644183" }, "drawid" : "2019-07-23-15:43:08-803803", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 68,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.020870", "widthRadius" : "0.011745", "x" : "0.407163", "y" : "0.673401" }, "drawid" : "2019-07-23-15:43:08-975975", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 69,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.013913", "widthRadius" : "0.007830", "x" : "0.450228", "y" : "0.790272" }, "drawid" : "2019-07-23-15:43:09-145145", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 69,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.050783", "widthRadius" : "0.028580", "x" : "0.343740", "y" : "0.886273" }, "drawid" : "2019-07-23-15:43:09-318318", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 69,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.031305", "widthRadius" : "0.017618", "x" : "0.173827", "y" : "0.454963" }, "drawid" : "2019-07-23-15:43:09-500500", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 70,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.004174", "widthRadius" : "0.002349", "x" : "0.522265", "y" : "0.169741" }, "drawid" : "2019-07-23-15:43:10-023023", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 70,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.044522", "widthRadius" : "0.025056", "x" : "0.758733", "y" : "0.346440" }, "drawid" : "2019-07-23-15:43:10-204204", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 70,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.043827", "widthRadius" : "0.024665", "x" : "0.838600", "y" : "0.523138" }, "drawid" : "2019-07-23-15:43:10-549549", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 70,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.003478", "widthRadius" : "0.001958", "x" : "0.779091", "y" : "0.712358" }, "drawid" : "2019-07-23-15:43:10-732732", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 70,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.059827", "widthRadius" : "0.033669", "x" : "0.535576", "y" : "0.548182" }, "drawid" : "2019-07-23-15:43:10-916916", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 71,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.002783", "widthRadius" : "0.001566", "x" : "0.458059", "y" : "0.247656" }, "drawid" : "2019-07-23-15:43:11-069069", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 71,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.001391", "widthRadius" : "0.000783", "x" : "0.293627", "y" : "0.125219" }, "drawid" : "2019-07-23-15:43:11-392392", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 71,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.032000", "widthRadius" : "0.018009", "x" : "0.194968", "y" : "0.197568" }, "drawid" : "2019-07-23-15:43:11-588588", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 71,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.047305", "widthRadius" : "0.026622", "x" : "0.187138", "y" : "0.489746" }, "drawid" : "2019-07-23-15:43:11-790790", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 75,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.027131", "widthRadius" : "0.015269", "x" : "0.283448", "y" : "0.563486" }, "drawid" : "2019-07-23-15:43:15-535535", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 75,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.004174", "widthRadius" : "0.002349", "x" : "0.442398", "y" : "0.389571" }, "drawid" : "2019-07-23-15:43:15-701701", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 75,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.002783", "widthRadius" : "0.001566", "x" : "0.588821", "y" : "0.427136" }, "drawid" : "2019-07-23-15:43:15-851851", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.012522", "widthRadius" : "0.007047", "x" : "0.602915", "y" : "0.468876" }, "drawid" : "2019-07-23-15:43:16-055055", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.034783", "widthRadius" : "0.019575", "x" : "0.776742", "y" : "0.692879" }, "drawid" : "2019-07-23-15:43:16-216216", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.018087", "widthRadius" : "0.010179", "x" : "0.875401", "y" : "0.697053" }, "drawid" : "2019-07-23-15:43:16-395395", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.022261", "widthRadius" : "0.012528", "x" : "0.843298", "y" : "0.471659" }, "drawid" : "2019-07-23-15:43:16-581581", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.029913", "widthRadius" : "0.016835", "x" : "0.562198", "y" : "0.594095" }, "drawid" : "2019-07-23-15:43:16-757757", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 76,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.028522", "widthRadius" : "0.016052", "x" : "0.429087", "y" : "0.701227" }, "drawid" : "2019-07-23-15:43:16-934934", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 77,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.048696", "widthRadius" : "0.027405", "x" : "0.443964", "y" : "0.823664" }, "drawid" : "2019-07-23-15:43:17-105105", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 77,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.008348", "widthRadius" : "0.004698", "x" : "0.642848", "y" : "0.840360" }, "drawid" : "2019-07-23-15:43:17-328328", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 77,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.007652", "widthRadius" : "0.004307", "x" : "0.856609", "y" : "0.794446" }, "drawid" : "2019-07-23-15:43:17-777777", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 77,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.001391", "widthRadius" : "0.000783", "x" : "0.945088", "y" : "0.829229" }, "drawid" : "2019-07-23-15:43:17-965965", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 78,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.005565", "widthRadius" : "0.003132", "x" : "0.920815", "y" : "0.922448" }, "drawid" : "2019-07-23-15:43:18-201201", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 78,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.007652", "widthRadius" : "0.004307", "x" : "0.880882", "y" : "0.918274" }, "drawid" : "2019-07-23-15:43:18-370370", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 79,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.040348", "widthRadius" : "0.022707", "x" : "0.987371", "y" : "0.969753" }, "drawid" : "2019-07-23-15:43:19-494494", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 80,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.058436", "widthRadius" : "0.032886", "x" : "0.969361", "y" : "0.143306" }, "drawid" : "2019-07-23-15:43:20-523523", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 81,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.057740", "widthRadius" : "0.032495", "x" : "0.079084", "y" : "0.147480" }, "drawid" : "2019-07-23-15:43:21-721721", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 82,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "BCB53EA6D52B7AAE", "draw" : { "heightRadius" : "0.047305", "widthRadius" : "0.026622", "x" : "0.062640", "y" : "0.966970" }, "drawid" : "2019-07-23-15:43:22-722722", "height" : 1013, "page" : "4", "thickness" : 2, "type" : 4, "width" : 1800 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 115,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.025739", "widthRadius" : "0.015444", "x" : "0.209533", "y" : "0.214264" }, "drawid" : "2019-07-23-15:43:55-892892", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 116,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.013913", "widthRadius" : "0.008348", "x" : "0.281326", "y" : "0.322787" }, "drawid" : "2019-07-23-15:43:56-067067", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 116,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.102262", "widthRadius" : "0.061357", "x" : "0.420736", "y" : "0.563486" }, "drawid" : "2019-07-23-15:43:56-397397", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 116,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.025044", "widthRadius" : "0.015026", "x" : "0.428249", "y" : "0.709575" }, "drawid" : "2019-07-23-15:43:56-564564", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 116,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.043131", "widthRadius" : "0.025879", "x" : "0.219551", "y" : "0.678966" }, "drawid" : "2019-07-23-15:43:56-763763", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 116,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.082784", "widthRadius" : "0.049670", "x" : "0.282160", "y" : "0.510616" }, "drawid" : "2019-07-23-15:43:56-927927", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 117,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.025044", "widthRadius" : "0.015026", "x" : "0.582686", "y" : "0.384005" }, "drawid" : "2019-07-23-15:43:57-095095", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 117,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.052175", "widthRadius" : "0.031305", "x" : "0.656983", "y" : "0.677575" }, "drawid" : "2019-07-23-15:43:57-268268", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 117,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.057044", "widthRadius" : "0.034227", "x" : "0.492529", "y" : "0.710966" }, "drawid" : "2019-07-23-15:43:57-494494", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 117,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.100871", "widthRadius" : "0.060523", "x" : "0.425745", "y" : "0.228177" }, "drawid" : "2019-07-23-15:43:57-661661", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 117,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.070958", "widthRadius" : "0.042575", "x" : "0.644461", "y" : "0.210090" }, "drawid" : "2019-07-23-15:43:57-859859", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 118,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.011826", "widthRadius" : "0.007096", "x" : "0.754654", "y" : "0.378440" }, "drawid" : "2019-07-23-15:43:58-052052", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 118,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.008348", "widthRadius" : "0.005009", "x" : "0.702897", "y" : "0.581573" }, "drawid" : "2019-07-23-15:43:58-277277", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 118,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "heightRadius" : "0.037566", "widthRadius" : "0.022539", "x" : "0.401536", "y" : "0.822272" }, "drawid" : "2019-07-23-15:43:58-739739", "height" : 600, "page" : "1", "thickness" : 2, "type" : 4, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 120,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.0237", "width" : "0.2170", "x" : "0.2980", "y" : "0.6038" }, "drawid" : "2019-07-23-15:44:00-622622", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 120,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.0626", "width" : "0.1152", "x" : "0.6036", "y" : "0.6734" }, "drawid" : "2019-07-23-15:44:00-806806", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 120,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.0111", "width" : "0.0326", "x" : "0.7722", "y" : "0.7777" }, "drawid" : "2019-07-23-15:44:00-969969", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 121,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.1405", "width" : "-0.0476", "x" : "0.8507", "y" : "0.5899" }, "drawid" : "2019-07-23-15:44:01-144144", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 121,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.0083", "width" : "-0.0493", "x" : "0.6261", "y" : "0.3381" }, "drawid" : "2019-07-23-15:44:01-328328", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 121,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.0473", "width" : "-0.0451", "x" : "0.4783", "y" : "0.3450" }, "drawid" : "2019-07-23-15:44:01-497497", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 121,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.1322", "width" : "0.0184", "x" : "0.3464", "y" : "0.6442" }, "drawid" : "2019-07-23-15:44:01-718718", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 121,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.0083", "width" : "0.0551", "x" : "0.4157", "y" : "0.8612" }, "drawid" : "2019-07-23-15:44:01-869869", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 122,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.0710", "width" : "0.0826", "x" : "0.5585", "y" : "0.8640" }, "drawid" : "2019-07-23-15:44:02-036036", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 122,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.0890", "width" : "-0.0367", "x" : "0.6904", "y" : "0.4953" }, "drawid" : "2019-07-23-15:44:02-218218", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 122,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "0.0209", "width" : "-0.1336", "x" : "0.6102", "y" : "0.3437" }, "drawid" : "2019-07-23-15:44:02-404404", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 122,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "-0.0612", "width" : "-0.0701", "x" : "0.2229", "y" : "0.4856" }, "drawid" : "2019-07-23-15:44:02-750750", "height" : 600, "page" : "1", "thickness" : 2, "type" : 3, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 126,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.148593", "y" : "0.628878" }, { "x" : "0.209533", "y" : "0.492529" }], "drawid" : "2019-07-23-15:44:06-649649", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 126,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.257951", "y" : "0.416006" }, { "x" : "0.293013", "y" : "0.395136" }], "drawid" : "2019-07-23-15:44:06-780780", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 127,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.361466", "y" : "0.358961" }, { "x" : "0.552634", "y" : "0.313048" }], "drawid" : "2019-07-23-15:44:07-112112", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 127,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.666166", "y" : "0.363135" }, { "x" : "0.693714", "y" : "0.443832" }], "drawid" : "2019-07-23-15:44:07-296296", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 127,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.483346", "y" : "0.862621" }, { "x" : "0.399866", "y" : "0.777750" }], "drawid" : "2019-07-23-15:44:07-838838", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 128,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.402371", "y" : "0.762445" }, { "x" : "0.436597", "y" : "0.488355" }], "drawid" : "2019-07-23-15:44:08-188188", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 128,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.457467", "y" : "0.392353" }, { "x" : "0.566825", "y" : "0.253221" }], "drawid" : "2019-07-23-15:44:08-367367", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 128,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.651139", "y" : "0.232351" }, { "x" : "0.698723", "y" : "0.282439" }], "drawid" : "2019-07-23-15:44:08-524524", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 128,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.725436", "y" : "0.495311" }, { "x" : "0.712914", "y" : "0.623313" }], "drawid" : "2019-07-23-15:44:08-712712", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 128,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.682862", "y" : "0.717923" }, { "x" : "0.645296", "y" : "0.761054" }], "drawid" : "2019-07-23-15:44:08-889889", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 129,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.545955", "y" : "0.751315" }, { "x" : "0.454963", "y" : "0.660879" }], "drawid" : "2019-07-23-15:44:09-064064", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 129,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.318057", "y" : "0.510616" }, { "x" : "0.258786", "y" : "0.506442" }], "drawid" : "2019-07-23-15:44:09-216216", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 129,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.074297", "y" : "0.738793" }, { "x" : "0.124384", "y" : "0.850099" }], "drawid" : "2019-07-23-15:44:09-747747", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 129,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.176142", "y" : "0.894621" }, { "x" : "0.258786", "y" : "0.894621" }], "drawid" : "2019-07-23-15:44:09-967967", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 130,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.321396", "y" : "0.857055" }, { "x" : "0.346440", "y" : "0.688705" }], "drawid" : "2019-07-23-15:44:10-127127", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 130,
          'data': '{ "alpha" : 1, "color" : 10066329, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.260456", "y" : "0.410440" }, { "x" : "0.176142", "y" : "0.294961" }], "drawid" : "2019-07-23-15:44:10-297297", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 133,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.239586", "y" : "0.648357" }, { "x" : "0.207029", "y" : "0.616356" }], "drawid" : "2019-07-23-15:44:13-624624", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 133,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.166124", "y" : "0.531486" }, { "x" : "0.165289", "y" : "0.441050" }], "drawid" : "2019-07-23-15:44:13-794794", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 134,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.204525", "y" : "0.484181" }, { "x" : "0.209533", "y" : "0.617748" }], "drawid" : "2019-07-23-15:44:14-178178", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 134,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.195342", "y" : "0.729054" }, { "x" : "0.173637", "y" : "0.818098" }], "drawid" : "2019-07-23-15:44:14-391391", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 134,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.151933", "y" : "0.900186" }, { "x" : "0.135237", "y" : "0.972535" }], "drawid" : "2019-07-23-15:44:14-559559", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 137,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.476667", "y" : "0.870969" }, { "x" : "0.568495", "y" : "0.884882" }], "drawid" : "2019-07-23-15:44:17-724724", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 138,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.885717", "y" : "0.726271" }, { "x" : "0.917439", "y" : "0.645574" }], "drawid" : "2019-07-23-15:44:18-248248", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 138,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.933300", "y" : "0.460528" }, { "x" : "0.863177", "y" : "0.325570" }], "drawid" : "2019-07-23-15:44:18-428428", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 138,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.828951", "y" : "0.226786" }, { "x" : "0.747141", "y" : "0.051479" }], "drawid" : "2019-07-23-15:44:18-754754", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 138,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.669505", "y" : "0.008348" }, { "x" : "0.616078", "y" : "0.032000" }], "drawid" : "2019-07-23-15:44:18-945945", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 139,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.576008", "y" : "0.089045" }, { "x" : "0.510059", "y" : "0.168350" }], "drawid" : "2019-07-23-15:44:19-124124", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 139,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.495868", "y" : "0.178089" }, { "x" : "0.495868", "y" : "0.186437" }], "drawid" : "2019-07-23-15:44:19-288288", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 139,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.515903", "y" : "0.222612" }, { "x" : "0.586026", "y" : "0.265743" }], "drawid" : "2019-07-23-15:44:19-445445", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 139,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.647800", "y" : "0.285221" }, { "x" : "0.673679", "y" : "0.289395" }], "drawid" : "2019-07-23-15:44:19-595595", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 139,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.687036", "y" : "0.325570" }, { "x" : "0.630270", "y" : "0.509224" }], "drawid" : "2019-07-23-15:44:19-918918", "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 143,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好", "size" : 24, "width" : "56.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 143,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊", "size" : 24, "width" : "93.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 143,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊", "size" : 24, "width" : "117.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 144,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊", "size" : 24, "width" : "152.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 144,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊啊", "size" : 24, "width" : "176.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 144,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊啊啊", "size" : 24, "width" : "200.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 144,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊啊啊啊", "size" : 24, "width" : "237.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 144,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊啊啊啊啊啊", "size" : 24, "width" : "272.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 146,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "你好啊啊啊啊啊啊啊啊啊", "size" : 24, "width" : "272.000000", "x" : "0.105341", "y" : "0.132712" }, "drawid" : "2019-07-23-15:44:21-944944", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 149,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "减肥的萨拉科技的撒", "size" : 24, "width" : "256.000000", "x" : "0.125376", "y" : "0.338628" }, "drawid" : "2019-07-23-15:44:28-749749", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 150,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "减肥的萨拉科技的撒发", "size" : 24, "width" : "248.000000", "x" : "0.125376", "y" : "0.338628" }, "drawid" : "2019-07-23-15:44:28-749749", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 152,
          'data': '{ "alpha" : 1, "color" : 16743953, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "减肥的萨拉科技的撒发", "size" : 24, "width" : "248.000000", "x" : "0.125376", "y" : "0.338628" }, "drawid" : "2019-07-23-15:44:28-749749", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 157,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "离开时间范德萨", "size" : 24, "width" : "223.000000", "x" : "0.064436", "y" : "0.648893" }, "drawid" : "2019-07-23-15:44:36-131131", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 157,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "离开时间范德萨发的", "size" : 24, "width" : "224.000000", "x" : "0.064436", "y" : "0.648893" }, "drawid" : "2019-07-23-15:44:36-131131", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 162,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "离开时间范德萨发的", "size" : 24, "width" : "224.000000", "x" : "0.064436", "y" : "0.648893" }, "drawid" : "2019-07-23-15:44:36-131131", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 167,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.245104", "y" : "0.781985" }, { "x" : "0.324268", "y" : "0.491247" }], "drawid" : "2019-07-23-15:44:47-926926", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.473461", "y" : "0.395003" }, { "x" : "0.525983", "y" : "0.413048" }], "drawid" : "2019-07-23-15:44:48-100100", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.552625", "y" : "0.567440" }, { "x" : "0.542729", "y" : "0.733863" }], "drawid" : "2019-07-23-15:44:48-255255", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.435401", "y" : "0.896275" }, { "x" : "0.358521", "y" : "0.850158" }], "drawid" : "2019-07-23-15:44:48-411411", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.256521", "y" : "0.597517" }, { "x" : "0.243581", "y" : "0.405028" }], "drawid" : "2019-07-23-15:44:48-585585", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.283163", "y" : "0.304774" }, { "x" : "0.392014", "y" : "0.272692" }], "drawid" : "2019-07-23-15:44:48-746746", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 168,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.475745", "y" : "0.302769" }, { "x" : "0.526744", "y" : "0.425079" }], "drawid" : "2019-07-23-15:44:48-911911", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 169,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.522177", "y" : "0.591501" }, { "x" : "0.414088", "y" : "0.876224" }], "drawid" : "2019-07-23-15:44:49-110110", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 169,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.305238", "y" : "0.788000" }, { "x" : "0.263372", "y" : "0.533354" }], "drawid" : "2019-07-23-15:44:49-229229", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 169,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.395058", "y" : "0.174443" }, { "x" : "0.528267", "y" : "0.198504" }], "drawid" : "2019-07-23-15:44:49-418418", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 169,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.578505", "y" : "0.326830" }, { "x" : "0.587640", "y" : "0.421069" }], "drawid" : "2019-07-23-15:44:49-566566", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 169,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.539685", "y" : "0.679725" }, { "x" : "0.500103", "y" : "0.753914" }], "drawid" : "2019-07-23-15:44:49-725725", "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 173,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "B3A62520E544878F", "draw" : [{ "x" : "0.455192", "y" : "0.695946" }, { "x" : "0.666804", "y" : "-0.334054" }], "drawid" : "2019-07-23-15:44:53-406406", "height" : 35, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1280 }',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.293196", "y" : "0.301917" }, { "x" : "0.300526", "y" : "0.308874" }], "drawid" : "2019-07-23-15:44:55-097097", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.520423", "y" : "0.468876" }, { "x" : "0.608382", "y" : "0.521746" }], "drawid" : "2019-07-23-15:44:55-256256", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.828279", "y" : "0.303309" }, { "x" : "0.798959", "y" : "0.208699" }], "drawid" : "2019-07-23-15:44:55-417417", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.630371", "y" : "0.119654" }, { "x" : "0.531418", "y" : "0.118263" }], "drawid" : "2019-07-23-15:44:55-588588", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.395815", "y" : "0.215655" }, { "x" : "0.318851", "y" : "0.332526" }], "drawid" : "2019-07-23-15:44:55-747747", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 175,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.307856", "y" : "0.456354" }, { "x" : "0.439794", "y" : "0.489746" }], "drawid" : "2019-07-23-15:44:55-918918", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 176,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.439794", "y" : "0.489746" }, { "x" : "0.417804", "y" : "0.518964" }], "drawid" : "2019-07-23-15:44:56-087087", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 176,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.307856", "y" : "0.716532" }, { "x" : "0.238222", "y" : "0.896012" }], "drawid" : "2019-07-23-15:44:56-238238", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 178,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.539024", "y" : "0.225000" }, { "x" : "0.526829", "y" : "0.205556" }, { "x" : "0.512195", "y" : "0.188889" }, { "x" : "0.495122", "y" : "0.175000" }, { "x" : "0.475610", "y" : "0.166667" }, { "x" : "0.460976", "y" : "0.161111" }, { "x" : "0.443902", "y" : "0.155556" }], "drawid" : "2019-07-23-15:44:58-900900", "drawtime" : 72, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.297561", "y" : "0.141667" }, { "x" : "0.282927", "y" : "0.149074" }, { "x" : "0.268293", "y" : "0.157407" }, { "x" : "0.239024", "y" : "0.182407" }, { "x" : "0.219512", "y" : "0.204630" }], "drawid" : "2019-07-23-15:44:59-074074", "drawtime" : 56, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.026829", "y" : "0.499074" }, { "x" : "0.029268", "y" : "0.500926" }, { "x" : "0.051220", "y" : "0.500926" }, { "x" : "0.092683", "y" : "0.501852" }, { "x" : "0.219512", "y" : "0.509259" }, { "x" : "0.312195", "y" : "0.520370" }], "drawid" : "2019-07-23-15:44:59-230230", "drawtime" : 86, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.612195", "y" : "0.559259" }, { "x" : "0.673171", "y" : "0.545370" }, { "x" : "0.700000", "y" : "0.539815" }, { "x" : "0.714634", "y" : "0.536111" }, { "x" : "0.719512", "y" : "0.536111" }], "drawid" : "2019-07-23-15:44:59-380380", "drawtime" : 67, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.651220", "y" : "0.542593" }, { "x" : "0.597561", "y" : "0.542593" }, { "x" : "0.575610", "y" : "0.541667" }, { "x" : "0.548780", "y" : "0.533333" }, { "x" : "0.526829", "y" : "0.521296" }, { "x" : "0.497561", "y" : "0.492593" }, { "x" : "0.480488", "y" : "0.450926" }], "drawid" : "2019-07-23-15:44:59-541541", "drawtime" : 81, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.600000", "y" : "0.177778" }, { "x" : "0.641463", "y" : "0.168519" }, { "x" : "0.687805", "y" : "0.162963" }, { "x" : "0.729268", "y" : "0.157407" }, { "x" : "0.765854", "y" : "0.155556" }, { "x" : "0.800000", "y" : "0.155556" }, { "x" : "0.829268", "y" : "0.161111" }], "drawid" : "2019-07-23-15:44:59-707707", "drawtime" : 75, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 179,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.895122", "y" : "0.370370" }, { "x" : "0.873171", "y" : "0.409259" }, { "x" : "0.839024", "y" : "0.440741" }, { "x" : "0.802439", "y" : "0.467593" }, { "x" : "0.758537", "y" : "0.490741" }, { "x" : "0.712195", "y" : "0.509259" }, { "x" : "0.656098", "y" : "0.528704" }], "drawid" : "2019-07-23-15:44:59-875875", "drawtime" : 63, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 181,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-875875", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 181,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-707707", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 187,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:56-238238", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 188,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-230230", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 197,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "drawid" : "2019-07-23-15:43:22-722722", "page" : 4, "type" : 9 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 197,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "drawid" : "2019-07-23-15:43:21-721721", "page" : 4, "type" : 9 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 200,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "drawid" : "2019-07-23-15:43:15-535535", "page" : 4, "type" : 9 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 203,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "drawid" : "2019-07-23-15:43:05-801801", "page" : 4, "type" : 9 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 204,
          'data': '{ "docid" : "BCB53EA6D52B7AAE", "drawid" : "2019-07-23-15:43:02-592592", "page" : 4, "type" : 9 }',
          'docName': '动画ppt.pptx',
          'pageNum': 4
        }, {
          'time': 221,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:58-900900", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 222,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:55-417417", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 223,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:55-588588", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 224,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:55-747747", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 226,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-541541", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 227,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-380380", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 227,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:44:59-074074", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 229,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "C99A9BB4F17955C3", "draw" : { }, "page" : 0, "thickness" : 5, "type" : 0 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 233,
          'data': '{ "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "drawid" : "2019-07-23-15:44:28-749749", "page" : 1, "type" : 9 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 239,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨", "size" : 24, "width" : "186.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 239,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少", "size" : 24, "width" : "224.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 239,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少收到了卡积分", "size" : 24, "width" : "294.598915", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 240,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少收到了卡积", "size" : 24, "width" : "294.598915", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 240,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少收到了卡", "size" : 24, "width" : "294.598915", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 241,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少收到了", "size" : 24, "width" : "294.598915", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 241,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少收", "size" : 24, "width" : "248.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 241,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多少", "size" : 24, "width" : "224.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 241,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨发多", "size" : 24, "width" : "200.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 242,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克萨", "size" : 24, "width" : "152.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 242,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷克", "size" : 24, "width" : "128.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 242,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递雷", "size" : 24, "width" : "104.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 242,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递", "size" : 24, "width" : "80.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 243,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递是的范德萨发", "size" : 24, "width" : "224.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 244,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "寄快递是的范德萨发", "size" : 24, "width" : "224.000000", "x" : "0.711401", "y" : "0.207843" }, "drawid" : "2019-07-23-15:45:58-195195", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 251,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看2", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 251,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看2312", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 253,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "39.000000", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 253,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 254,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n1", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 255,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 255,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 255,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n1111111111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 255,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n111111111111111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 256,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n1111111111111111111111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 257,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n111111111111111111111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 257,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n11111111111111111111111111", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 258,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n111111111111111111111111112", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 258,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n1111111111111111111111111122", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 260,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { "height" : "48.201045", "label" : "立刻就立刻就立刻就立刻就立刻就立刻就立刻就立刻就来看据了解立刻就立刻就了立刻就立刻就来看231\\n1111111111111111111111111122", "size" : 24, "width" : "393.939423", "x" : "0.612061", "y" : "0.931332" }, "drawid" : "2019-07-23-15:46:08-226226", "height" : 600, "page" : "1", "thickness" : 2, "type" : 5, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 262,
          'data': '{ "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "drawid" : "2019-07-23-15:46:08-226226", "page" : 1, "type" : 9 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 264,
          'data': '{ "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "drawid" : "2019-07-23-15:43:58-739739", "page" : 1, "type" : 9 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 265,
          'data': '{ "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "drawid" : "2019-07-23-15:44:08-188188", "page" : 1, "type" : 9 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 268,
          'data': '{ "alpha" : 1, "color" : 0, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : { }, "page" : 1, "thickness" : 5, "type" : 0 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 274,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.271206", "y" : "0.321396" }, { "x" : "0.241887", "y" : "0.321396" }], "drawid" : "2019-07-23-15:46:34-331331", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 274,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.388485", "y" : "0.235134" }, { "x" : "0.454454", "y" : "0.176698" }], "drawid" : "2019-07-23-15:46:34-523523", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 274,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.498433", "y" : "0.146089" }, { "x" : "0.582727", "y" : "0.107132" }], "drawid" : "2019-07-23-15:46:34-691691", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 274,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.736655", "y" : "0.146089" }, { "x" : "0.850268", "y" : "0.190611" }], "drawid" : "2019-07-23-15:46:34-835835", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 274,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.912573", "y" : "0.317222" }, { "x" : "0.813619", "y" : "0.370092" }], "drawid" : "2019-07-23-15:46:34-984984", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 275,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.575397", "y" : "0.377049" }, { "x" : "0.087959", "y" : "0.243482" }], "drawid" : "2019-07-23-15:46:35-154154", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 275,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.164923", "y" : "0.118263" }, { "x" : "0.520423", "y" : "-0.012522" }], "drawid" : "2019-07-23-15:46:35-320320", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 275,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.769640", "y" : "0.030609" }, { "x" : "0.989537", "y" : "0.140524" }], "drawid" : "2019-07-23-15:46:35-497497", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 275,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.919903", "y" : "0.300526" }, { "x" : "0.842939", "y" : "0.365918" }], "drawid" : "2019-07-23-15:46:35-647647", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 276,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.776969", "y" : "0.499485" }, { "x" : "0.732990", "y" : "0.731836" }], "drawid" : "2019-07-23-15:46:36-030030", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 276,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.670686", "y" : "0.806968" }, { "x" : "0.604717", "y" : "0.908534" }], "drawid" : "2019-07-23-15:46:36-184184", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 276,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.351835", "y" : "0.893230" }, { "x" : "0.249217", "y" : "0.873751" }], "drawid" : "2019-07-23-15:46:36-336336", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 276,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.153928", "y" : "0.731836" }, { "x" : "0.410474", "y" : "0.587139" }], "drawid" : "2019-07-23-15:46:36-525525", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 276,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.601052", "y" : "0.545399" }, { "x" : "0.842939", "y" : "0.559312" }], "drawid" : "2019-07-23-15:46:36-701701", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 277,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.421469", "y" : "0.763837" }, { "x" : "0.109949", "y" : "0.602443" }], "drawid" : "2019-07-23-15:46:37-045045", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 278,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.351220", "y" : "0.304630" }, { "x" : "0.290244", "y" : "0.304630" }, { "x" : "0.219512", "y" : "0.306481" }, { "x" : "0.175610", "y" : "0.309259" }, { "x" : "0.146341", "y" : "0.312037" }, { "x" : "0.117073", "y" : "0.314815" }, { "x" : "0.095122", "y" : "0.318519" }, { "x" : "0.078049", "y" : "0.324074" }, { "x" : "0.070732", "y" : "0.326852" }], "drawid" : "2019-07-23-15:46:38-759759", "drawtime" : 102, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 279,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.439024", "y" : "0.367593" }, { "x" : "0.509756", "y" : "0.367593" }, { "x" : "0.560976", "y" : "0.367593" }, { "x" : "0.575610", "y" : "0.367593" }, { "x" : "0.578049", "y" : "0.367593" }, { "x" : "0.578049", "y" : "0.371296" }, { "x" : "0.568293", "y" : "0.385185" }, { "x" : "0.519512", "y" : "0.414815" }, { "x" : "0.446341", "y" : "0.460185" }], "drawid" : "2019-07-23-15:46:38-943943", "drawtime" : 96, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 279,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.365854", "y" : "0.518519" }, { "x" : "0.358537", "y" : "0.533333" }, { "x" : "0.358537", "y" : "0.542593" }, { "x" : "0.402439", "y" : "0.552778" }, { "x" : "0.436585", "y" : "0.555556" }, { "x" : "0.487805", "y" : "0.561111" }, { "x" : "0.531707", "y" : "0.566667" }, { "x" : "0.556098", "y" : "0.575926" }, { "x" : "0.568293", "y" : "0.584259" }, { "x" : "0.568293", "y" : "0.597222" }, { "x" : "0.546341", "y" : "0.613889" }, { "x" : "0.487805", "y" : "0.634259" }, { "x" : "0.424390", "y" : "0.652778" }, { "x" : "0.387805", "y" : "0.656481" }, { "x" : "0.378049", "y" : "0.656481" }, { "x" : "0.373171", "y" : "0.653704" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 202, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 279,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.373171", "y" : "0.653704" }, { "x" : "0.380488", "y" : "0.639815" }, { "x" : "0.436585", "y" : "0.600926" }, { "x" : "0.548780", "y" : "0.533333" }, { "x" : "0.678049", "y" : "0.449074" }, { "x" : "0.780488", "y" : "0.384259" }, { "x" : "0.824390", "y" : "0.343519" }, { "x" : "0.829268", "y" : "0.332407" }, { "x" : "0.814634", "y" : "0.324074" }, { "x" : "0.741463", "y" : "0.318519" }, { "x" : "0.614634", "y" : "0.315741" }, { "x" : "0.473171", "y" : "0.315741" }, { "x" : "0.373171", "y" : "0.315741" }, { "x" : "0.334146", "y" : "0.315741" }, { "x" : "0.314634", "y" : "0.315741" }, { "x" : "0.314634", "y" : "0.314815" }, { "x" : "0.314634", "y" : "0.312037" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 201, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 279,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.314634", "y" : "0.312037" }, { "x" : "0.343902", "y" : "0.304630" }, { "x" : "0.436585", "y" : "0.287037" }, { "x" : "0.800000", "y" : "0.229630" }, { "x" : "0.956098", "y" : "0.200000" }, { "x" : "1.048780", "y" : "0.179630" }, { "x" : "1.070732", "y" : "0.171296" }, { "x" : "1.070732", "y" : "0.168519" }, { "x" : "1.058537", "y" : "0.168519" }, { "x" : "1.058537", "y" : "0.166667" }, { "x" : "0.792683", "y" : "0.233333" }, { "x" : "0.534146", "y" : "0.312037" }, { "x" : "0.417073", "y" : "0.350926" }, { "x" : "0.387805", "y" : "0.362963" }, { "x" : "0.385366", "y" : "0.364815" }, { "x" : "0.400000", "y" : "0.362037" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 209, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 279,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.400000", "y" : "0.362037" }, { "x" : "0.443902", "y" : "0.359259" }, { "x" : "0.556098", "y" : "0.368519" }, { "x" : "0.629268", "y" : "0.389815" }, { "x" : "0.687805", "y" : "0.426852" }, { "x" : "0.719512", "y" : "0.465741" }, { "x" : "0.729268", "y" : "0.510185" }, { "x" : "0.714634", "y" : "0.555556" }, { "x" : "0.670732", "y" : "0.600000" }, { "x" : "0.600000", "y" : "0.648148" }, { "x" : "0.526829", "y" : "0.694444" }, { "x" : "0.458537", "y" : "0.733333" }, { "x" : "0.407317", "y" : "0.761111" }, { "x" : "0.385366", "y" : "0.775000" }, { "x" : "0.373171", "y" : "0.778704" }, { "x" : "0.365854", "y" : "0.781481" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 194, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 280,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.365854", "y" : "0.781481" }, { "x" : "0.365854", "y" : "0.778704" }, { "x" : "0.365854", "y" : "0.775000" }, { "x" : "0.370732", "y" : "0.761111" }, { "x" : "0.373171", "y" : "0.744444" }, { "x" : "0.373171", "y" : "0.714815" }, { "x" : "0.373171", "y" : "0.669444" }, { "x" : "0.351220", "y" : "0.616667" }, { "x" : "0.307317", "y" : "0.569444" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 206, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 280,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.307317", "y" : "0.569444" }, { "x" : "0.256098", "y" : "0.531481" }, { "x" : "0.202439", "y" : "0.506481" }, { "x" : "0.160976", "y" : "0.495370" }, { "x" : "0.136585", "y" : "0.489815" }, { "x" : "0.117073", "y" : "0.487037" }, { "x" : "0.114634", "y" : "0.487037" }, { "x" : "0.114634", "y" : "0.484259" }, { "x" : "0.121951", "y" : "0.479630" }, { "x" : "0.139024", "y" : "0.467593" }, { "x" : "0.190244", "y" : "0.445370" }, { "x" : "0.263415", "y" : "0.412963" }, { "x" : "0.356098", "y" : "0.373148" }, { "x" : "0.424390", "y" : "0.334259" }, { "x" : "0.453659", "y" : "0.318519" }, { "x" : "0.465854", "y" : "0.314815" }, { "x" : "0.460976", "y" : "0.326852" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 206, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 280,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.460976", "y" : "0.326852" }, { "x" : "0.431707", "y" : "0.353704" }, { "x" : "0.370732", "y" : "0.400926" }, { "x" : "0.312195", "y" : "0.442593" }, { "x" : "0.285366", "y" : "0.460185" }, { "x" : "0.282927", "y" : "0.467593" }, { "x" : "0.312195", "y" : "0.462037" }, { "x" : "0.385366", "y" : "0.442593" }, { "x" : "0.504878", "y" : "0.412037" }, { "x" : "0.597561", "y" : "0.390741" }, { "x" : "0.634146", "y" : "0.382407" }, { "x" : "0.643902", "y" : "0.379630" }, { "x" : "0.643902", "y" : "0.381481" }, { "x" : "0.607317", "y" : "0.407407" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 199, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 280,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.607317", "y" : "0.407407" }, { "x" : "0.553659", "y" : "0.440741" }, { "x" : "0.512195", "y" : "0.475926" }, { "x" : "0.509756", "y" : "0.478704" }, { "x" : "0.509756", "y" : "0.479630" }, { "x" : "0.512195", "y" : "0.487963" }], "drawid" : "2019-07-23-15:46:39-065065", "drawtime" : 102, "height" : 1080, "page" : "0", "thickness" : 8, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 282,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 223, "page" : 0, "pos" : [908340097, 897528165, 892678831, 890450757], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 282,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 424, "page" : 0, "pos" : [890057541, 890057451, 890843583], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 282,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 628, "page" : 0, "pos" : [890843523, 890450217, 889663634, 888221689, 886714001, 884813157, 883698804, 881863433, 880355865, 878848297, 877340728, 876226433, 874718625, 874390401], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 282,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 199, "msec" : 827, "page" : 0, "pos" : [873997185, 872882049, 872881025, 872480768], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 283,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 202, "msec" : 29, "page" : 0, "pos" : [870390657, 869605793, 869606273, 868885921, 868165025, 868165265, 868165505], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 283,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 235, "page" : 0, "pos" : [868165688, 867379497, 867379617, 866658841, 866658961, 866659081, 866659201, 866659321, 865938488, 865938548], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 283,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 441, "page" : 0, "pos" : [865938608, 865938668, 865938789, 865152417, 865152477, 865152597, 864431761, 864431821, 864431941, 864432001, 863645629, 862924826, 862203990, 862204020, 862204080], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 283,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 196, "msec" : 638, "page" : 0, "pos" : [861417678, 860696873, 860696903, 860696963, 860696993, 860697023, 859910621, 859910651, 859189785, 859189815, 859189845, 859189875, 859189905, 858469039], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 283,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 843, "page" : 0, "pos" : [858469069, 858469099, 858469159, 857682757, 856961891, 856961921, 856961951, 856175549, 855454653, 855454713, 854733835, 853947433, 853947448, 853947463, 852440165], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 284,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 201, "msec" : 44, "page" : 0, "pos" : [851719284, 851719299, 850212031, 849491165, 848704779, 847983913, 847983928, 847983943, 847983958, 847983973, 847983988], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 284,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 202, "msec" : 453, "page" : 0, "pos" : [847984018, 847984063, 847263197, 847263227, 847263257, 847263272], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 284,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 202, "msec" : 655, "page" : 0, "pos" : [846476885, 846476900, 845756019, 844969617, 844969632, 844969647, 844969662, 844969677], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 284,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 201, "msec" : 855, "page" : 0, "pos" : [844969692, 844248811, 844248826, 844248841, 844248856, 843527960, 843527975, 843527990, 842741573], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 285,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 204, "msec" : 60, "page" : 0, "pos" : [842741588, 842020722, 842020737, 842020752], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 285,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 202, "msec" : 261, "page" : 0, "pos" : [842020767, 842020782, 842020812, 842020827, 842020842], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 285,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 211, "msec" : 473, "page" : 0, "pos" : [842020857, 842020868, 842020875, 842020883, 842741779, 843528218, 843528226, 844249122, 844249129, 844249137, 844970033], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 285,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 195, "msec" : 668, "page" : 0, "pos" : [845756465, 845756472, 846477368, 847263800, 847984704, 847984711, 848705607, 848705615], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 285,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 873, "page" : 0, "pos" : [849492054, 850999390, 850999405, 851720301, 852441204, 852441212, 853227651, 854734987, 854734994, 855455898, 856176794, 856176801], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 286,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 199, "msec" : 72, "page" : 0, "pos" : [856963233, 857684137, 858470569, 859912376, 862206136], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 286,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 278, "page" : 0, "pos" : [862206158], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 286,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 477, "page" : 0, "pos" : [862927077, 863647988, 865155331, 866662674, 867383578, 868170025, 868890921, 868890928, 870398264, 871119167, 872495431, 872888654], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 286,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 684, "page" : 0, "pos" : [872888662, 873281878, 873609558, 873609565, 874002781, 874002789, 874396012, 874723692, 875116916, 875116923, 875903370], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 286,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 887, "page" : 0, "pos" : [876624281, 876624289, 877017505, 877345192, 877738408, 877738416, 878131639, 878459319, 878852543, 879245759], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 287,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 88, "page" : 0, "pos" : [879638982, 879966662, 880359893, 880753117, 881474020, 881474028, 882194924, 882981371, 883702267], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 287,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 291, "page" : 0, "pos" : [883702282, 884095505], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 287,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 212, "msec" : 504, "page" : 0, "pos" : [884816439, 885209662, 885930573, 886323804, 886717028, 887110259, 887437946, 887437954, 887831177, 887831185, 887831192, 888224408, 888224416], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 287,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 193, "msec" : 697, "page" : 0, "pos" : [888552103, 888945334, 888945342, 889338565, 889338573, 889666260, 890059484, 890059491, 890452707, 890452715, 890452722], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 287,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 897, "page" : 0, "pos" : [890845938, 890845946, 891173633, 891173641, 891173648, 891566879, 891566887, 891960110, 892287798, 892287805, 892287813, 893074267, 893074275], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 288,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 100, "page" : 0, "pos" : [893074282, 893401970, 893401977, 893401985, 893401992, 893402008, 893795231, 893795239, 894188470, 894188477, 894581701, 894581708, 894581716], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 288,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 212, "msec" : 312, "page" : 0, "pos" : [894909418, 895302649, 895695872, 896023560, 896023567, 896416787, 896416794, 896810018, 896810022, 896810025, 896810029, 896810033, 896810037, 896810040], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 288,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 208, "msec" : 713, "page" : 0, "pos" : [896810044, 896810055, 896810074, 896810112, 897531060, 899759352, 903888206, 908344737, 912866792, 916602389, 921058882, 925580900, 930037385, 934493871, 938622669, 940916451, 942227194], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 288,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 913, "page" : 0, "pos" : [943537933, 944324387, 945241910, 945766228, 945962862], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 289,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 204, "msec" : 117, "page" : 0, "pos" : [946159470, 946880366, 948387694, 950615929, 953630608, 957562802, 961494996, 964837362, 967262216, 969687061, 972701732, 975126575], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 289,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 199, "msec" : 316, "page" : 0, "pos" : [977354808, 979779650, 981614663, 983121993, 983711819, 984039499], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 289,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 199, "msec" : 437, "page" : 0, "pos" : [985022537, 987447362, 991182901, 996950046, 1002913794, -1140802560], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 291,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 194, "msec" : 344, "page" : 0, "pos" : [964108705, 963717777], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 291,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 550, "page" : 0, "pos" : [963521893, 963325645, 963325885, 963326038, 963326098, 963326219, 963326309, 963326429, 963326729, 963326939, 963326987], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 291,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 754, "page" : 0, "pos" : [963326969, 963326939, 963326819, 963326669], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 291,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 959, "page" : 0, "pos" : [963326399, 963326128, 963325585, 963521169], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 292,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 483, "page" : 0, "pos" : [-1140802560], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 292,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 969, "page" : 0, "pos" : [1003108255, 998651882, 994129931, 990984211], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 293,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 201, "msec" : 170, "page" : 0, "pos" : [988559379, 986855443, 985741331, 985020435, 984823827, 984430611, 983316499, 982792196, 982202361, 981612522, 981088234, 980301802, 979777514, 979056618, 978073578], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 293,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 205, "msec" : 375, "page" : 0, "pos" : [977352682, 976435178, 975845354, 975648746, 975452138], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 293,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 198, "msec" : 780, "page" : 0, "pos" : [975845354, 976435178, 977352682, 978270186, 980498410, 983119850, 983906282, 984430570, 985020409, 985348089, 985741305], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 293,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 204, "msec" : 984, "page" : 0, "pos" : [986134521, 986855428, 987445252, 988166148, 989083659, 989870091, 990590987, 991705099, 992294931, 992819219, 993212435, 993802259, 994523155, 994916371, 995440659], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 294,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 190, "page" : 0, "pos" : [996030483, 996423699, 996751379, 996947987, 997341203, 997668883, 998258707, 998848531, 999372819, 999962643, 1001076755, 1001601043, 1001994259, 1002584083, 1003304979, 1003829267], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 294,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 255, "page" : 0, "pos" : [1004419091, 1005008915, 1005533203, 1006319635, 1006712851, -1140802560], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 294,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 204, "msec" : 999, "page" : 0, "pos" : [1005927837, 1004617147, 1003503076, 1002192394, 1000881707, 999374406, 998260324, 997146234, 995245713, 993017511], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 295,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 199, "msec" : 197, "page" : 0, "pos" : [990789295, 987971251, 984432307, 980500135, 975650434, 968965675, 967261706, 966344183, 965754348, 965754344], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 295,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 401, "page" : 0, "pos" : [965754333, 965754321, 965754310, 965557687], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 295,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 607, "page" : 0, "pos" : [965557665, 965557646, 965557631, 965426521, 965229895, 965033272, 964836652, 964836634, 964836626, 964836615, 964836600, 964836588, 964836573, 964836562, 964836547, 964836536], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 295,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 203, "msec" : 811, "page" : 0, "pos" : [964836528, 964836517, 964836510, 964836487, 964836480, 964836472, 964836465, 964836461, 964836457, 964836453, 964836446, 964836435, 964836431, 964836423], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 296,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 11, "page" : 0, "pos" : [964836416, 964836408, 964836401, 964836397, 964836390, 964836378, 964836371, 964836363, 964836356, 964639737, 964639722, 964639707, 964639700, 964639677, 964443047, 964443032, 964443016], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 296,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 211, "page" : 0, "pos" : [964443001, 964442979, 964442971, 964442949, 964442941, 964442926, 964442919, 964442896, 964442889, 964442874, 964442859, 964442844, 964442829, 964442814, 964442806, 964442791], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 296,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 206, "msec" : 417, "page" : 0, "pos" : [964442776, 964442761, 964442754, 964442731, 964442716, 964442701, 964442671, 964442656, 964442641, 964442626, 964442611, 964442596, 964442574, 964442566, 964442559, 964442551], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 296,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 617, "page" : 0, "pos" : [964442544, 964442551], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 296,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 209, "msec" : 826, "page" : 0, "pos" : [964442559, 964442566, 964442581, 964442626, 964442656, 964442701, 964442739, 964442784, 964246228, 964115209, 963722068, 963525520, 963328987, 963132427, 963132454, 963132476], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 297,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 200, "msec" : 26, "page" : 0, "pos" : [963132495, 963132517, 963329148, 963525782, 963919024, 964115655, 964246753, 964246768, 964639999, 964836619, 965033230, 965033234, 965033238, 965033242, 965033249], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 298,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 202, "msec" : 240, "page" : 0, "pos" : [964246802, 962018492, 959986711, 958282310, 958281691, 960180430], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 298,
          'data': '{ "docid" : "C99A9BB4F17955C3", "duration" : 207, "msec" : 645, "page" : 0, "pos" : [-1140802560], "type" : 10 }',
          'version': '2.0',
          'pageNum': 0
        }, {
          'time': 574,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.533000", "y" : "0.233333" }, { "x" : "0.532000", "y" : "0.233333" }, { "x" : "0.530000", "y" : "0.233333" }, { "x" : "0.517000", "y" : "0.240000" }, { "x" : "0.478000", "y" : "0.285000" }], "drawid" : "2019-07-23-15:51:34-608608", "drawtime" : 136, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.447000", "y" : "0.538333" }, { "x" : "0.553000", "y" : "0.568333" }, { "x" : "0.613000", "y" : "0.561667" }, { "x" : "0.644000", "y" : "0.553333" }, { "x" : "0.650000", "y" : "0.553333" }, { "x" : "0.644000", "y" : "0.555000" }, { "x" : "0.596000", "y" : "0.556667" }, { "x" : "0.555000", "y" : "0.546667" }], "drawid" : "2019-07-23-15:51:34-829829", "drawtime" : 208, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.555000", "y" : "0.546667" }, { "x" : "0.464000", "y" : "0.500000" }, { "x" : "0.428000", "y" : "0.468333" }, { "x" : "0.401000", "y" : "0.438333" }, { "x" : "0.382000", "y" : "0.410000" }, { "x" : "0.369000", "y" : "0.385000" }], "drawid" : "2019-07-23-15:51:34-829829", "drawtime" : 82, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.356000", "y" : "0.335000" }, { "x" : "0.356000", "y" : "0.315000" }, { "x" : "0.374000", "y" : "0.251667" }, { "x" : "0.432000", "y" : "0.163333" }, { "x" : "0.501000", "y" : "0.113333" }, { "x" : "0.537000", "y" : "0.110000" }, { "x" : "0.571000", "y" : "0.110000" }, { "x" : "0.601000", "y" : "0.118333" }, { "x" : "0.648000", "y" : "0.158333" }, { "x" : "0.664000", "y" : "0.183333" }, { "x" : "0.679000", "y" : "0.215000" }, { "x" : "0.704000", "y" : "0.331667" }], "drawid" : "2019-07-23-15:51:35-125125", "drawtime" : 216, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.704000", "y" : "0.331667" }, { "x" : "0.705000", "y" : "0.370000" }, { "x" : "0.694000", "y" : "0.440000" }, { "x" : "0.681000", "y" : "0.468333" }, { "x" : "0.663000", "y" : "0.501667" }, { "x" : "0.639000", "y" : "0.535000" }, { "x" : "0.607000", "y" : "0.560000" }, { "x" : "0.535000", "y" : "0.593333" }], "drawid" : "2019-07-23-15:51:35-125125", "drawtime" : 91, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.329000", "y" : "0.606667" }, { "x" : "0.317000", "y" : "0.593333" }, { "x" : "0.291000", "y" : "0.551667" }, { "x" : "0.283000", "y" : "0.538333" }, { "x" : "0.275000", "y" : "0.531667" }], "drawid" : "2019-07-23-15:51:35-539539", "drawtime" : 87, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.259000", "y" : "0.536667" }, { "x" : "0.259000", "y" : "0.543333" }, { "x" : "0.260000", "y" : "0.585000" }, { "x" : "0.264000", "y" : "0.613333" }], "drawid" : "2019-07-23-15:51:35-721721", "drawtime" : 53, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 575,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.402000", "y" : "0.713333" }, { "x" : "0.486000", "y" : "0.715000" }, { "x" : "0.513000", "y" : "0.708333" }], "drawid" : "2019-07-23-15:51:35-900900", "drawtime" : 64, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 576,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.743000", "y" : "0.400000" }, { "x" : "0.748000", "y" : "0.383333" }], "drawid" : "2019-07-23-15:51:36-084084", "drawtime" : 32, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 576,
          'data': '{ "alpha" : 1, "color" : 634351, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.601000", "y" : "0.231667" }, { "x" : "0.472000", "y" : "0.240000" }], "drawid" : "2019-07-23-15:51:36-239239", "drawtime" : 63, "height" : 600, "page" : "1", "thickness" : 8, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 580,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.386000", "y" : "0.398333" }, { "x" : "0.386000", "y" : "0.400000" }, { "x" : "0.404000", "y" : "0.423333" }], "drawid" : "2019-07-23-15:51:40-221221", "drawtime" : 88, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 580,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.499000", "y" : "0.521667" }, { "x" : "0.519000", "y" : "0.555000" }, { "x" : "0.529000", "y" : "0.585000" }, { "x" : "0.531000", "y" : "0.603333" }, { "x" : "0.528000", "y" : "0.641667" }], "drawid" : "2019-07-23-15:51:40-371371", "drawtime" : 86, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 580,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.401000", "y" : "0.776667" }, { "x" : "0.331000", "y" : "0.768333" }, { "x" : "0.274000", "y" : "0.721667" }, { "x" : "0.251000", "y" : "0.686667" }, { "x" : "0.229000", "y" : "0.646667" }], "drawid" : "2019-07-23-15:51:40-543543", "drawtime" : 89, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 580,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.142000", "y" : "0.433333" }, { "x" : "0.150000", "y" : "0.421667" }, { "x" : "0.234000", "y" : "0.375000" }], "drawid" : "2019-07-23-15:51:40-720720", "drawtime" : 58, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 580,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.541000", "y" : "0.376667" }, { "x" : "0.614000", "y" : "0.386667" }, { "x" : "0.659000", "y" : "0.398333" }, { "x" : "0.670000", "y" : "0.400000" }, { "x" : "0.680000", "y" : "0.406667" }], "drawid" : "2019-07-23-15:51:40-860860", "drawtime" : 85, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 581,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.715000", "y" : "0.436667" }, { "x" : "0.715000", "y" : "0.450000" }], "drawid" : "2019-07-23-15:51:41-045045", "drawtime" : 91, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 581,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "{13e1a95e-0c86-4f6f-b01d-b23f817ed132}", "draw" : [{ "x" : "0.715000", "y" : "0.450000" }, { "x" : "0.715000", "y" : "0.453333" }], "drawid" : "2019-07-23-15:51:41-240240", "drawtime" : 50, "height" : 600, "page" : "1", "thickness" : 2, "type" : 2, "width" : 1000 }',
          'docName': 'WhiteBorad',
          'pageNum': 1
        }, {
          'time': 583,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.654630", "y" : "0.153659" }, { "x" : "0.633333", "y" : "0.217073" }, { "x" : "0.613889", "y" : "0.241463" }, { "x" : "0.602778", "y" : "0.246341" }, { "x" : "0.592593", "y" : "0.246341" }, { "x" : "0.579630", "y" : "0.246341" }], "drawid" : "2019-07-23-15:51:43-160160", "drawtime" : 84, "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 583,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.512963", "y" : "0.300000" }, { "x" : "0.513889", "y" : "0.324390" }, { "x" : "0.523148", "y" : "0.380488" }], "drawid" : "2019-07-23-15:51:43-337337", "drawtime" : 67, "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 583,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.672222", "y" : "0.439024" }, { "x" : "0.698148", "y" : "0.412195" }, { "x" : "0.737963", "y" : "0.356098" }, { "x" : "0.755556", "y" : "0.319512" }], "drawid" : "2019-07-23-15:51:43-496496", "drawtime" : 49, "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 583,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "9A1A9B0C7BAB3721", "draw" : [{ "x" : "0.823148", "y" : "0.095122" }, { "x" : "0.823148", "y" : "0.092683" }, { "x" : "0.823148", "y" : "0.092683" }, { "x" : "0.825000", "y" : "0.092683" }, { "x" : "0.829630", "y" : "0.092683" }], "drawid" : "2019-07-23-15:51:43-643643", "drawtime" : 85, "height" : 410, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1080 }',
          'docName': '{41C9F828-EA1B-A395-23A2-14799C383D8C}.jpg',
          'pageNum': 0
        }, {
          'time': 586,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "B3A62520E544878F", "draw" : [{ "x" : "0.709375", "y" : "0.257143" }, { "x" : "0.714063", "y" : "0.257143" }, { "x" : "0.717187", "y" : "0.257143" }, { "x" : "0.720313", "y" : "0.257143" }, { "x" : "0.722656", "y" : "0.257143" }, { "x" : "0.725781", "y" : "0.257143" }, { "x" : "0.727344", "y" : "0.257143" }, { "x" : "0.728906", "y" : "0.257143" }, { "x" : "0.731250", "y" : "0.257143" }], "drawid" : "2019-07-23-15:51:46-125125", "drawtime" : 84, "height" : 35, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1280 }',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'pageNum': 0
        }, {
          'time': 586,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "B3A62520E544878F", "draw" : [{ "x" : "0.759375", "y" : "0.542857" }, { "x" : "0.764844", "y" : "0.571429" }, { "x" : "0.771875", "y" : "0.600000" }, { "x" : "0.778125", "y" : "0.628571" }, { "x" : "0.790625", "y" : "0.657143" }, { "x" : "0.796094", "y" : "0.685714" }, { "x" : "0.799219", "y" : "0.742857" }], "drawid" : "2019-07-23-15:51:46-279279", "drawtime" : 87, "height" : 35, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1280 }',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'pageNum': 0
        }, {
          'time': 586,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "B3A62520E544878F", "draw" : [{ "x" : "0.837500", "y" : "0.942857" }, { "x" : "0.842187", "y" : "0.942857" }, { "x" : "0.850000", "y" : "1.000000" }, { "x" : "0.853125", "y" : "1.000000" }], "drawid" : "2019-07-23-15:51:46-467467", "drawtime" : 60, "height" : 35, "page" : "0", "thickness" : 2, "type" : 2, "width" : 1280 }',
          'docName': '{A1F35D69-563F-DFAE-4894-7B8F796DEB17}.jpg',
          'pageNum': 0
        }, {
          'time': 588,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.453659", "y" : "0.088889" }, { "x" : "0.451220", "y" : "0.082407" }, { "x" : "0.446341", "y" : "0.080556" }, { "x" : "0.443902", "y" : "0.083333" }, { "x" : "0.443902", "y" : "0.101852" }, { "x" : "0.443902", "y" : "0.119444" }, { "x" : "0.443902", "y" : "0.154630" }], "drawid" : "2019-07-23-15:51:48-208208", "drawtime" : 95, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 588,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.443902", "y" : "0.359259" }, { "x" : "0.451220", "y" : "0.359259" }, { "x" : "0.480488", "y" : "0.356481" }, { "x" : "0.524390", "y" : "0.349074" }, { "x" : "0.578049", "y" : "0.340741" }, { "x" : "0.619512", "y" : "0.332407" }, { "x" : "0.643902", "y" : "0.326852" }], "drawid" : "2019-07-23-15:51:48-390390", "drawtime" : 85, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 588,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.512195", "y" : "0.278704" }, { "x" : "0.424390", "y" : "0.260185" }, { "x" : "0.326829", "y" : "0.241667" }, { "x" : "0.248780", "y" : "0.226852" }, { "x" : "0.212195", "y" : "0.216667" }, { "x" : "0.195122", "y" : "0.208333" }], "drawid" : "2019-07-23-15:51:48-561561", "drawtime" : 61, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 588,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.736585", "y" : "0.381481" }, { "x" : "0.851220", "y" : "0.456481" }, { "x" : "0.939024", "y" : "0.520370" }, { "x" : "0.970732", "y" : "0.550000" }, { "x" : "0.982927", "y" : "0.563889" }, { "x" : "0.982927", "y" : "0.567593" }, { "x" : "0.982927", "y" : "0.570370" }, { "x" : "0.970732", "y" : "0.572222" }], "drawid" : "2019-07-23-15:51:48-718718", "drawtime" : 85, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 588,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.443902", "y" : "0.612037" }, { "x" : "0.407317", "y" : "0.603704" }, { "x" : "0.392683", "y" : "0.597222" }, { "x" : "0.385366", "y" : "0.586111" }, { "x" : "0.385366", "y" : "0.562037" }, { "x" : "0.414634", "y" : "0.512037" }, { "x" : "0.480488", "y" : "0.449074" }], "drawid" : "2019-07-23-15:51:48-891891", "drawtime" : 73, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 589,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.880488", "y" : "0.318519" }, { "x" : "0.917073", "y" : "0.345370" }, { "x" : "0.948780", "y" : "0.376852" }, { "x" : "0.968293", "y" : "0.410185" }, { "x" : "0.968293", "y" : "0.431481" }, { "x" : "0.968293", "y" : "0.445370" }, { "x" : "0.968293", "y" : "0.454630" }], "drawid" : "2019-07-23-15:51:49-050050", "drawtime" : 73, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 590,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:49-050050", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 591,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:48-891891", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 591,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:48-718718", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 591,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:48-561561", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 591,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:48-390390", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 591,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:51:48-208208", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 592,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:46:39-065065", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 592,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:46:38-943943", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 592,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:46:38-759759", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 594,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:46:37-045045", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 594,
          'data': '{ "alpha" : 1, "color" : 12204540, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.260211", "y" : "0.663661" }, { "x" : "0.263876", "y" : "0.666444" }], "drawid" : "2019-07-23-15:51:54-360360", "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 595,
          'data': '{ "docid" : "C99A9BB4F17955C3", "drawid" : "2019-07-23-15:46:36-525525", "page" : 0, "type" : 9 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 597,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.458537", "y" : "0.603704" }, { "x" : "0.439024", "y" : "0.631481" }, { "x" : "0.429268", "y" : "0.648148" }, { "x" : "0.417073", "y" : "0.663889" }, { "x" : "0.400000", "y" : "0.687037" }, { "x" : "0.380488", "y" : "0.713889" }, { "x" : "0.365854", "y" : "0.733333" }, { "x" : "0.363415", "y" : "0.753704" }], "drawid" : "2019-07-23-15:51:57-184184", "drawtime" : 88, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 597,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.358537", "y" : "0.792593" }, { "x" : "0.365854", "y" : "0.787037" }, { "x" : "0.365854", "y" : "0.783333" }, { "x" : "0.370732", "y" : "0.775926" }, { "x" : "0.370732", "y" : "0.756481" }], "drawid" : "2019-07-23-15:51:57-348348", "drawtime" : 64, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 597,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.312195", "y" : "0.468519" }, { "x" : "0.312195", "y" : "0.448148" }, { "x" : "0.312195", "y" : "0.435185" }, { "x" : "0.312195", "y" : "0.426852" }, { "x" : "0.312195", "y" : "0.424074" }, { "x" : "0.312195", "y" : "0.423148" }, { "x" : "0.312195", "y" : "0.421296" }], "drawid" : "2019-07-23-15:51:57-504504", "drawtime" : 90, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 597,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.431707", "y" : "0.346296" }, { "x" : "0.439024", "y" : "0.346296" }, { "x" : "0.465854", "y" : "0.350926" }, { "x" : "0.534146", "y" : "0.368519" }, { "x" : "0.578049", "y" : "0.384259" }, { "x" : "0.643902", "y" : "0.407407" }], "drawid" : "2019-07-23-15:51:57-669669", "drawtime" : 87, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 597,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.770732", "y" : "0.509259" }, { "x" : "0.748780", "y" : "0.525926" }, { "x" : "0.721951", "y" : "0.542593" }, { "x" : "0.687805", "y" : "0.556481" }, { "x" : "0.651220", "y" : "0.570370" }, { "x" : "0.585366", "y" : "0.591667" }], "drawid" : "2019-07-23-15:51:57-841841", "drawtime" : 87, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }, {
          'time': 598,
          'data': '{ "alpha" : 1, "color" : 16711695, "docid" : "C99A9BB4F17955C3", "draw" : [{ "x" : "0.414634", "y" : "0.538889" }, { "x" : "0.365854", "y" : "0.484259" }, { "x" : "0.329268", "y" : "0.415741" }, { "x" : "0.319512", "y" : "0.356481" }, { "x" : "0.312195", "y" : "0.312963" }, { "x" : "0.304878", "y" : "0.293519" }, { "x" : "0.300000", "y" : "0.287037" }], "drawid" : "2019-07-23-15:51:58-010010", "drawtime" : 76, "height" : 1080, "page" : "0", "thickness" : 2, "type" : 2, "width" : 410 }',
          'docName': '{09D626D5-97EB-B1CA-0A8D-166B9D1E714E}.jpg',
          'pageNum': 0
        }],
        'animation': []
      }
    }
    opts.done(data)

    // $.ajax({
    //   url: opts.url,
    //   type: 'GET',
    //   data: opts.data,
    //   tryCount: 0,
    //   retryLimit: 3,
    //   timeout: 5000,
    //   dataType: 'jsonp',
    //   success: function (data) {
    //     opts.done(data)
    //   },
    //   error: function (xhr, textStatus, errorThrown) {
    //
    //     if (textStatus == 'timeout') {
    //       this.tryCount++
    //       if (this.tryCount < this.retryLimit) {
    //         //try again
    //         $.ajax(this)
    //         return
    //       } else {
    //         if (typeof opts.fn === 'function') {
    //           opts.fn(textStatus)
    //         }
    //         return
    //       }
    //       return
    //     }
    //     if (xhr.status == 500) {
    //       //handle error
    //     } else {
    //       //handle error
    //     }
    //   }
    // })
  }

  var substepRequestHistoryData = function (opts, fn) {
    var param = {
      liveId: opts.liveId,
      recordId: opts.recordId,
    }

    substepRequest({
      url: '//admin.bokecc.com/api/v1/record/meta.do',
      data: param,
      fn: window.on_cc_request_draw_error,
      done: function (data) {
        if (!data.success) {
          return false
        }
        setTimeout(function(){
          fn(data)
        },20)
      }
    })
  }

  // 历史数据
  var History = function (opts, callback) {

    substepRequestHistoryData(opts, success)

    //canplay
    var onCCH5PlayerLoad = false

    function success (data) {

      var data = data

      if (DWDpc.fastMode) {
        // $('#documentDisplayMode').val(data.datas.room.documentDisplayMode)
        DWDpc.appendDrawPanel()
        DWDpc.init()
      }

      if (typeof window.on_cc_callback_player === 'function') {
        window.on_cc_callback_player(data)
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

      var meta = data.data
      if (!meta) {
        return
      }

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
        pageChanges.sort(function (p1, p2) {
          return parseInt(p1.time) - parseInt(p2.time)
        })
        callback.pageChanges = pageChanges
      }

      //文档信息加载完成，首先渲染首页
      if (callback.pageChanges && callback.pageChanges.length) {
        callback.drawPanel.filp(callback.pageChanges[0])
      }

      var animations = meta.animation
      if (animations && animations.length) {
        animations.sort(function (p1, p2) {
          return parseInt(p1.time) - parseInt(p2.time)
        })
        callback.animations = animations
      }


      var draws = meta.draw
      if (draws && draws.length) {
        callback.draws = draws
      }

      callback.isHistoryReady = true

      callback.drawPanel.isReady = true
      setTimeout(function () {
        initDrawPanelInfo()
      }, 1500)

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

    this.drawPanel = new DrawPanel(opts, this)
    this.history = new History(opts, this)
  }

  var callback = {}
  callback.callbackPlayer = {}

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
    dpc: {},
    fastMode: false,
    init: function () {
      this.dpc = new Dpc()
    },
    appendDrawPanel: function () {
      var dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;"></iframe>'
      if (MobileLive.isMobile() == 'isMobile') {
        dp = '<iframe id="dpa" allow-scripts allowfullscreen allowusermedia frameborder="0" style="width: 100%;height:100%;pointer-events: none;"></iframe>'
      }
      $('#playbackPanel').parent().append(dp)
      $('div#playbackPanel').remove()

      if (typeof window.on_cc_live_db_flip === 'function') {
        window.on_cc_live_db_flip()
      }
    },
    pageChange: function (pc) {
      if (!this.fastMode) {
        return
      }
      this.dpc.pageChange(pc)
    },
    animationChange: function (ac) {
      if (!this.fastMode) {
        return
      }
      this.dpc.animationChange(ac)
    },
    history: function (h) {
      if (!this.fastMode) {
        return
      }
      this.dpc.history(h)
    },
    draw: function (d) {
      if (!this.fastMode) {
        return
      }
      this.dpc.draw(d)
    },
    clear: function () {
      if (!this.fastMode) {
        return
      }
      this.dpc.clear()
    },
    docAdapt: function (t) {
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
    console.log(callback)
  }

  var DW = {
    isH5play: false,
    fastMode: false,
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
        this.fastMode = false
      }
    },
    // 初始化DW对象
    config: function (opts) {
      if (checkVideo()) {
        if (opts.isH5play + '' === 'true') {
          this.isH5play = true
        } else {
          this.isH5play = false
        }
      }
      this.isH5play = true

      this.setFastMode(opts)
      // DWDpc.fastMode = this.fastMode
      DWDpc.fastMode = true

      var scriptArray = [
        '//static.csslcloud.net/js/socket.io.js',
        '//static.csslcloud.net/js/swfobject.js',
        '//image.csslcloud.net/js/dpc.js?v=' + (Math.floor(Math.random() * 10000)),
        '//static.csslcloud.net/js/json3.min.js'
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
      $('div#playbackPanel').remove()
    },
    logout: function () {
      $.ajax({
        url: '//view.csslcloud.net/api/callback/logout',
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
        },
        error: function (xhr, status, error) {
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

    points: [],
    seekTimer: 0,
    viewResult: function () {
      var self = this
      if (self.points && self.points.length) {
        var index = 0
        seekOnce(self.points)

        function seekOnce (points) {
          var point = points[index]
          self.seek(point.start)
          self.seekTimer && clearInterval(self.seekTimer)
          self.seekTimer = setInterval(seekTimerCallback, 500, points)
        }

        function seekTimerCallback (points) {
          var currentTime = self.getPlayerTime()
          console.log(currentTime)

          var point = points[index]
          if (index < points.length - 1) {
            if (currentTime >= point.end) {
              index = index + 1
              point = points[index]
              self.seek(point.start)
            }
          } else {
            clearInterval(self.seekTimer)
            self.seekTimer = 0
          }
        }
      }
    },
    viewPoint: function (point) {
      console.log(point)
      this.points = point
      var sliderBoxWidth = document.getElementById('progress-box').clientWidth
      var duration = this.getDuration()

      var template = ''
      for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i]
        var left = (point.start / duration) * sliderBoxWidth
        var right = (point.end / duration) * sliderBoxWidth
        var width = right - left
        template += '<span class="time-section" style="left: ' + left + 'px;width:' + width + 'px"></span>'
      }
      $('#timeSectionWrapper').html(template)
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
    // options.videoId = data.live.encryptRecordvideoId
    // options.recordId = data.encryptRecordId
    var aa = new CallbackPlayer(options)

    callback.callbackPlayer = new CallbackPlayer(options)
  }

  // 播放器加载完成，开始播放
  window.on_cc_live_player_init = function () {
    callback.callbackPlayer.isReady = true
    try {
      callback.callbackPlayer.getFlash().start()
    } catch (e) {
    }
    // 同时开始实时显示聊天信息
    setInterval(function () {
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
    setInterval(function () {
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
    setInterval(function () {
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
    setInterval(function () {
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
        callback.drawPanel.filp(JSON.stringify({
          'fileName': pc.docName,
          'totalPage': pc.docTotalPage,
          'docid': pc.encryptDocId,
          'url': pc.url,
          'page': pc.pageNum,
          'useSDK': pc.useSDK
        }))

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

      function getInfo (opts) {
        $.ajax({
          url: '//admin.bokecc.com/api/v1/videos/address.do',
          type: 'GET',
          dataType: 'jsonp',
          data: {
            recordIds: opts.recordId,
            type: isMp4
          },
          success: function (data) {
            if (data.success && data && data.videos && data.videos.length > 0) {
              var pvdefault = data.videos[0]

              var playurl = pvdefault.playurl
              var secureplayurl = pvdefault.secureplayurl

              var isHttps = window.location.protocol === 'https:'
              if (isHttps && !!secureplayurl) {
                playurl = secureplayurl
              }
              _this.appendVideo(playurl, opts)
            }
            // if (data.isValid === 'false') {
            //   // 加密视频仍然用flash播放
            //   DW.isH5play = false
            //   callback.callbackPlayer.flashPlayerInit()
            // } else {
            //   if (data && data.video && data.video.length > 0) {
            //     var pvdefault = data.video[0]
            //
            //     var playurl = pvdefault.playurl
            //     var secureplayurl = pvdefault.secureplayurl
            //
            //     var isHttps = window.location.protocol === 'https:'
            //     if (isHttps && !!secureplayurl) {
            //       playurl = secureplayurl
            //     }
            //     _this.appendVideo(playurl, opts)
            //   } else {
            //     window.on_cc_live_player_load_fail && window.on_cc_live_player_load_fail()
            //   }
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

    appendVideo: function (src, opts) {
      var _this = this

      var v = '<video controls id="playbackVideo" webkit-playsinline playsinline autoplay x-webkit-airplay="deny" x5-playsinline width="100%" height="100%" src="' + src + '"></video>'
      $('#' + playbackPlayer.id).html(v)
      var video = document.getElementById('playbackVideo')

      if (this.useHls && !util.isMp4(src)) {
        if (Hls.isSupported()) {
          var hls = new Hls()
          hls.attachMedia(video)
          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            hls.loadSource(src)
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


})(jQuery, window, document, undefined)