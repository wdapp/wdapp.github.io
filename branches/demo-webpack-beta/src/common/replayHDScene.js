/**
 * 获得场景视频观看回放对象
 * 提供观看回放相关事件、方法、属性、公共方法
 * */
import 'babel-polyfill' //IE 9 兼容 ECMAScript 6
import ReplayAdaptive from 'common/replayAdaptive'
import Utils from 'common/utils'

class HDScene extends ReplayAdaptive {

  constructor() {
    super()
    Utils.log({
      debug: Utils.debug,
      PATH: Utils.PATH,
      userAgent: Utils.userAgent,
      version: Utils.version,
      timestamp: Utils.timestamp,
      tag: Utils.tag,
      admin: Utils.admin,
    })
  }

  components(options) {
    let componentArrays = []
    for (let index in options) {
      let component = options[index]
      componentArrays.push(new component())
    }
    return componentArrays
  }

  ready(callback, useCapture = false) {
    window.addEventListener('DOMContentLoaded', callback, useCapture)
  }

  onOrientationChange(callback, useCapture = false) {
    window.addEventListener('orientationchange', callback, useCapture)
  }

  onResize(callback, useCapture = false) {
    window.addEventListener('resize', callback, useCapture)
  }

  onRotateScreenChange(callback, useCapture = false) {
    let supportOrientation = (typeof window.orientation === 'number' &&
      typeof window.onorientationchange === 'object')
    Utils.log('supportOrientation', supportOrientation)
    if (supportOrientation) {
      this.onOrientationChange(() => {
        this.updateOrientation(supportOrientation, (orientation) => {
          callback(orientation)
        })
      }, useCapture)
    } else {
      this.onResize(() => {
        this.updateOrientation(supportOrientation, (orientation) => {
          callback(orientation)
        })
      }, useCapture)
    }
    this.updateOrientation(supportOrientation, (orientation) => {
      callback(orientation)
    })
  }

  updateOrientation = function (supportOrientation, callback) {
    let orientation = 0
    if (supportOrientation) {
      orientation = window.orientation
      switch (orientation) {
        case 90:
        case -90:
          orientation = 'landscape'
          break
        default:
          orientation = 'portrait'
          break
      }
    } else {
      orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
    }
    callback(orientation)
  }

}

let HD = (function () {
  let _instance = null
  return function () {
    if (!_instance) {
      _instance = new HDScene()
    }
    return _instance
  }
})()

window.HDScene = window.replayHDScene = window.hd = window.HD = HD()

HDScene.emit = HDScene.fire

export default HD