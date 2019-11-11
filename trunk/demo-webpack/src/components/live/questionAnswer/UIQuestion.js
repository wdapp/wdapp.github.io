import Render from 'common/render'

class Question extends Render {


  constructor() {
    super()
  }

  set visible(boo) {
    let isDisplay = !boo ? 'none' : 'block'
    this.node.style.display = isDisplay
  }

  get nodeQuestionHtml() {
    return `<div class="question-wrap">
              <p class="question-name ${this.self ? 'self' : ''}">${this.questionName}</p>
              <p class="question-content">${this.questionContent}</p>
            </div>`
  }

  //设置问题数据
  setInfo(v) {
    if (!v) return
    this.questionName = v.questionName
    this.questionContent = v.questionContent
    this.id = v.id
    this.questionId = v.questionId
    this.self = v.self
    this.isPublish = v.isPublish
    this.userId = v.userId
    return this.create(v)
  }

  //创建node节点
  create(info) {
    let qli = this.createNode('li')
    qli.className = 'question-answer-wrap'
    qli.id = info.id
    qli.questionId = info.questionId
    qli.self = info.self
    qli.isPublish = info.isPublish
    this.innerHTML(qli, this.nodeQuestionHtml)
    this.appendChild('question-answer', qli)
    this.node = qli
    return qli
  }


}

export default Question