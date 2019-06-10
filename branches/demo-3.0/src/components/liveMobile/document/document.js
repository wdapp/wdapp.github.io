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
    HDScence.onDocumentDisplayMode((data) => {
      Utils.log('onDocumentDisplayMode', data)
      if (data.documentDisplayMode) {
        //开启极速文档适合窗口
        HDScence.documentAdaptive(true)
      } else {
        //极速文档适合宽度
        HDScence.documentAdaptive(false)
        //兼容iOS屏幕旋转导致文档变大问题
        if (Utils.isIOS()) {
          HDScence.onRotateScreenChange((orientation) => {
            this.updateOrientation(orientation)
          })
        }
      }
    })
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