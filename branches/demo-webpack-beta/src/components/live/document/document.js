import Component from 'common/component'
import template from './document.html'
import './document.scss'
import FlashTip from 'common/public/flashtip'

class Document extends Component {
  name = 'document'

  constructor() {
    super()
    this.render('document', template, () => {
      this.init()
    })
  }

  init() {
    HDScene.addEvent(HDScene.OnLoginSuccess, (e) => {
      if (!HDScene.getLive().fastMode) {
        FlashTip.init('document')
      }
      let docType = HDScene.getLive().documentDisplayMode
      if (docType == 1) {
        //开启极速文档自适应模式
        HDScene.documentAdaptive(true)
      } else {
        //开启极速文档自适应模式
        HDScene.documentAdaptive(false)
      }
    })
  }
}

export default Document