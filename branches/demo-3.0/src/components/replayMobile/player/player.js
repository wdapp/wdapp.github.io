import Component from 'common/component'
import template from './player.html'
import './player.scss'
import './orientation'

class Player extends Component {
  constructor() {
    super()

    this.render('player', template, () => {

    })
  }
}

export default Player