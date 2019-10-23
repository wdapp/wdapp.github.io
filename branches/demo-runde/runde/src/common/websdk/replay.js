let $ = window.$

class HuodeScene {
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
    $.DW.destroy()
    // 退出登录
    $.DW.logout({
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

  setSound (volume) {
    const _volume = parseFloat(volume)
    $.DW.setVolume && $.DW.setVolume(_volume)
  }

  getSound () {
    return $.DW.getVolume()
  }

  onPlayerLoad (callback) {
    window.on_cc_live_player_load = function () {
      callback && callback()
    }
  }
}

export default HuodeScene
