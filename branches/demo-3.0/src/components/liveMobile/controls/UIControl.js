import Render from 'common/render'
import Utils from 'common/utils'

class UI extends Render {
  _isMainVideo = false

  constructor() {
    super()
    this.videoNode = this.getChildNode('player')
    this.dpNode = this.getChildNode('document')
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
    let userCount = this.getNodeByClass('online-number')
    this.innerHTML(userCount, l.toString())
  }

  setViewName(name) {
    let viewerNode = this.getNodeByClass('controls-user')
    this.innerHTML(viewerNode, name)
  }

  set showBarrage(v) {
    let barrageBtn = this.getNodeByClass('barrage')
    this.setStyle(barrageBtn, {display: (v ? 'block' : 'none')})
  }

  //切换视频为主文档为主
  switchPanel() {
    if (this.isMainVideo) {
      this.appendChild('document', this.dpNode)
      this.appendChild('player', this.videoNode)
    } else {
      this.appendChild('document', this.videoNode)
      this.appendChild('player', this.dpNode)
    }
    this._isMainVideo = !this._isMainVideo
    this.updateNavigation(this._isMainVideo)
  }

  updateNavigation(isMainVideo) {
    HDScence.emit('isMainVideo', isMainVideo)
  }
}

export default UI