import Component from 'common/component'
import template from './document.html'
import './document.scss'
import Utils from 'common/utils'
import FlashTip from 'common/public/flashtip'

class Document extends Component {
  constructor() {
    super()
    this.render('document', template, () => {
      this.init()
    })
  }

  init() {
    HDScence.onDocumentMode((data) => {
      if (!data.fastMode) {
        FlashTip.init('document')
      }
    })
    HDScence.onDocumentDisplayMode((data) => {
      Utils.log('onDocumentDisplayMode', data)
      if (data.documentDisplayMode) {
        //开启极速文档自适应模式
        HDScence.documentAdaptive(true)
      } else {
        //开启极速文档自适应模式
        HDScence.documentAdaptive(false)
      }
    })
  }
}

export default Document