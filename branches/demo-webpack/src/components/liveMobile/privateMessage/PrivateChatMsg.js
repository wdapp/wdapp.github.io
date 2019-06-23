import Render from 'common/render'

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
    this.nodes = []
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
    this.appendMsg(this.msg, this.fSelf)
  }

  appendMsg(msg, self) {
    let li = this.createNode('li')
    li.className = `message ${self ? 'self' : ''}`
    this.innerHTML(li, msg)
    this.appendChild('private-message-content', li)
    this.nodes.push(li)
    // this.appendChild('private-message-content', li)
  }

  appendNodes() {
    this.deleteChild('private-message-content')
    for (let i = 0; i < this.nodes.length; i++) {
      this.appendChild('private-message-content', this.nodes[i])
    }

  }

}

export default PrivateChatMsg