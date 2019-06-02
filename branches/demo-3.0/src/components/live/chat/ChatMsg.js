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
    chat.className = `chat-content-wrap ${this.self ? 'chat-content-right' : ''}`
    this.innerHTML(chat, this.HtmlContent)
    this.appendChild('chat-container', chat)
    this.getNode('chat-container').scrollTo(0, 0)
  }

  get HtmlContent() {
    return `<p class="chat-name ${this.self ? 'self' : 'teacher'}">${this.userName}</p>
               <div class="chat-message">
                 ${Utils.showEm(this.msg)}
               </div>`
  }
}

export default ChatMsg