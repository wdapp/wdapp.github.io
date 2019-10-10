import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'
import UIQuestion from './UIQuestion'
import UIAnswer from './UIAnswer'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'
import UserInterface from 'common/userInterface'//UI库

class QuestionAnswer extends Component {

  constructor() {
    super()
    this.name = 'qa'
    this.render('questionAnswer', template, () => {
    })

    this.ui = new UserInterface()
    this.qaMap = {}
    this.sendControl()
    this.bindEvent()
  }

  bindEvent() {
    HDScene.onQAPulish({callback: this.addQuestionPublish.bind(this)})
    HDScene.onQAQuestion({callback: this.addQuestion.bind(this)})
    HDScene.onQAAnswer({callback: this.addAnswer.bind(this)})

    HDScene.on('switch', () => {
      this.updateScroll()
    })
  }

  addQuestionPublish(info) {
    let qid = info
    if (qid && qid.length > 0) {
      for (let i = 0; i < qid.length; i++) {
        var questionId = qid[i].questionId
        let currentObject = this.qaMap[questionId]
        if (currentObject) {
          currentObject.isPublish = true
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
          e.preventDefault()
          sendQAMsg()
          break
      }
    })

    function sendQAMsg() {
      let sendMsg = Utils.trim(msgInput.value)
      if (!HDScene.isLive) {
        t.ui.alertTip({
          parentNodeId: 'sendQuestionWrap',
          content: '直播未开始，无法提问'
        })
        return false
      }
      if (!sendMsg) {
        t.ui.alertTip({
          parentNodeId: 'sendQuestionWrap',
          content: '提问信息不能为空'
        })
        return false
      }
      if (!isCanSend) {
        t.ui.alertTip({
          parentNodeId: 'sendQuestionWrap',
          content: '提问过于频繁，请稍后'
        })
        return false
      }
      if (sendMsg.length > 300) {
        t.ui.alertTip({
          parentNodeId: 'sendQuestionWrap',
          content: '问题不能超过300个字符'
        })
        return false
      }
      t.ui.alertTipClose()
      HDScene.sendQuestionMsg({'msg': sendMsg})
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
          if (uiquestion.isPublish) {
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
      qustion && (qustion.visible = true, qustion.isPublish = true)
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