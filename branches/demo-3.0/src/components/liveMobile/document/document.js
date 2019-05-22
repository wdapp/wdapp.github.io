import Component from 'common/component'
import template from './document.html'
import './document.scss'

class Document extends Component {
  constructor() {
    super()

    this.render('document', template, () => {

    })
  }
}

export default Document