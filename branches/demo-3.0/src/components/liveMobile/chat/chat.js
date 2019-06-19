import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
import UIChat from './UIChat'
import LiveInfo from 'common/liveinfo'
import ChatMsg from './ChatMsg'
import Announce from './announcement'
import Utils from 'common/utils'
import Input from 'common/public/input'

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
    this.selectedTeacherName = ''
    this.announce = new Announce()
    this.addHandler()
    this.addEvents()
  }

  addEvents() {
    HDScence.onPublicChat({
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
    HDScence.onAnnounce({
      callback: (d) => {
        this.announce.content = d
        this.announce.isShowPanel = true
      }
    })
    HDScence.onAnounceRelease({
      callback: (d) => {
        this.announce.content = d
        this.announce.isShowPanel = true
      }
    })
    HDScence.onAnounceDelete({
      callback: () => {
        this.announce.content = '暂无公告'
        this.announce.isShowPanel = false
      }
    })
    let input = new Input({
      id: 'send-chat-content'
    })
    if (Utils.isIOS() && Utils.isWeiXin()) {
      input.scrollIntoView()
    }
    if (Utils.isIOS()) {
      input.tabIndex()
    }
    if (Utils.isAndroid()) {
      input.scrollIntoViewIfNeeded()
    }
  }

  addHandler() {
    let chatSmile = this.getNode('chat-smile')//选择表情
    let chatSelect = this.getNode('chat-select')//选择聊天对象
    let smilesList = this.getNode('chat-smile-list')//表情面板
    let chatOption = this.getNode('chat-options')//选择老师
    let sendMsg = this.getNode('send-chat')//发送聊天按钮
    let annouBtn = this.getNode('announcement_btn') //点击公告按钮
    let annouCloseBtn = this.getNodeByClass('announcement-close')//关闭公告按钮
    this.bind(annouBtn, 'click', (e) => {
      this.announce.isShowPanel = true
    })
    this.bind(annouCloseBtn, 'click', () => {
      this.announce.isShowPanel = false
    })
    this.bind(chatSmile, 'click', (e) => {
      this.uiChat.isShowChatSmileList = !this.uiChat.isShowChatSmileList
    })
    this.bind(chatSelect, 'click', () => {
      this.uiChat.isShowChatSelect = !this.uiChat.isShowChatSelect
    })
    this.bind(chatOption, 'click', (e) => {
      let selected = e.target
      if (selected.localName === 'li') {
        this.selectedTeacher = selected.id ? selected.id : 'all'
        this.selectedTeacherName = selected.innerHTML
        this.uiChat.selectName = this.selectedTeacherName
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
    let t = this
    let timeOutId = -1
    this.bind(sendMsg, 'click', (e) => {
      let msg = Utils.trim(this.uiChat.msg)
      if (msg.length > 300) {
        t.alert('发送聊天字数不应超过300字', 'warning')
        return
      }
      if (!isCanSend) {
        t.alert('发送过于频繁，请稍后', 'warning')
        return
      }
      if (!msg) {
        t.alert('聊天信息不能为空', 'warning')
        return
      }

      isCanSend = false
      let teacher = t.selectedTeacher
      let teacherName = t.selectedTeacherName
      if (t.selectedTeacher === 'all') {
        HDScence.sendPublicMsg({'msg': msg})
      } else {
        HDScence.sendPrivateMsg({'msg': msg, 'teacher': teacher, 'teacherName': teacherName})
      }
      t.uiChat.updateScroll()
      t.uiChat.msg = ''
      timeOutId = setTimeout(() => {
        isCanSend = true
        clearTimeout(timeOutId)
      }, 2000)
    })
  }
}

export default Chat