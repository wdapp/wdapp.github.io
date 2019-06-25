import Component from 'common/component'
import template from './document.html'
import './document.scss'
import Utils from 'common/utils'

class Document extends Component {
  name = 'document'
  once = true
  reLoadTimer = 0
  reLoadInterval = 300

  constructor() {
    super()
    this.render('document', template, () => {
      this.init()
    })
  }

  init() {
    HDScene.addEvent(HDScene.OnLoginSuccess, (e) => {
      Utils.log('onDocumentDisplayMode', HDScene.getLive().documentDisplayMode)
      let docType = HDScene.getLive().documentDisplayMode
      if (docType == 1) {
        //开启极速文档适合窗口
        HDScene.documentAdaptive(true)
      } else {
        //极速文档适合宽度
        HDScene.documentAdaptive(false)
      }
    })

    //兼容iOS屏幕旋转导致极速文档变大问题
    if (Utils.isIOS()) {
      HDScene.onRotateScreenChange((orientation) => {
        this.updateOrientation(orientation)
      })
    }

    //Android微信视频横屏回屏导致视频暂停
    if (Utils.isAndroid() && Utils.isWeiXin()) {
      HDScene.onResize(() => {
        this.autoPlay()
      })
    }

    let docTip = this.getNode('noDoc')
    HDScene.addEvent(HDScene.OnLiveStart, () => {
      docTip.style.display = 'none'
    })
    HDScene.addEvent(HDScene.OnLiveEnd, () => {
      docTip.style.display = 'flex'
      this.reLoadDocument()
    })
    HDScene.addEvent(HDScene.OnLiveStarting, () => {
      docTip.style.display = 'none'
    })
  }

  autoPlay() {
    Utils.log('Android WeiXin autoPlay', Utils.isAndroid())
    let video = this.getNode('player_live')
    video.play()
  }

  updateOrientation(orientation) {
    if (!this.once && orientation == 'portrait') {
      this.reLoadTimer && clearTimeout(this.reLoadTimer)
      this.reLoadTimer = setTimeout(() => {
        this.reLoadDocument()
      }, this.reLoadInterval)
      this.once = false
    } else {
      this.reLoadTimer && clearTimeout(this.reLoadTimer)
      this.once = false
    }
  }

  reLoadDocument() {
    let drawPanel = document.getElementsByClassName('drawPanel')[0]
    let children = [...drawPanel.children]
    children.forEach((element, index) => {
      this.appendChild(drawPanel, element)
    })
    Utils.log('reLoadDocument')
  }
}

export default Document