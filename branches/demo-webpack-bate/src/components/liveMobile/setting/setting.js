import Component from 'common/component'
import template from './setting.html'
import './setting.scss'
import UIsetting from './UIsetting'

class Setting extends Component {
  constructor() {
    super()

    this.render('setting', template, () => {

    })
    this.name = 'setting'
    this.ui = new UIsetting()
    this.closeBtn = this.getNode('closeBtn')
    this.soundBtn = this.getNode('soundBtn')
    this.announceBtn = this.getNode('announcementBtn')
    this.addEvent()
  }

  addEvent() {
    this.bind(this.closeBtn, 'click', () => {
      this.ui.closePanel()
    })
    this.bind(this.soundBtn, 'click', () => {

    })
    this.bind(this.announceBtn, 'click', () => {


    })
  }
}

export default Setting