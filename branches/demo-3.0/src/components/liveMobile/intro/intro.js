import Component from 'common/component'
import template from './intro.html'
import './intro.scss'

class Intro extends Component {
  constructor() {
    super()

    this.render('intro', template, () => {

    })
  }
}

export default Intro