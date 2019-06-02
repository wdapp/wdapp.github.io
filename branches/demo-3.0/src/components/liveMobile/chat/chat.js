import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
import UIChat from './UIChat'
import LiveInfo from 'common/liveinfo'
import ChatMsg from './ChatMsg'
import Announce from './announcement'

class Chat extends Component {

  constructor() {
    super()

    this.name = 'chat'
    this.render('chat', template, () => {

    })
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
    hdScience.addEvent(hdScience.OnPublishChatMsg, () => {
      let msgInfo = LiveInfo.publicChatMsgInfo
      let chatMsg = new ChatMsg()
      chatMsg.info = msgInfo
      this.chatMap[msgInfo.chatId] = chatMsg
    })

    hdScience.addEvent(hdScience.OnANnounceShow, () => {
      this.announce.content = LiveInfo.onAnnounceInfo
    })
  }

  addHandler() {
    let chatSmile = this.getNode('chat-smile')//选择表情
    // let chatSwitch = this.getNode('chat-switch')//私聊
    let chatSelect = this.getNode('chat-select')//选择聊天对象
    let smilesList = this.getNode('chat-smile-list')//表情面板
    let chatOption = this.getNode('chat-options')//选择老师
    let sendMsg = this.getNode('send-chat')//发送聊天按钮
    let annouBtn = this.getNode('announcement_btn') //点击公告按钮
    let annouCloseBtn = this.getNodeByClass('announcement-close')//关闭公告按钮
    let privateChat = this.getNode('private_chat')//私聊按钮
    this.bind(annouBtn, 'click', (e) => {
      this.announce.isShowPanel = true
    })
    this.bind(annouCloseBtn, 'click', () => {
      this.announce.isShowPanel = false
    })
    this.bind(chatSmile, 'click', (e) => {
      this.uiChat.isShowChatSmileList = !this.uiChat.isShowChatSmileList

    })
    this.bind(privateChat, 'click', () => {
      this.uiChat.isShowPrivateChat = true
    })
    // this.bind(chatSwitch, 'click', (e) => {
    //
    // })
    this.bind(chatSelect, 'click', () => {
      // console.log("dia")
      this.uiChat.isShowChatSelect = !this.uiChat.isShowChatSelect
    })
    this.bind(chatOption, 'click', (e) => {
      let selected = e.target
      if (selected.localName === 'li') {
        this.selectedTeacher = selected.id ? selected.id : 'all'
        this.selectedteacherName = selected.innerHTML
        this.uiChat.selectName = this.selectedteacherName
      }
      console.log('dangqian选择的id' + this.selectedTeacher)
    })
    this.bind(smilesList, 'click', (e) => {
      let select = e.target.parentNode
      if (select.localName == 'td') {
        let index = this.getAttr(select, 'index')
        this.uiChat.smiles = index
        this.uiChat.isShowChatSmileList = false

      }

    })
    this.bind(sendMsg, 'click', (e) => {
      this.sdk = hdScience.getObjectForName(hdScience.LiveInterface)
      if (this.selectedTeacher === 'all') {
        this.sdk.call(this.sdk.SENDPUBLICMSG, this.uiChat.msg)
      } else {
        this.sdk.call(this.sdk.SENDPRIVATEMSG, this.selectedTeacher, this.selectedteacherName, this.uiChat.msg)
      }
      this.uiChat.msg = ''
    })
  }
}

export default Chat