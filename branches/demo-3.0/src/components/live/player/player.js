import Component from 'common/component'
import FlashTip from './flashTip'
import template from './player.html'
import './player.scss'

class Player extends Component {
  constructor() {
    super()

    this.name = 'player'
    this.render('player', template, () => {
      FlashTip.init()
    })
  }
}

export default Player