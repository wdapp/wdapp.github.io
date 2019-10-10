/**
 * UI动画组件库
 * */
import Render from 'common/render'//公共方法
import Utils from 'common/utils'//公共方法
import Velocity from 'velocity-animate'//JavaScript动画库
import 'bootstrap'

class UserInterface extends Render {
  alertIndex = 0
  _toggleBarInterval = 10
  alertTipTimer = 0

  constructor() {
    super()
  }

  alert(options) {
    if (!Utils.isEmptyObject(options)) {
      return false
    }
    // type primary secondary success danger warning info light dark
    let {content = '', type = 'success', time = 2500} = options
    let template = `<div class="alert alert-${type ? type : 'success'}" role="alert" style="top:${(this.alertIndex < 5 ? this.alertIndex : 5) * 58}px">${content}</div>`
    let root = this.getRoot()
    let element = this.appendChild(root, template)
    this.alertIndex++
    if (time) {
      Velocity(element, 'fadeOut', {
        delay: time,
        duration: 500,
        complete: (elements) => {
          this.deleteNodes(elements)
          this.alertIndex--
        }
      })
    }
  }

  alertTip(options) {
    if (!Utils.isEmptyObject(options)) {
      return false
    }
    let {parentNodeId = '', content = '', type = 'warning', time = 5000} = options

    $('.alert-tip-close').alert('close')

    let template = `<div id="alertTip" class="alert alert-${type ? type : 'warning'} alert-dismissible fade in" role="alert">
        <button type="button" class="close alert-tip-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
        <strong>${content}</strong>
      </div>`

    let parentNode = this.getAlertTipParentNode(parentNodeId)
    this.appendChild(parentNode, template)

    this.alertTipTimer && clearTimeout(this.alertTipTimer)
    this.alertTipTimer = setTimeout(() => {
      let alertTips = parentNode.getElementsByClassName('alert-dismissible')
      for (let alertTip of alertTips) {
        parentNode.removeChild(alertTip)
      }
    }, time)
  }

  alertTipClose() {
    $('#alertTip').alert('close')
  }

  tip(content = '') {
    if (!Utils.isEmptyString(content)) {
      return false
    }
    let root = this.getRoot()
    let tips = root.getElementsByClassName('tip-wrapp')
    for (let tip of tips) {
      Velocity(tip, 'stop')
      root.removeChild(tip)
    }
    let template = `<div id="tipWrapp" class="tip-wrapp"><span class="tip-text">${content}</span></div>`
    let element = this.appendChild(root, template)

    let tipWrapp = document.getElementById('tipWrapp')
    tipWrapp.onclick = function () {
      Velocity(this, 'stop')
      root.removeChild(this)
    }

    Velocity(element, 'fadeOut', {
      delay: 2500,
      duration: 500,
      complete: (elements) => {
        this.deleteNodes(elements)
      }
    })
  }

  getAlertTipParentNode(id) {
    let parentNode = {}
    if (id) {
      parentNode = document.getElementById(id)
    } else {
      parentNode = this.getRoot()
    }
    return parentNode
  }

  modal(options) {
    if (typeof options !== 'object' || $('#modal').length) {
      return false
    }

    let {title = '', content = '', showButton = true, cancelText = 'Cancel', confirmText = 'Confirm', cancel = null, confirm = null, complete = null} = options
    let template = `
      <div id="modal" class="modal fade" tabindex="-1" role="dialog" data-show="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title">${title}</h4>
            </div>
            <div class="modal-body">
            ${content}
            </div>
            <div class="modal-footer" style="display: ${showButton ? 'block' : 'none'}">
              <button id="cancel" style="visibility: ${cancelText ? 'visible' : 'hidden'}" type="button" class="btn btn-default" data-dismiss="modal">${cancelText}</button>
              <button id="confirm" style="visibility: ${confirmText ? 'visible' : 'hidden'}" type="button" class="btn btn-primary">${confirmText}</button>
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->
    `
    let root = this.getRoot()
    let element = this.appendChild(root, template)
    $('#modal').modal('show')
    $('#modal').on('hidden.bs.modal', (event) => {
      complete && complete()
      this.deleteNode(element)
    })
    $('#cancel').click(function () {
      cancel && cancel()
      $('#modal').modal('hide')
    })
    $('#confirm').click(function () {
      confirm && confirm()
      $('#modal').modal('hide')
    })
    return $('#modal')
  }

  hideLeft(callback, interval = this._toggleBarInterval) {
    let left = this.getNode('left')
    let leftBar = this.getNode('leftBar')
    let center = this.getNode('center')
    Velocity(left, {
      width: '0rem',
    }, {
      duration: interval,
      complete: () => {
        this.addClass(leftBar, 'left-bar-active')
      }
    }, {
      easing: 'ease-out'
    })
    Velocity(center, {
      left: '.12rem',
    }, {
      duration: interval,
      complete: () => {
        callback && callback()
      }
    }, {
      easing: 'ease-out'
    })
  }

  showLeft(callback, interval = this._toggleBarInterval) {
    let left = this.getNode('left')
    let leftBar = this.getNode('leftBar')
    let center = this.getNode('center')
    Velocity(left, {
      width: '2.6rem',
    }, {
      duration: interval,
      complete: () => {
        this.removeClass(leftBar, 'left-bar-active')
      }
    }, {
      easing: 'easeInSine'
    })
    Velocity(center, {
      left: '2.6rem',
    }, {
      duration: interval,
      complete: () => {
        callback && callback()
      }
    }, {
      easing: 'easeInSine'
    })
  }

  hideRight(callback, interval = this._toggleBarInterval) {
    let right = this.getNode('right')
    let rightBar = this.getNode('rightBar')
    let center = this.getNode('center')
    Velocity(right, {
      width: '0rem',
    }, {
      duration: interval,
      complete: () => {
        this.addClass(rightBar, 'right-bar-active')
      }
    }, {
      easing: 'ease-out'
    })
    Velocity(center, {
      right: '.12rem',
    }, {
      duration: interval,
      complete: () => {
        callback && callback()
      }
    }, {
      easing: 'ease-out'
    })
  }

  showRight(callback, interval = this._toggleBarInterval) {
    let right = this.getNode('right')
    let rightBar = this.getNode('rightBar')
    let center = this.getNode('center')
    Velocity(right, {
      width: '2.6rem',
    }, {
      duration: interval,
      complete: () => {
        this.removeClass(rightBar, 'right-bar-active')
      }
    }, {
      easing: 'easeInSine'
    })
    Velocity(center, {
      right: '2.6rem',
    }, {
      duration: interval,
      complete: () => {
        callback && callback()
      }
    }, {
      easing: 'easeInSine'
    })
  }

  moveX(node, left, callback) {
    Velocity(node, {
      left: left + 'px',
    }, {
      complete: () => {
        callback && callback()
      }
    }, {
      easing: 'easeInSine'
    })
  }

  fadeIn(options) {
    Velocity(options.node, 'fadeIn', {
      duration: options.time || 600,
      complete: () => {
        options.complete && options.complete()
      }
    })
  }

  fadeOut(options) {
    Velocity(options.node, 'fadeOut', {
      duration: options.time || 300,
      complete: () => {
        options.complete && options.complete()
      }
    })
  }
}

export default UserInterface