import Component from 'common/component'
import node from './drawPanel.html'
import './drawPanel.scss'

class DrawPanel extends Component {
  constructor() {
    super()

    this.render('document', node, () => {

    })
  }
}

export default DrawPanel