import Component from 'common/component'
import template from './navigation.html'
import './navigation.scss'

class Navigation extends Component {
  constructor() {
    super()

    this.render('navigation', template, () => {

    })
  }
}

export default Navigation