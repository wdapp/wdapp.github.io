import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
import Utils from 'common/utils'

class Chat extends Component {
  isScroll = true

  constructor() {
    super()
    this.render('chat', template, () => {
      this.init()
    })
  }

  init() {
    HDScene.onChatMessageSync((message) => {
      Utils.log('addMessage', message)
      this.filterChatMessage(message)
    })

    // this.testAutoSendMessage()

    window.showMsgImage = function (event) {
      Utils.log('showMsgImage', event)
    }

    let chatMessageScrollWrap = this.getNode('chatMessageScrollWrap')

    this.bind(chatMessageScrollWrap, 'mouseleave', () => {
      this.isScroll = true
    })
    this.bind(chatMessageScrollWrap, 'mouseenter', () => {
      this.isScroll = false
    })
  }

  testAutoSendMessage() {
    let message = {
      chatId: '77380773',
      groupId: '',
      msg: '这是一段测试信息 1234567890 abcdefg hello world' + Math.random() + (new Date()),
      role: 2,
      status: '0',
      time: 151,
      userRole: 'student',
      useravatar: '',
      usercustommark: '',
      userid: '754eb8f9faac4102a75b5c3497675557',
      username: '李白'
    }
    setInterval(() => {
      message.msg = '这是一段测试信息 1234567890 abcdefg hello world' + Math.random() + (new Date())
      this.filterChatMessage(message)
    }, 1000)
  }

  filterChatMessage(message) {

    //分组
    if (!this.isWithGroupId(message)) {
      return false
    }

    //聊天审核
    if (message.userid === HDScene.viewerId) {
      message.status = 0
    }

    this.addMessage(message)
  }

  isWithGroupId(data) {
    let groupId = data.groupId
    if (!groupId) {
      return true
    }

    let role = ''
    if (data.userrole) {
      role = data.userrole
    } else if (data.userRole) {
      role = data.userRole
    } else if (data.fromuserrole) {
      role = data.fromuserrole
    } else if (data.answerUserRole) {
      role = data.answerUserRole
    } else if (data.fromuserrole) {
      role = data.fromuserrole
    } else if (data.role) {
      role = data.role
    }

    if (role && role === 'publisher') {
      return true
    }

    if (HDScene.groupId && HDScene.groupId !== groupId) {
      return false
    }

    return true
  }

  addMessage(message) {
    let messageTemplate = `
       <li class="chat-content-wrap" style="display: ${message.status == '0' ? 'block' : 'none'}">
        <p class="chat-name ${message.userRole !== 'student' ? 'teacher' : ''}">${message.username}：</p>
        <div class="chat-message">
          ${Utils.showEm(message.msg)}
        </div>
      </li>
    `
    let chatMessageWrap = this.getNode('chatMessageWrap')
    this.appendChild(chatMessageWrap, messageTemplate)
    this.scrollTopMessage(chatMessageWrap)
  }

  scrollTopMessage() {
    if (!this.isScroll) {
      return false
    }
    let chatMessageScrollWrap = this.getNode('chatMessageScrollWrap')
    let scrollHeight = chatMessageScrollWrap.scrollHeight
    chatMessageScrollWrap.scrollTop = scrollHeight
  }
}

export default Chat