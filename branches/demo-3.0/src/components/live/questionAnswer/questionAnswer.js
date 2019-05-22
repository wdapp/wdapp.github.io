import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'
import UIQuestion from './UIQuestion'
import UIAnswer from './UIAnswer'
import LiveInfo from 'common/liveinfo'

class QuestionAnswer extends Component {

  constructor() {
    super()
    this.render('questionAnswer', template, () => {
    })
    this.qaMap = {}
    this.sendControl()
    this.bindEvent()
  }

  bindEvent() {
    hdScience.addEvent(hdScience.OnQuestion, this.addQuestion.bind(this))
    hdScience.addEvent(hdScience.OnAnswer, this.addAnswer.bind(this))
    hdScience.addEvent(hdScience.OnQAPublish, this.addQuestionPublish.bind(this))
  }

  addQuestionPublish() {
    let qid = LiveInfo.qaPulishInfo
    if (qid && qid.length > 0) {
      for (let i = 0; i < qid.length; i++) {
        var questionId = qid[i].questionId
        let currentObject = this.qaMap[questionId]
        if (currentObject) {
          currentObject.visible = true
        }

      }
    }
  }

  sendControl() {
    this.bind(this.getNode('qaSendBtn'), 'click', () => {
      let sendMsg = this.getNode('sendQaMsg').value
      let liveAPI = hdScience.getObjectForName(hdScience.LiveInterface)
      //发送问答
      liveAPI.call(liveAPI.SENDQUESTIONMSG, sendMsg)
      this.getNode('sendQaMsg').value = ''
    })
    this.bind(this.getNode('onlySelfQuestionCheckbox'), 'click', () => {
      let checkbox = this.getNode('onlySelfQuestionCheckbox')
      if (checkbox.checked) {
        for (let str in this.qaMap) {
          let uiquestion = this.qaMap[str]
          if (!uiquestion.self) {
            uiquestion.visible = false
          }
        }
      } else {
        for (let str in this.qaMap) {
          let uiquestion = this.qaMap[str]
          if (!uiquestion.self) {
            uiquestion.visible = true
          }
        }

      }
    })
  }

  addQuestion() {
    let qInfo = LiveInfo.questionInfo
    if (qInfo != {}) {
      let uiquestion = new UIQuestion()
      uiquestion.setInfo(qInfo)
      this.qaMap[qInfo.questionId] = uiquestion
      if (!qInfo.isPublish && !qInfo.self) {
        uiquestion.visible = false
      }
    }
  }

  addAnswer() {
    let aInfo = LiveInfo.answerInfo
    if (!aInfo || aInfo != {}) {
      var qustion = this.qaMap[aInfo.questionId]
      if (aInfo.isPrivate == '1') {
        if (aInfo.self) {
          let uianswer = new UIAnswer()
          uianswer.setInfo(aInfo)
        }
        return
      }
      let uianswer = new UIAnswer()
      uianswer.setInfo(aInfo)
    }
  }
}

export default QuestionAnswer