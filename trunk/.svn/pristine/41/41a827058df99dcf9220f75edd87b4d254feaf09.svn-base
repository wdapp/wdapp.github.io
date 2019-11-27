import Component from 'common/component'
import template from './privateMessage.html'
import './privateMessage.scss'
import PrivateChatMsg from './privateChatMsg'
import UITeacher from './UITeacher'
import UIPrivate from './UIPrivate'

class PrivateMessage extends Component {
  constructor() {
    super()
    this.name = 'privateMsg'
    this.teachers = {}
    this.render('privateMessage', template, () => {

    })
    this.uiChat = new PrivateChatMsg()
    this.uiteachers = {}
    this.ui = new UIPrivate()
    this.chatInfo = {}
    this.selectedTeacher = ';'
    HDScene.onTeachers({
      callback: (info) => {
        let teachers = info
        for (let i = 0; i < teachers.length; i++) {
          if (!this.teachers[teachers[i].id]) {
            let uiteacher = new UITeacher()
            let name = teachers[i].name
            this.teachers[teachers[i].id] = teachers[i].name
            uiteacher.appendSelected(teachers[i].id, name)
            this.uiteachers[teachers[i].id] = uiteacher
          }
        }
      }
    })
    HDScene.onPrivateChat({
      callback: (info) => {
        let msgInfo = info
        if (msgInfo.fSelf) {
          if (!this.chatInfo[msgInfo.toUserId]) {
            let chatMsg = new PrivateChatMsg()
            chatMsg.info = msgInfo
            this.chatInfo[msgInfo.toUserId] = chatMsg
          } else {
            this.chatInfo[msgInfo.toUserId].appendMsg(msgInfo.msg, msgInfo.fSelf)
          }
        } else {
          if (!this.chatInfo[msgInfo.fromUserId]) {
            let chatMsg = new PrivateChatMsg()
            chatMsg.info = msgInfo
            this.chatInfo[msgInfo.fromUserId] = chatMsg
          } else {
            this.chatInfo[msgInfo.fromUserId].appendMsg(msgInfo.msg, msgInfo.fSelf)
          }
        }
        this.uiChat.updateScroll()
      }
    })
    this.addEvent()
  }

  addEvent() {
    let plist = this.getNode('private-message-list')//点击选择私聊老师
    let closeBtn = this.getNode('private-close-btn')//关闭按钮
    let returnBtn = this.getNode('private-message-return')//返回按钮
    // let privateInput=this.getNode("private_input")//私聊输入框
    let privateSend = this.getNode('private_send')//发送私聊
    this.bind(plist, 'click', (e) => {
      if (this.chatInfo[e.target.id]) {
        this.chatInfo[e.target.id].appendNodes()
      } else {
        this.chatInfo[e.target.id] = new PrivateChatMsg()
        this.chatInfo[e.target.id].appendNodes()
      }
      this.selectedTeacher = e.target.id
      this.selectedTeacherName = e.target.name
      this.ui.isShowSelfPrivatePanel = true

    })
    this.bind(returnBtn, 'click', (e) => {
      this.ui.isShowSelfPrivatePanel = false
    })
    this.bind(closeBtn, 'click', () => {
      this.ui.isPrivatePanelShow = false
    })
    this.bind(privateSend, 'click', () => {
      let value = this.ui.privateValue
      HDScene.sendPrivateMsg({'msg': value, 'teacher': this.selectedTeacher, 'teacherName': this.selectedTeacherName})
    })
  }
}

export default PrivateMessage