import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'

class QuestionAnswer extends Component {
  constructor() {
    super()

    this.render('questionAnswer', template, () => {

    })
  }
}

export default QuestionAnswer