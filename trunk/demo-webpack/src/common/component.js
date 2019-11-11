/**
 * 组件基类
 * */
import Render from 'common/render'
import Utils from 'common/utils'

class Component extends Render {

  constructor() {
    super()
  }

  bind(target, type, callback, useCapture = false) {
    if (!this.isEmptyNode(target) || !Utils.isEmptyString(type)) {
      return false
    }
    if (target.addEventListener) {
      target.addEventListener(type, callback, useCapture)
    }
    else if (target.attachEvent) {
      target.attachEvent('on' + type, callback)
    }
    return this
  }

  removeEvents(target, type, callback, useCapture = false) {
    if (!this.isEmptyNode(target) || !Utils.isEmptyString(type)) {
      return false
    }
    if (target.removeEventListener) {
      target.removeEventListener(type, callback, useCapture)
    }
    else if (target.detachEvent) {
      target.detachEvent('on' + type, callback)
    }
    return this
  }
}

export default Component