import Component from 'common/component'
import node from './privateMessage.html'
import './privateMessage.scss'

class PrivateMessage extends Component {
  constructor() {
    super()

    this.render('privateMessage', node, () => {

    })
  }
}

export default PrivateMessage