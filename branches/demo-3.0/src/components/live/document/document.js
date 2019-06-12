import Component from 'common/component'
import template from './document.html'
import './document.scss'
import FlashTip from 'common/public/flashtip'
import Utils from 'common/utils'

class Document extends Component {
  name = 'document'

  constructor() {
    super()
    this.render('document', template, () => {
      this.init()
    })
  }

  init() {
    HDScence.addEvent(HDScence.OnLoginSuccess, (e) => {
      if (!HDScence.getLive().fastMode) {
        FlashTip.init('document')
      }
      let docType = HDScence.getLive().documentDisplayMode
      if (docType == 1) {
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