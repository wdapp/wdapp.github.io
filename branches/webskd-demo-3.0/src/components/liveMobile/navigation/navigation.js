import Component from 'common/component'
import node from './navigation.html'
import './navigation.scss'

class Navigation extends Component {
  constructor() {
    super()

    this.render('navigation', node, () => {

    })
  }
}

export default Navigation