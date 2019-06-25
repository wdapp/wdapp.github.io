import Utils from 'common/utils'
import UserInterface from 'common/userInterface'

class FullScreen {
  isShowLeft = true
  isShowRight = true
  isFullScreen = false
  fullScreenStateChange = {}

  constructor() {
    this.ui = new UserInterface()
    this.fullScreenButton = document.getElementsByClassName('full-screen-btn')[0]
    this.className = this.fullScreenButton.className
    this.isSupportFullscreen = this.supportFullscreen()
    if (this.isSupportFullscreen) {
      this.addFullScreenListioner(() => {
        this.isFullScreen = true
        this.updateFullScreenState(this.isFullScreen, this.fullScreenStateChange)
        Utils.log('enterFullscreen')
      }, () => {
        this.isFullScreen = false
        this.updateFullScreenState(this.isFullScreen, this.fullScreenStateChange)
        Utils.log('exitFullscreen')
      })
    }
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

  toggleFullScreen(options) {
    if (this.isSupportFullscreen) {
      this.webFullScreen(options.fullScreenStateChange)
    } else {
      this.animationFullScreen(options.fullScreenStateChange)
    }
  }

  webFullScreen(callback) {
    this.fullScreenStateChange = callback
    if (!this.isWebFullScreen()) {
      this.requestFullscreen()
    } else {
      this.exitFullscreen()
    }
  }

  requestFullscreen() {
    let elem = document.getElementById('center')
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

  animationFullScreen(callback) {
    if (this.isFullScreen) {
      this.ui.showLeft(() => {
      })
      this.ui.showRight(() => {
        this.updateFullScreenState(this.isFullScreen, callback)
      })
    } else {
      this.ui.hideLeft(() => {
      })
      this.ui.hideRight(() => {
        this.updateFullScreenState(this.isFullScreen, callback)
      })
    }
    this.isFullScreen = !this.isFullScreen
  }

  updateFullScreenState(isFullScreen, callback) {
    if (isFullScreen) {
      if (!this.isSupportFullscreen) {
        this.isShowRight = false
        this.isShowLeft = false
      }
      this.fullScreenButton.className = this.className + ' active'
    } else {
      if (!this.isSupportFullscreen) {
        this.isShowLeft = true
        this.isShowRight = true
      }
      this.fullScreenButton.className = this.className
    }
    callback && callback({isFullScreen})
  }

  toggleLeftBar(options) {
    if (this.isShowLeft) {
      this.ui.hideLeft(() => {
        this.updateBarState(options, this.isShowLeft)
        Utils.log('hideLeft')
      })
    } else {
      this.ui.showLeft(() => {
        this.updateBarState(options, this.isShowLeft)
        Utils.log('showLeft')
      })
    }
    this.isShowLeft = !this.isShowLeft
  }

  toggleRightBar(options) {
    if (this.isShowRight) {
      this.ui.hideRight(() => {
        this.updateBarState(options, this.isShowRight)
        Utils.log('hideRight')
      })
    } else {
      this.ui.showRight(() => {
        this.updateBarState(options, this.isShowRight)
        Utils.log('showRight')
      })
    }
    this.isShowRight = !this.isShowRight
  }

  updateBarState(options, barState) {
    if (!this.isSupportFullscreen && this.isShowLeft == this.isShowRight) {
      this.isFullScreen = !this.isShowLeft
      this.updateFullScreenState(this.isFullScreen, options.fullScreenStateChange)
    } else {
      options.barStateChange && options.barStateChange({barState})
      if (this.fullScreenButton.className == this.className + ' active') {
        this.fullScreenButton.className = this.className
      }
    }
  }
}


export default FullScreen