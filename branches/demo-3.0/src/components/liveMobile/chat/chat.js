import Component from 'common/component'
import template from './chat.html'
import './chat.scss'

class Chat extends Component {
  constructor() {
    super()

    this.render('chat', template, () => {

    })
  }
}

export default Chat