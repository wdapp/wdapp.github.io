import Component from 'common/component'
import template from './document.html'
import './document.scss'
import Utils from 'common/utils'

class Document extends Component {
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
    HDScene.onDocumentDisplayMode((data) => {
      Utils.log('onDocumentDisplayMode', data)
      if (data.documentDisplayMode) {
        //开启极速文档适合窗口
        HDScene.documentAdaptive(true)
      } else {
        //极速文档适合宽度
        HDScene.documentAdaptive(false)
      }
    })

    //兼容iOS屏幕旋转导致文档变大问题
    if (Utils.isIOS() && HDScene.isH5play) {
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
  }

  autoPlay() {
    Utils.log('Android WeiXin autoPlay', Utils.isAndroid())
    let video = this.getNode('playbackVideo')
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
    let document = this.getNode('document')
    let children = [...document.children]
    children.forEach((element, index) => {
      this.appendChild(document, element)
    })
    Utils.log('reLoadDocument')
  }
}

export default Document