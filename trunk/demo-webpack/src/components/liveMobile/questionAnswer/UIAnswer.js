import Render from 'common/render'

class Answer extends Render {
  constructor() {
    super()
  }

  get nodeAnswerHtml() {
    return ` <div class="answer-wrap">
                <span class="answer-name">${this.answerName}:</span>
                <span class="answer-time">${this.time}</span>
                <p class="answer-content">${this.answerContent}</p>
            </div>`
  }

  setInfo(v) {
    if (!v) return
    this.parentQNodeId = v.questionId
    this.answerName = v.answerName
    this.answerContent = v.answerContent
    this.time = v.triggerTime.split(' ')[1]
    return this.create()
  }

  create() {
    let answerNode = this.createNode('li')
    answerNode.className = 'answer'
    this.innerHTML(answerNode, this.nodeAnswerHtml)
    this.appendChild(this.parentQNodeId, answerNode)
    this.node = answerNode
  }
}

export default Answer