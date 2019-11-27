/* eslint-disable */

export default class FullScreen {
  _target = {}

  constructor (target, enterFullScreenCallback, exitFullScreenCallback) {
    this.init(target, enterFullScreenCallback, exitFullScreenCallback)
  }

  init (target, enterFullScreenCallback, exitFullScreenCallback) {
    this._target = target
    this.addFullScreenListioner(enterFullScreenCallback, exitFullScreenCallback)
  }

  bind (type, callback, useCapture = false) {
    if (document.addEventListener) {
      document.addEventListener(type, callback, useCapture)
    } else if (document.attachEvent) {
      document.attachEvent('on' + type, callback)
    }
    return this
  }

  addFullScreenListioner (enterFullScreenCallback, exitFullScreenCallback) {
    this.bind('fullscreenchange', function (event) {
      if (!!document.fullscreenElement) {
        enterFullScreenCallback(document.fullscreenElement)
      } else {
        exitFullScreenCallback()
      }
    })
    this.bind('mozfullscreenchange', function (event) {
      if (!!document.mozFullScreenElement) {
        enterFullScreenCallback(document.mozFullScreenElement)
      } else {
        exitFullScreenCallback()
      }
    })
    this.bind('webkitfullscreenchange', function (event) {
      if (!!document.webkitFullscreenElement) {
        enterFullScreenCallback(document.webkitFullscreenElement)
      } else {
        exitFullScreenCallback()
      }
    })
    document.onmsfullscreenchange = function (event) {
      if (!!document.msFullscreenElement) {
        enterFullScreenCallback(document.msFullscreenElement)
      } else {
        exitFullScreenCallback()
      }
    }
  }

  webFullScreen () {
    if (this.supportFullScreen()) {
      this.toggleFullScreen()
    }
  }

  supportFullScreen () {
    var doc = document.documentElement
    return ('requestFullscreen' in doc) ||
      ('webkitRequestFullScreen' in doc) ||
      ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
      false
  }

  toggleFullScreen () {
    if (!this.isWebFullScreen()) {
      this.requestFullscreen()
    } else {
      this.exitFullscreen()
    }
  }

  isWebFullScreen () {
    return !!(document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.webkitFullScreen ||
      document.msFullScreen)
  }

  requestFullscreen () {
    let target = this._target
    if (target.requestFullscreen) {
      target.requestFullscreen()
    } else if (target.webkitRequestFullScreen) {
      if (window.navigator.userAgent.toUpperCase().indexOf('CHROME') >= 0) {
        target.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      } else {
        target.webkitRequestFullScreen()
      }
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen()
    }
  }

  exitFullscreen () {
    if (document.exitFullScreen) {
      document.exitFullScreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}
