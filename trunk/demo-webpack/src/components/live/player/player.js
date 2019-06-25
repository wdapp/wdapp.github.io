import Component from 'common/component'
import FlashTip from 'common/public/flashtip'
import template from './player.html'
import './player.scss'

class Player extends Component {
  name = 'player'

  constructor() {
    super()
    this.render('player', template, () => {
      this.init()
    })
    HDScene.onLiveStream({
      liveStart: () => {

      },
      living: () => {

      }, liveEnd: () => {

      }
    })
  }

  init() {
    FlashTip.init('player')
  }
}

export default Player