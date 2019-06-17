import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'
import UIQuestion from './UIQuestion'
import UIAnswer from './UIAnswer'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'

class QuestionAnswer extends Component {

  constructor() {
    super()
    this.name = 'qa'
    this.render('questionAnswer', template, () => {
    })

    this.qaMap = {}
    this.sendControl()
    this.bindEvent()
  }

  bindEvent() {
    HDScence.addEvent(HDScence.OnQuestion, this.addQuestion.bind(this))
    HDScence.addEvent(HDScence.OnAnswer, this.addAnswer.bind(this))
    HDScence.addEvent(HDScence.OnQAPublish, this.addQuestionPublish.bind(this))
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
    let isCanSend = true
    let timeOutId = -1
    let t = this
    this.bind(this.getNode('qaSendBtn'), 'click', () => {
      sendQAMsg()
    })
    let msgInput = this.getNode('sendQaMsg')
    this.bind(msgInput, 'keydown', (e) => {
      switch (e.keyCode.toString()) {
        case '13':
          sendQAMsg()
          break
      }
    })

    function sendQAMsg() {
      let sendMsg = Utils.trim(msgInput.value)
      if (!sendMsg) {
        HDScence.alert('发送内容不能为空', 'warning')
        return
      }
      if (!isCanSend) {
        HDScence.alert('发送过于频繁，请稍后', 'warning')
        return
      }
      if (sendMsg.length > 300) {
        HDScence.alert('发送内容不能超过300字符', 'warning')
        return
      }
      if (!HDScence.isLive) {
        HDScence.alert('直播未开始，不能发送问答', 'warning')
        return
      }
      HDScence.sendQustionMsg({'msg':sendMsg});
      msgInput.value = ''
      isCanSend = false
      timeOutId = setTimeout(() => {
        isCanSend = true
        clearTimeout(timeOutId)
      }, 10000)
    }


    let selected = false
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
          if (!uiquestion.self && uiquestion.isPublish) {
            uiquestion.visible = true
          }
        }

      }
    })
    this.updateScroll()
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
    this.updateScroll()
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
      qustion.visible = true
    }
    this.updateScroll()
  }

  updateScroll() {
    let container = this.getNode('question-answer')
    let h = container.offsetHeight
    let scrollBody = this.getNode('question-body')
    scrollBody.scrollTop = h

  }
}

export default QuestionAnswer