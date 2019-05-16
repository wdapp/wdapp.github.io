import Render from 'common/render'

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
    window.location.href = './index.html'
  }

  setUserCount(l) {
    let userCount = this.getNodeByClass('controls-online-number')
    this.innerHTML(userCount, l)
  }

  setViewName(name) {
    let viewerNode = this.getNodeByClass('controls-user')
    this.innerHTML(viewerNode, name)
  }

  //切换视频为主文档为主
  switchPanel() {
    this.deletChild('document')
    this.deletChild('player')
    if (this.isMainVideo) {
      this.appendchild('document', this.dpNode)
      this.appendchild('player', this.videoNode)
    } else {
      this.appendchild('document', this.videoNode)
      this.appendchild('player', this.dpNode)
    }
    this._isMainVideo = !this._isMainVideo
  }

}

export default UI