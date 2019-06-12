import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
import UIChat from './UIChat'
import LiveInfo from 'common/liveinfo'
import ChatMsg from './ChatMsg'
import Announce from './announcement'
import Utils from 'common/utils'


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
    HDScence.addEvent(HDScence.OnPublishChatMsg, () => {
      let msgInfo = LiveInfo.publicChatMsgInfo
      if (LiveInfo.getLoginInfoData('viewer', 'groupId') === msgInfo.groupId || !msgInfo.groupId || !LiveInfo.getLoginInfoData('viewer', 'groupId')) {
        let chatMsg = new ChatMsg()
        msgInfo.liveStart = LiveInfo.getLoginInfoData('live', 'liveStartTime')
        chatMsg.info = msgInfo
        this.chatMap[msgInfo.chatId] = chatMsg
      }
      this.uiChat.updateScroll()
    })
    // HDScence.addEvent(HDScence.OnPrivateChatMsg, () => {
    //   let msgInfo = LiveInfo.privateChatMsgInfo
    //   let chatMsg = new PrivateChatMsg()
    //   chatMsg.info = msgInfo
    //   this.uiChat.updateScroll();
    // })

    HDScence.addEvent(HDScence.OnAnnounceShow, () => {
      this.announce.content = LiveInfo.onAnnounceInfo
      this.announce.isShowPanel = true
    })
    HDScence.addEvent(HDScence.OnAnnounceDelete, () => {
      this.announce.content = '暂无公告'
      this.announce.isShowPanel = false
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
    // this.bind(privateChat, 'click', () => {
    //   this.uiChat.isShowPrivateChat = true
    // })
    // this.bind(chatSwitch, 'click', (e) => {
    //
    // })
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
    this.bind(sendMsg, 'click', (e) => {
      let msg = Utils.trim(this.uiChat.msg)
      if (msg.length > 300) {
        HDScence.alert('发送聊天字数不应超过300字', 'warning')
        return
      }
      if (!isCanSend) {
        HDScence.alert('发送过于频繁，请稍后', 'warning')
        return
      }
      if (!msg) {
        HDScence.alert('聊天信息不能为空', 'warning')
        return
      }

      isCanSend = false
      this.sdk = HDScence.getObjectForName(HDScence.LiveInterface)

      if (this.selectedTeacher === 'all') {
        this.sdk.call(this.sdk.SENDPUBLICMSG, msg)
      } else {
        this.sdk.call(this.sdk.SENDPRIVATEMSG, this.selectedTeacher, this.selectedteacherName, msg)
      }
      this.uiChat.updateScroll()
      this.uiChat.msg = ''
      timeOutId = setTimeout(() => {
        isCanSend = true
        clearTimeout(timeOutId)
      }, 2000)
    })
  }
}

export default Chat