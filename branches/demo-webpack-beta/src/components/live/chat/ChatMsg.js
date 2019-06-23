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

  set visible(v) {
    let show = v ? 'block' : 'none'
    if (this.node) {
      this.setStyle(this.node, {display: show})
    }
  }

  get HtmlContent() {
    return `<p class="chat-name ${this.self ? 'self' : 'teacher'}">${this.userName}</p>
               <div class="chat-message">
                 ${Utils.showEm(this.msg)}
               </div>`
  }

  appendMsg() {
    this.node = this.createNode('li')
    this.node.className = `chat-content-wrap ${this.self ? 'chat-content-right' : ''}`
    this.node.setAttribute('chatid', this.chatId)
    this.innerHTML(this.node, this.HtmlContent)
    this.appendChild('chat-container', this.node)
    this.getNode('chat-container').scrollTop = 0
    if (this.status === '0' || this.self) {
      this.visible = true
    } else {
      this.visible = false
    }
  }
}

export default ChatMsg