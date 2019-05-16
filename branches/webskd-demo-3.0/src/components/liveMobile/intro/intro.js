import Component from 'common/component'
import node from './intro.html'
import './intro.scss'

class Intro extends Component {
  constructor() {
    super()

    this.render('intro', node, () => {

    })
  }
}

export default Intro