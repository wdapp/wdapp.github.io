import Render from 'common/render'
import Utils from 'common/utils'

class ChatMsg extends Render {
  constructor() {
    super()
    this.chatId = ''
    this.userId = ''
    this.msg = ''
    this.groupId = ''
    this.userName = ''
    this.userRole = ''
    this.status = ''
    this.self = ''
  }

  set info(v) {
    if (!v) return
    this.chatId = v.chatId
    this.userId = v.userId
    this.msg = v.msg
    this.userName = v.userName
    this.userRole = v.userRole
    this.status = v.status
    this.self = v.self
    this.appendMsg()
  }

  appendMsg() {
    let chat = this.createNode('li')
    chat.className = `chat-message-wrap`
    this.innerHTML(chat, this.HtmlContent)
    this.appendChild('chat-container', chat)
    // this.getNode('chat-container').scrollTo(0, 0)
  }

  get HtmlContent() {
    return `<span class="chat-message-name ${this.self ? 'self' : 'teacher'}">${this.userName}</span>
            <span class="chat-message-time">298:37:20</span>
            <p class="chat-message-content">${Utils.showEm(this.msg)}</p>`
  }
}

export default ChatMsg