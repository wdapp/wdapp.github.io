import Component from 'common/component'
import template from './privateMessage.html'
import './privateMessage.scss'

class PrivateMessage extends Component {
  constructor() {
    super()

    this.render('privateMessage', template, () => {

    })
  }
}

export default PrivateMessage