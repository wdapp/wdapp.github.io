let $ = window.$

class HuodeScene {
  constructor () {
    $ = window.$
  }

  login (options) {
    if (typeof options !== 'object' || !$.DW || typeof $.DW.config !== 'function') {
      return false
    }

    $.DW.config({
      userId: options.userId,
      roomId: options.roomId,
      recordId: options.recordId,
      groupId: options.groupId,
      viewername: options.viewerName,
      viewertoken: options.viewerToken,
      isH5play: true,
      fastMode: true
    })

    window.on_cc_login_success = function (result) {
      options.success && options.success(result)
    }

    window.on_cc_login_error = function (error) {
      options.fail && options.fail(error)
    }
  }

  destroy (options) {
    // 销毁实例
    $.DW.destroy && $.DW.destroy()
    // 退出登录
    $.DW.logout && $.DW.logout({
      success (data) {
        options.success && options.success(data)
      },
      error (xhr, status, error) {
        options.fail && options.fail(xhr, status, error)
      }
    })
  }

  showControl (isShow) {
    const _isShow = !!isShow
    const is = _isShow ? 0 : 1
    $.DW.isShowBar && $.DW.isShowBar(is)
  }

  docAdapt (adapt) {
    const _adapt = !!adapt
    $.DW.docAdapt && $.DW.docAdapt(_adapt)
  }

  setRate (rate) {
    const _rate = parseFloat(rate)
    if (isNaN(_rate)) {
      return false
    }
    $.DW.playbackRate && $.DW.playbackRate(_rate)
  }

  setSound (volume) {
    const _volume = parseFloat(volume)
    $.DW.setVolume && $.DW.setVolume(_volume)
  }

  getSound () {
    return $.DW.getVolume()
  }

  togglePlay () {
    $.DW.play && $.DW.play()
  }

  getDuration () {
    if (!$.DW.getDuration) {
      return false
    }
    return $.DW.getDuration()
  }

  getCurrentTime () {
    if (!$.DW.getPlayerTime) {
      return false
    }
    return $.DW.getPlayerTime()
  }

  seek (time) {
    const _time = parseFloat(time)
    if (isNaN(_time)) {
      return false
    }
    $.DW.seek && $.DW.seek(_time)
  }

  onPlayerLoad (callback) {
    window.on_cc_live_player_load = function () {
      callback && callback()
    }
  }

  onPlaying (callback) {
    window.on_player_start = function () {
      callback && callback()
    }
  }

  onPause (callback) {
    window.on_spark_player_pause = function () {
      callback && callback()
    }
  }

  onEnded (callback) {
    window.on_spark_player_end = function () {
      callback && callback()
    }
  }
}

export default HuodeScene
