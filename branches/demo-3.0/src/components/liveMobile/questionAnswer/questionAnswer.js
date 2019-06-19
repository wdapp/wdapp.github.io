import Component from 'common/component'
import template from './questionAnswer.html'
import './questionAnswer.scss'
import UIQuestion from './UIQuestion'
import UIAnswer from './UIAnswer'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'
import Input from 'common/public/input'

class QuestionAnswer extends Component {

  constructor() {
    super()
    this.render('questionAnswer', template, () => {
    })
    this.name = 'qa'
    this.qaMap = {}
    this.sendControl()
    this.bindEvent()
  }

  bindEvent() {
    HDScence.onQAPulish({callback: this.addQuestionPublish.bind(this)})
    HDScence.onQAQuestion({callback: this.addQuestion.bind(this)})
    HDScence.onQAAnswer({callback: this.addAnswer.bind(this)})
    let input = new Input({
      id: 'sendQaMsg'
    })
    if (Utils.isAndroid()) {
      input.scrollIntoViewIfNeeded()
    }
    if (Utils.isIOS()) {
      input.tabIndex()
    }
    if (Utils.isIOS() && Utils.isWeiXin()) {
      input.scrollIntoView()
    }
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
    this.bind(this.getNode('qaSendBtn'), 'click', () => {
      let sendMsg = this.getNode('sendQaMsg').value
      if (!sendMsg) {
        this.alert('发送内容不能为空', 'warning')
        return
      }
      if (!isCanSend) {
        this.alert('发送过于频繁，请稍后', 'warning')
        return
      }
      if (sendMsg.length > 300) {
        this.alert('发送内容不能超过300字符', 'warning')
        return
      }
      if (!HDScence.isLive) {
        this.alert('直播未开始，不能发送问答', 'warning')
        return
      }
      //发送问答
      HDScence.sendQustionMsg({'msg': sendMsg})
      this.getNode('sendQaMsg').value = ''
      isCanSend = false
      timeOutId = setTimeout(() => {
        isCanSend = true
        clearTimeout(timeOutId)
      }, 10000)
    })
    let selected = false
    this.bind(this.getNode('onlySelfQuestionCheckbox'), 'click', () => {
      let checkbox = this.getNode('onlySelfQuestionCheckbox')
      if (!selected) {
        for (let str in this.qaMap) {
          let uiquestion = this.qaMap[str]
          if (!uiquestion.self) {
            uiquestion.visible = false
          }
        }
        this.alert('只显示自己问答', 'warning')
      } else {
        for (let str in this.qaMap) {
          let uiquestion = this.qaMap[str]
          if (!uiquestion.self && uiquestion.isPublish) {
            uiquestion.visible = true
          }
        }
      }
      this.setSelfActive(selected)
      selected = !selected
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
    let scrollBody = this.getNodeByClass('question-answer-list-wrap')
    scrollBody.scrollTo(0, h)
  }

  setSelfActive(v) {
    let node = this.getNodeByClass('send-question-only-self')
    if (!v) {
      this.addClass(node, 'active')
    } else {
      this.removeClass(node, 'active')
    }
  }
}

export default QuestionAnswer