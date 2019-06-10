import Component from 'common/component'
import FlashTip from 'common/public/flashtip'
import template from './player.html'
import './player.scss'

class Player extends Component {
  constructor() {
    super()
    this.name = 'player'
    this.render('player', template, () => {
      //判断 极速文档 还是 flash文档
      FlashTip.init()
    })
  }
}

export default Player