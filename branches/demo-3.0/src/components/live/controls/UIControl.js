import Render from 'common/render'
import UserInterface from 'common/userInterface'
import Utils from 'common/utils'

class UI extends Render {
  _isMainVideo = false
  isShowLeft = true
  isShowRight = true

  constructor() {
    super()
    this.ui = new UserInterface()

    this.videoNode = this.getChildNode('player')
    this.dpNode = this.getChildNode('document')
  }

  bindLeftBar() {
    if (this.isShowLeft) {
      this.ui.hideLeft(() => {
        Utils.log('hideLeft')
      })
    } else {
      this.ui.showLeft(() => {
        Utils.log('showLeft')
      })
    }
    this.isShowLeft = !this.isShowLeft
  }

  bindRightBar() {
    if (this.isShowRight) {
      this.ui.hideRight(() => {
        Utils.log('hideRight')
      })
    } else {
      this.ui.showRight(() => {
        Utils.log('showRight')
      })
    }
    this.isShowRight = !this.isShowRight
  }

  get isMainVideo() {
    return this._isMainVideo
  }

  set isMainVideo(v) {
    this._isMainVideo = v
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

  //切换视频为主文档为主
  switchPanel() {
    this.deleteChild('document')
    this.deleteChild('player')
    if (this.isMainVideo) {
      this.appendChild('document', this.dpNode)
      this.appendChild('player', this.videoNode)
    } else {
      this.appendChild('document', this.videoNode)
      this.appendChild('player', this.dpNode)
    }
    this._isMainVideo = !this._isMainVideo
  }

}

export default UI