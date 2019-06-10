import Component from 'common/component'
import template from './intro.html'
import './intro.scss'
import UIintro from './UIIntrol'
import LiveInfo from 'common/liveinfo'

class Intro extends Component {
  constructor() {
    super()

    this.render('intro', template, () => {
      this.ui = new UIintro()
      HDScence.addEvent(HDScence.OnLiveDesc, () => {
        this.ui.content = LiveInfo.onLiveDesc
      })
    })
    this.name = 'introl'

  }
}

export default Intro