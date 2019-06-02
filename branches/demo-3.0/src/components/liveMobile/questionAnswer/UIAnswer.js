import Render from 'common/render'

class Answer extends Render {
  constructor() {
    super()
  }

  setInfo(v) {
    if (!v) return
    this.parentQNodeId = v.questionId
    this.answerName = v.answerName
    this.answerContent = v.answerContent
    return this.create()
  }

  create() {
    let answerNode = this.createNode('li')
    answerNode.className = 'answer'
    this.innerHTML(answerNode, this.nodeAnswerHtml)
    this.appendChild(this.parentQNodeId, answerNode)
    this.node = answerNode
  }

  get nodeAnswerHtml() {
    return ` <div class="answer-wrap">
                <span class="answer-name">${this.answerName}:</span>
                <span class="answer-time">22:11:22</span>
                <p class="answer-content">${this.answerContent}</p>
            </div>`
  }
}

export default Answer