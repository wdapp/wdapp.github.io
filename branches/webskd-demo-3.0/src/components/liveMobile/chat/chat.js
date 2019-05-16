import Component from 'common/component'
import node from './chat.html'
import './chat.scss'

class Chat extends Component {
  constructor() {
    super()

    this.render('chat', node, () => {

    })
  }
}

export default Chat