import Component from 'common/component'
import template from './intro.html'
import './intro.scss'
import UIintro from './UIIntrol'

class Intro extends Component {
  constructor() {
    super()

    this.render('intro', template, () => {
      this.ui = new UIintro()
      HDScene.onLiveDesc({
        callback: (info) => {
          this.ui.content = info
        }
      })
    })
    this.name = 'introl'

  }
}

export default Intro