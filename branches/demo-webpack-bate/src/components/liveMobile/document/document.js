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
    HDScence.addEvent(HDScence.OnLoginSuccess, (e) => {
      Utils.log('onDocumentDisplayMode', HDScence.getLive().documentDisplayMode)
      let docType = HDScence.getLive().documentDisplayMode
      if (docType == 1) {
        //开启极速文档适合窗口
        HDScence.documentAdaptive(true)
      } else {
        //极速文档适合宽度
        HDScence.documentAdaptive(false)
      }
    })

    //兼容iOS屏幕旋转导致极速文档变大问题
    if (Utils.isIOS()) {
      HDScence.onRotateScreenChange((orientation) => {
        this.updateOrientation(orientation)
      })
    }

    //Android微信视频横屏回屏导致视频暂停
    if (Utils.isAndroid() && Utils.isWeiXin()) {
      HDScence.onResize(() => {
        this.autoPlay()
      })
    }

    let docTip = this.getNode('noDoc')
    HDScence.addEvent(HDScence.OnLiveStart, () => {
      docTip.style.display = 'none'
    })
    HDScence.addEvent(HDScence.OnLiveEnd, () => {
      docTip.style.display = 'flex'
      this.reLoadDocument()
    })
    HDScence.addEvent(HDScence.OnLiveStarting, () => {
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