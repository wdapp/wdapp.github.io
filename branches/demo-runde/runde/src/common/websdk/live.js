let DWLive = window.DWLive

class HuodeScene {
  login (options) {
    DWLive.init({
      userid: options.userId,
      roomid: options.roomId,
      viewername: options.viewerName,
      viewertoken: options.viewerToken,
      fastMode: true
    })

    DWLive.onLoginSuccess = function (result) {
      options.success && options.success(result)
    }

    DWLive.onLoginError = function (error) {
      options.fail && options.fail(error)
    }
  }

  showControl (isShow) {
    const _isShow = !!isShow
    DWLive.showControl(_isShow)
  }

  docAdapt (adapt) {
    const _adapt = !!adapt
    DWLive.docAdapt(_adapt)
  }

  onLoginSuccess (callback) {
    DWLive.onLoginSuccess = function (result) {
      callback(result)
    }
  }

  onLoginError (callback) {
    DWLive.onLoginError = function (error) {
      callback(error)
    }
  }

  onPlayerLoad (callback) {
    window.on_cc_swf_loading_completed = function () {
      callback()
    }
  }
}

let HD = new HuodeScene()

window.HD = HD

export default HD
