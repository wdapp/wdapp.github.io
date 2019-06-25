import Component from 'common/component'
import template from './navigation.html'
import './navigation.scss'
import UInavigation from './UInavigation'


class Navigation extends Component {
  constructor() {
    super()
    this.render('navigation', template, () => {

    })
    this.name = 'navigation'
    this.ui = new UInavigation()
    this.addEvents()
  }

  addEvents() {
    let doc = this.getNode('doc-btn')
    let chat = this.getNode('chat-btn')
    let qa = this.getNode('qa-btn')
    let intro = this.getNode('intro-btn')
    let setting = this.getNode('setting-btn')
    this.bind(doc, 'click', () => {
      this.ui.swiperChangeIndex = 0
    })
    this.bind(chat, 'click', () => {
      this.ui.swiperChangeIndex = 1
    })
    this.bind(qa, 'click', () => {
      this.ui.swiperChangeIndex = 2
    })
    this.bind(intro, 'click', () => {
      this.ui.swiperChangeIndex = 3
    })
    this.bind(setting, 'click', () => {
      this.ui.settingpanel = true
    })
    HDScene.on('isMainVideo', (isMainVideo) => {
      doc.innerText = isMainVideo ? '视频' : '文档'
    })
  }

}

export default Navigation