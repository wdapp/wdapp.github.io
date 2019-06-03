/**
 * 获得场景视频观看直播对象
 * 提供观看回放相关事件、方法、属性、公共方法
 * */
import 'babel-polyfill'//IE 9 兼容 ECMAScript 6
import LiveAdaptive from 'common/liveAdaptive'
import Utils from 'common/utils'
import config from 'common/config'

class HDScience extends LiveAdaptive {

  constructor() {
    super()
    window.debug = config.debug

    Utils.log({
      debug: window.debug,
      PATH: Utils.PATH,
      useragent: Utils.useragent,
      version: Utils.version,
      timestamp: Utils.timestamp,
      tag: Utils.tag,
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
}

let HD = (function () {
  let _instance = null
  return function () {
    if (!_instance) {
      _instance = new HDScience()
    }
    return _instance
  }
})()

window.hd = window.HD = HD()

hd.emit = hd.fire

export default HD