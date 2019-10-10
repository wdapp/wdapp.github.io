import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
import UIChat from './UIChat'
import LiveInfo from 'common/liveinfo'
import ChatMsg from './ChatMsg'
import PrivateChatMsg from './PrivateChatMsg'
import Announce from './announcement'
import Utils from 'common/utils'
import UserInterface from 'common/userInterface'//UI库

class Chat extends Component {

  constructor() {
    super()

    this.name = 'chat'
    this.render('chat', template, () => {

    })
    this.ui = new UserInterface()
    this.uiChat = new UIChat()
    this.chatMap = {}
    this.teachers = {}
    this.selectedTeacher = 'all'
    this.selectedteacherName = ''
    this.announce = new Announce()
    this.addHandler()
    this.addEvents()

  }

  addEvents() {
    //公聊
    HDScene.onPublicChat({
      callback: (info) => {
        let msgInfo = info
        if (LiveInfo.getLoginInfoData('viewer', 'groupId') === msgInfo.groupId || !msgInfo.groupId || !LiveInfo.getLoginInfoData('viewer', 'groupId')) {
          let chatMsg = new ChatMsg()
          msgInfo.startTime = LiveInfo.getLoginInfoData('live', 'liveStartTime')
          chatMsg.info = msgInfo
          this.chatMap[msgInfo.chatId] = chatMsg
        }
        this.uiChat.updateScroll()
      }
    })
    //私聊
    HDScene.onPrivateChat({
      callback: (info) => {
        let msgInfo = info
        let chatMsg = new PrivateChatMsg()
        chatMsg.info = msgInfo
        this.uiChat.updateScroll()
      }
    })
    HDScene.onPrivateChatRevert({
      callback: (info) => {
        let msgInfo = info
        let chatMsg = new PrivateChatMsg()
        chatMsg.info = msgInfo
        this.uiChat.updateScroll()
      }
    })
    //老师列表
    HDScene.onTeachers({
      callback: (info) => {
        let teachers = info
        for (let i = 0; i < teachers.length; i++) {
          if (!this.teachers[teachers[i].id]) {
            let name = teachers[i].name
            this.teachers[teachers[i].id] = teachers[i].name
            this.uiChat.appendSelected(teachers[i].id, name)
          }
        }
      }
    })
    //公告
    HDScene.onAnnounce({
      callback: (d) => {
        this.announce.content = d
        this.announce.isShowPanel = true
      }
    })
    HDScene.onAnounceRelease({
      callback: (d) => {
        this.announce.content = d
        this.announce.isShowPanel = true
      }
    })
    HDScene.onAnounceDelete({
      callback: () => {
        this.announce.content = '暂无公告'
        this.announce.isShowPanel = false
      }
    })

    // HDScene.addEvent(HDScene.OnAnnounceDelete, () => {
    //   this.announce.content = '暂无公告'
    //   this.announce.isShowPanel = false
    // })
  }

  updateUserList() {
    if (this.uiChat.chatSwichSelect) {
      this.uiChat.hideChatMsg(false)
      this.uiChat.showPrivateChat(this.selectedTeacher)
    } else {
      this.uiChat.hideChatMsg(true)
    }
  }

  addHandler() {
    let chatSmile = this.getNode('chat-smile')//选择表情
    let chatSwitch = this.getNode('chat-switch')//私聊
    let chatSelect = this.getNode('chat-select')//选择聊天对象
    let smilesList = this.getNode('chat-smile-list')//表情面板
    let chatOption = this.getNode('chat-options')//选择老师
    let sendMsg = this.getNode('send-chat')//发送聊天按钮
    let annouBtn = this.getNode('announcement_btn') //点击公告按钮
    let annouCloseBtn = this.getNodeByClass('announcement-close')//关闭公告按钮
    let sendInput = this.getNode('send-chat-content')//聊天输入框
    let chatContainer = this.getNode('chat-container')//
    let chatSwich = this.getNode('chat-switch')//聊天对象
    this.bind(chatSwich, 'click', () => {
      this.uiChat.chatSwichSelect = !this.uiChat.chatSwichSelect
      this.updateUserList()
    })
    this.bind(chatContainer, 'mouseover', () => {

      this.uiChat.isAutoScroll = false
    })
    this.bind(chatContainer, 'mouseout', () => {

      this.uiChat.isAutoScroll = true

    })
    this.bind(sendInput, 'keydown', (e) => {

      switch (e.keyCode.toString()) {
        case '13':
          e.preventDefault()
          sendMsgInfo()
          break
      }
    })
    this.bind(annouBtn, 'click', (e) => {
      this.announce.isShowPanel = true
    })
    this.bind(annouCloseBtn, 'click', () => {
      this.announce.isShowPanel = false
    })
    this.bind(chatSmile, 'click', (e) => {
      this.uiChat.isShowChatSmileList = !this.uiChat.isShowChatSmileList

    })
    this.bind(chatSwitch, 'click', (e) => {

    })
    this.bind(chatSelect, 'click', () => {
      this.uiChat.isShowChatSelect = !this.uiChat.isShowChatSelect
    })
    this.bind(chatOption, 'click', (e) => {
      let selected = e.target
      if (selected.localName === 'li') {
        this.selectedTeacher = selected.id ? selected.id : 'all'
        this.selectedteacherName = selected.innerHTML
        this.uiChat.selectName = this.selectedteacherName

      }
      if (this.selectedTeacher != 'all') {
        this.uiChat.chatSwichVisible = true
      } else {
        this.uiChat.chatSwichVisible = false
      }
      this.updateUserList()
    })
    this.bind(smilesList, 'click', (e) => {
      let select = e.target.parentNode
      if (select.localName == 'td') {
        let index = this.getAttr(select, 'index')
        this.uiChat.smiles = index
        this.uiChat.isShowChatSmileList = false

      }

    })
    let isCanSend = true
    let timeOutId = -1

    let t = this
    this.bind(sendMsg, 'click', (e) => {
      sendMsgInfo()
    })

    function sendMsgInfo() {
      if (!isCanSend) {
        t.ui.alertTip({
          parentNodeId: 'chatAlertTipWrap',
          content: '发送过于频繁，请稍后'
        })
        return false
      }
      let msg = Utils.trim(t.uiChat.msg)
      if (msg.length > 300) {
        t.ui.alertTip({
          parentNodeId: 'chatAlertTipWrap',
          content: '聊天不能超过300个字符'
        })
        return false
      }
      if (!msg) {
        t.ui.alertTip({
          parentNodeId: 'chatAlertTipWrap',
          content: '聊天信息不能为空'
        })
        return false
      }
      t.ui.alertTipClose()
      isCanSend = false
      let teacher = t.selectedTeacher
      let teacherName = t.selectedTeacherName
      if (t.selectedTeacher === 'all') {
        HDScene.sendPublicMsg({'msg': msg})
      } else {
        HDScene.sendPrivateMsg({'msg': msg, 'teacher': teacher, 'teacherName': teacherName})
      }
      t.uiChat.updateScroll()
      t.uiChat.msg = ''
      timeOutId = setTimeout(() => {
        isCanSend = true
        clearTimeout(timeOutId)
      }, 2000)
    }

  }

}

export default Chat