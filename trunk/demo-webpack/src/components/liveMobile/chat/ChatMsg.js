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
    this.time = v.time
    this.groupId = v.groupId
    let r = /^\+?[1-9][0-9]*$/
    if (r.test(v.time)) {
      this.time = Utils.formatTime(v.startTime, v.time)
    }
    this.appendMsg()
  }

  set visible(v) {
    let show = v ? 'block' : 'none'
    if (this.node) {
      this.setStyle(this.node, {display: show})
    }
  }

  get HtmlContent() {
    return `<span class="chat-message-name ${this.self ? 'self' : 'teacher'}">${this.userName}</span>
            <span class="chat-message-time">${this.time}</span>
            <p class="chat-message-content">${Utils.showEm(this.msg)}</p>`
  }

  appendMsg() {
    this.node = this.createNode('li')
    this.node.className = `chat-message-wrap`
    this.innerHTML(this.node, this.HtmlContent)
    this.appendChild('chat-container', this.node)
    if (this.status === '0') {
      this.visible = true
    } else {
      this.visible = false
    }
    // this.getNode('chat-container').scrollTo(0, 0)
  }
}

export default ChatMsg