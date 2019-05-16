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
    let answerNode = this.creatNode('div')
    answerNode.className = 'anwser-wrap'
    this.innerHTML(answerNode, this.nodeAnswerHtml)
    this.appendchild(this.parentQNodeId, answerNode)
    this.node = answerNode
  }

  get nodeAnswerHtml() {
    return `<span class="anwser-arrows"></span>
            <div class="anwser-box">
                <p class="anwser-name">${this.answerName}:</p>
                <p class="anwser-content">${this.answerContent}</p>
            </div>`
  }
}

export default Answer