import Component from 'common/component'
import node from './setting.html'
import './setting.scss'

class Setting extends Component {
  constructor() {
    super()

    this.render('setting', node, () => {

    })
  }
}

export default Setting