import Utils from 'common/utils'
import UserInterface from 'common/userInterface'

class FullScreen {
  isShowLeft = true
  isShowRight = true
  isFullScreen = false
  fullscreenCallback = {}

  constructor() {
    this.ui = new UserInterface()
    this.fullScreenButton = document.getElementsByClassName('full-screen-btn')[0]
    this.className = this.fullScreenButton.className
    this.isSupportFullscreen = this.supportFullscreen()
    if (this.isSupportFullscreen) {
      this.addFullScreenListioner(() => {
        this.isFullScreen = true
        this.fullscreenComplete(this.isFullScreen, this.fullscreenCallback)
        Utils.log('enterFullscreen')
      }, () => {
        this.isFullScreen = false
        this.fullscreenComplete(this.isFullScreen, this.fullscreenCallback)
        Utils.log('exitFullscreen')
      })
    }
  }

  fullscreenComplete(isFullScreen, fullscreenCallback) {
    this.updateFullScreenState(isFullScreen, fullscreenCallback)
  }

  bind(type, callback, useCapture = false) {
    if (document.addEventListener) {
      document.addEventListener(type, callback, useCapture)
    }
    else if (document.attachEvent) {
      document.attachEvent('on' + type, callback)
    }
    return this
  }

  addFullScreenListioner(enterFullscreenCallback, exitFullscreenCallback) {
    this.bind('fullscreenchange', function (event) {
      if (!!document.fullscreenElement) {
        enterFullscreenCallback(document.fullscreenElement)
      } else {
        exitFullscreenCallback()
      }
    })
    this.bind('mozfullscreenchange', function (event) {
      if (!!document.mozFullScreenElement) {
        enterFullscreenCallback(document.mozFullScreenElement)
      } else {
        exitFullscreenCallback()
      }
    })
    this.bind('webkitfullscreenchange', function (event) {
      if (!!document.webkitFullscreenElement) {
        enterFullscreenCallback(document.webkitFullscreenElement)
      } else {
        exitFullscreenCallback()
      }
    })
    document.onmsfullscreenchange = function (event) {
      if (!!document.msFullscreenElement) {
        enterFullscreenCallback(document.msFullscreenElement)
      } else {
        exitFullscreenCallback()
      }
    }
  }

  supportFullscreen() {
    var doc = document.documentElement
    return ('requestFullscreen' in doc) ||
      ('webkitRequestFullScreen' in doc) ||
      ('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
      false
  }

  toggleFullScreen(callback) {
    if (this.isSupportFullscreen) {
      this.webFullScreen(callback)
    } else {
      this.animationFullScreen(callback)
    }
  }

  webFullScreen(callback) {
    this.fullscreenCallback = callback
    if (!this.isWebFullScreen()) {
      let centerWrapper = document.getElementById('centerWrapper')
      this.requestFullscreen(centerWrapper)
    } else {
      this.exitFullscreen()
    }
  }

  requestFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
    else if (elem.webkitRequestFullScreen) {
      // 对 Chrome 特殊处理，
      // 参数 Element.ALLOW_KEYBOARD_INPUT 使全屏状态中可以键盘输入。
      if (window.navigator.userAgent.toUpperCase().indexOf('CHROME') >= 0) {
        elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      }
      // Safari 浏览器中，如果方法内有参数，则 Fullscreen 功能不可用。
      else {
        elem.webkitRequestFullScreen()
      }
    }
    else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    }
  }

  exitFullscreen() {
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

  isWebFullScreen() {
    return !!(document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.webkitFullScreen ||
      document.msFullScreen)
  }

  animationFullScreen() {
    if (this.isFullScreen) {
      this.ui.showLeft(() => {
      }, 0)
      this.ui.showRight(() => {
        this.updateFullScreenState(this.isFullScreen, callback)
      }, 0)
    } else {
      this.ui.hideLeft(() => {
      }, 0)
      this.ui.hideRight(() => {
        this.updateFullScreenState(this.isFullScreen, callback)
      }, 0)
    }
    this.isFullScreen = !this.isFullScreen
  }

  updateFullScreenState(isFullScreen, callback) {
    if (isFullScreen) {
      this.isShowRight = false
      this.isShowLeft = false
      this.fullScreenButton.className = this.className + ' active'
    } else {
      this.isShowLeft = true
      this.isShowRight = true
      this.fullScreenButton.className = this.className
    }
    callback && callback(isFullScreen)
  }

  toggleLeftBar() {
    if (this.isShowLeft) {
      this.ui.hideLeft(() => {
        this.updateBarState()
        Utils.log('hideLeft')
      })
    } else {
      this.ui.showLeft(() => {
        this.updateBarState()
        Utils.log('showLeft')
      })
    }
    this.isShowLeft = !this.isShowLeft
  }

  toggleRightBar() {
    if (this.isShowRight) {
      this.ui.hideRight(() => {
        this.updateBarState()
        Utils.log('hideRight')
      })
    } else {
      this.ui.showRight(() => {
        this.updateBarState()
        Utils.log('showRight')
      })
    }
    this.isShowRight = !this.isShowRight
  }

  updateBarState() {
    if (this.isShowLeft == this.isShowRight) {
      this.isFullScreen = !this.isShowLeft
      this.updateFullScreenState(this.isFullScreen)
    }
  }
}


export default FullScreen