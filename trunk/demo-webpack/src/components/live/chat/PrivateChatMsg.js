import Render from 'common/render'
import Utils from 'common/utils'

class PrivateChatMsg extends Render {
  constructor() {
    super()

    this.fUserId = ''
    this.fUserName = ''
    this.fUserRole = ''
    this.msg = ''
    this.time = ''
    this.toUserId = ''
    this.toUserName = ''
  }

  set info(v) {
    if (!v) return
    this.fUserId = v.fromUserId
    this.fUserName = v.fromUserName
    this.fUserRole = v.fromUserRole
    this.msg = v.msg
    this.time = v.time
    this.toUserId = v.toUserId
    this.toUserName = v.toUserName
    this.fSelf = v.fSelf
    this.tSelf = v.tSelf
    this.left = v.left
    this.appendMsg()
  }

  get HtmlContent() {
    return `<div class="chat-name-wrap">
          <p class="${this.left ? 'chat-name-from' : 'chat-name-to'} ${this.left ? this.fSelf ? 'self' : '' : this.tSelf ? 'self' : ''}">${this.left ? this.fUserName : this.toUserName }</p>
          <p class="${this.left ? 'chat-name-to' : 'chat-name-from'} ${this.left ? this.tSelf ? 'self' : '' : this.fSelf ? 'self' : ''}">${this.left ? this.toUserName : this.fUserName }</p>
        </div>
        <div class="chat-message">${Utils.showEm(this.msg)}</div>`
  }

  appendMsg() {
    let li = this.createNode('li')
    li.className = `chat-content-wrap ${this.left ? '' : 'chat-content-right'}`
    li.setAttribute('fId', this.fUserId)
    li.setAttribute('tId', this.toUserId)
    this.innerHTML(li, this.HtmlContent)
    this.appendChild('chat-container', li)

  }

}

export default PrivateChatMsg