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

    // this.testAutoQuestionsAnswers()

    let questionAnswerScrollWrap = this.getNode('questionAnswerScrollWrap')

    this.bind(questionAnswerScrollWrap, 'touchend', () => {
      this.isScroll = true
    })
    this.bind(questionAnswerScrollWrap, 'touchstart', () => {
      this.isScroll = false
    })
  }

  testAutoQuestionsAnswers() {
    let question = {
      content: '问答测试，提问！',
      groupId: '',
      id: '6466B85A636FEFB8BETA',
      isPublish: 1,
      userAvatar: '',
      userId: '74e9559d78e34350b7993c3318062e89',
      userName: '撒发达'
    }
    let answer = {
      content: '回答测试，回答！',
      groupId: '',
      isPrivate: 0,
      questionId: '6466B85A636FEFB8BETA',
      userAvatar: '',
      userId: '222ec2eaab2b4d85a7bc34e93032d46e',
      userName: 'sdf',
      userRole: 'publisher'
    }
    setInterval(() => {
      question.content = '问答测试，提问！' + (new Date())
      this.addQuestions(question)
    }, 4000)
    setInterval(() => {
      answer.content = '回答测试，回答！' + (new Date())
      this.addAnswers(answer)
    }, 2000)
  }

  addQuestions(data) {
    let questionTemplate = `
      <li class="question" style="display: ${data.isPublish ? 'block' : 'none'}">
        <div class="question-wrap">
          <span class="question-name">${data.userName}</span>
          <span class="question-tip">问：</span>
          <span class="question-content">${data.content}</span>
          <ul id="${data.id}" class="answer-list">
          </ul>
        </div>
      </li>
    `
    let questionAnswerWrap = this.getNode('questionAnswerWrap')
    this.appendChild(questionAnswerWrap, questionTemplate)
    this.scrollTopQuestionAnswer()
  }

  addAnswers(data) {
    let answerTemplate = `
    <li class="answer" style="display: ${data.isPrivate ? 'none' : 'block'}">
        <div class="answer-wrap">
          <span class="answer-name">${data.userName}：</span>
          <span class="answer-tip">答：</span>
          <span class="answer-content">${data.content}</span>
        </div>
     </li>
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