import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'
import Utils from 'common/utils'

class QuestionAnswer extends Component {
  isScroll = true

  constructor() {
    super()
    this.render('questionAnswer', template, () => {
      this.init()
    })
  }

  init() {
    HDScene.onQuestions((data) => {
      this.addQuestions(data)
      Utils.log('onQuestions', data)
    })
    HDScene.onAnswers((data) => {
      this.addAnswers(data)
      Utils.log('onAnswers', data)
    })

    let questionAnswerScrollWrap = this.getNode('questionAnswerScrollWrap')

    this.bind(questionAnswerScrollWrap, 'mouseleave', () => {
      this.isScroll = true
    })
    this.bind(questionAnswerScrollWrap, 'mouseenter', () => {
      this.isScroll = false
    })
    HDScene.on('switch', () => {
      this.scrollTopQuestionAnswer()
    })
  }

  addQuestions(data) {
    let questionTemplate = ` 
      <li id="${data.id}" class="question-answer-wrap" style="display: ${data.isPublish ? 'block' : 'none'}">
        <div class="question-wrap">
          <p class="question-name">${data.userName}：</p>
          <p class="question-content">${data.content}</p>
        </div>
      </li>
    `
    let questionAnswerWrap = this.getNode('questionAnswerWrap')
    this.appendChild(questionAnswerWrap, questionTemplate)
    this.scrollTopQuestionAnswer()
  }

  addAnswers(data) {
    let answerTemplate = `
       <div class="anwser-wrap" style="display: ${data.isPrivate ? 'none' : 'block'}">
          <span class="anwser-arrows"></span>
          <div class="anwser-box">
            <p class="anwser-name">${data.userName}:</p>
            <p class="anwser-content">${data.content}</p>
          </div>
        </div>
    `
    let questionNode = this.getNode(data.questionId)
    this.appendChild(questionNode, answerTemplate)
    this.scrollTopQuestionAnswer()
  }

  scrollTopQuestionAnswer() {
    if (!this.isScroll) {
      return false
    }
    let questionAnswerScrollWrap = this.getNode('questionAnswerScrollWrap')
    let scrollHeight = questionAnswerScrollWrap.scrollHeight
    questionAnswerScrollWrap.scrollTop = scrollHeight
  }
}

export default QuestionAnswer