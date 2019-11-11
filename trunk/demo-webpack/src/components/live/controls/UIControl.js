import Render from 'common/render'
import UserInterface from 'common/userInterface'
import Utils from 'common/utils'

class UI extends Render {
  _isShowLeft = true
  _isShowRight = true
  _isSwitch = true

  constructor() {
    super()
    this.ui = new UserInterface()

    this.videoNode = this.getChildNode('player')
    this.dpNode = this.getChildNode('document')
  }

  _isMainVideo = false

  get isMainVideo() {
    return this._isMainVideo
  }

  set isMainVideo(v) {
    this._isMainVideo = v
  }

  bindLeftBar() {
    if (this._isShowLeft) {
      this.ui.hideLeft(() => {
        Utils.log('hideLeft')
      })
    } else {
      this.ui.showLeft(() => {
        Utils.log('showLeft')
      })
    }
    this._isShowLeft = !this._isShowLeft
  }

  bindRightBar() {
    if (this._isShowRight) {
      this.ui.hideRight(() => {
        Utils.log('hideRight')
      })
    } else {
      this.ui.showRight(() => {
        Utils.log('showRight')
      })
    }
    this._isShowRight = !this._isShowRight
  }

  logoutWindow() {
    location.href = Utils.PATH.INDEX
  }

  setUserCount(l) {
    let userCount = this.getNodeByClass('controls-online-number')
    this.innerHTML(userCount, l.toString())
  }

  setViewName(name) {
    let viewerNode = this.getNodeByClass('controls-user')
    this.innerHTML(viewerNode, name)
  }

  insertLines(v) {
    let m = ''
    for (let i = 0; i < v.length; i++) {
      let obj = v[i]
      let name = obj.name
      let selected = obj.select
      let html = `<div class="radio-wrapp">
                             <input class="line-radio" type="radio" index=${i} ${(selected == 1) ? 'checked' : ''} name="line" id=${'line_' + i}><label class="line-label" for="line_${i}">${name}</label>
                        </div>`
      m += html
    }
    return `<div class="line-wrap">
                <p class="line-title">以下可以选择的网络途径：</p>
                ${m}
              </div>`
  }

  // 切换文档视频
  switchPanel() {
    this.switchClass()
  }

  //类名切换
  switchClass() {
    let left = document.querySelector('.left')
    let center = document.querySelector('.center')
    let leftBar = document.getElementById('leftBar')
    let rightBar = document.getElementById('rightBar')
    let questionWrapper = document.querySelector('.question-wrapper')
    let controlsWrapper = document.querySelector('.controls-wrapper')
    let leftId = left.id
    let centerId = center.id
    let leftClassName = left.className
    let centerClassName = center.className
    let leftStyle = left.getAttribute('style') || ''
    let centerStyle = center.getAttribute('style') || ''

    left.id = centerId
    center.id = leftId
    left.className = centerClassName
    center.className = leftClassName
    left.setAttribute('style', centerStyle)
    center.setAttribute('style', leftStyle)

    center.appendChild(questionWrapper)
    left.insertBefore(leftBar, left.childNodes[0])
    left.appendChild(controlsWrapper)
    left.appendChild(rightBar)

    this._isMainVideo = !this._isMainVideo

    HDScene.emit('switch', this._isMainVideo)
  }

}

export default UI