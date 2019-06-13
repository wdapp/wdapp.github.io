import Render from 'common/render'

class UIChat extends Render {
  constructor() {
    super()
    this.isSelectedChatSmile = false
    this._isShowChatSelect = false
    this.isShowChatSmileList = false
    this._isAutoScroll = true
    this._chatSwichSelect = false
  }

  //设置表情列表是否显示
  set isShowChatSmileList(v) {
    this.isSelectedChatSmile = v
    let style = v ? '' : 'none'
    this.setStyle('chat-smile-list', {'display': style})
  }

  get isShowChatSmileList() {
    return this.isSelectedChatSmile
  }

  hideChatMsg(v) {
    let li = document.querySelectorAll('#chat-container li')
    for (let i = li.length; i >= 0; i--) {
      this.setStyle(li[i], {display: (v ? 'block' : 'none')})
    }
  }

  set isShowChatSelect(v) {
    this._isShowChatSelect = v
    let style = v ? 'block' : 'none'
    this.setStyle('chat-options', {'display': style})
  }

  showPrivateChat(id) {
    if (id === 'all') {
      this.hideChatMsg(true)
    }
    let fId = `#chat-container li[fid="${id}"]`
    let tId = `#chat-container li[tid="${id}"]`
    let fNode = document.querySelectorAll(fId) ? document.querySelectorAll(fId) : []
    let tNode = document.querySelectorAll(tId) ? document.querySelectorAll(tId) : []
    for (let i = fNode.length; i >= 0; i--) {
      this.setStyle(fNode[i], {display: 'block'})
    }
    for (let j = tNode.length; j >= 0; j--) {
      this.setStyle(tNode[j], {display: 'block'})
    }
  }

  get isShowChatSelect() {
    return this._isShowChatSelect
  }

  //获取发送的消息内容
  get msg() {
    return this.getNode('send-chat-content').value
  }

  set msg(v) {
    this.getNode('send-chat-content').value = ''
  }

  set smiles(v) {
    this.getNode('send-chat-content').value += this.getSmiles(v)
  }

  set chatSwichVisible(v) {
    let st = v ? 'inline-block' : ''
    this.setStyle('chat-switch', {'display': st})
  }

  set chatSwichSelect(v) {
    this._chatSwichSelect = v
    let className = v ? 'chat-switch-icon chat-switch-icon-active' : 'chat-switch-icon'
    this.getNode('chat-switch').className = className
  }

  get chatSwichSelect() {
    return this._chatSwichSelect
  }

  getSmiles(index) {
    return `[em2_${index}]`
  }

  //添加老师选项
  appendSelected(id, name) {
    let select = `<li id="${id}" class="li-opt">${name}</li>`
    // this.innerHTML(selectId,name);
    this.appendHtml('chat-options', select)
  }

  set selectName(v) {
    let selectNameNode = this.getNode('select-name')
    this.innerHTML(selectNameNode, v)
  }

  set isAutoScroll(v) {

    this._isAutoScroll = v
  }

  get isAutoScroll() {
    return this._isAutoScroll
  }

  updateScroll() {
    if (!this.isAutoScroll) {
      return
    }
    let chatContainer = this.getNode('chat-body')
    let h = this.getNode('chat-container').offsetHeight
    chatContainer.scrollTop = h
  }

}

export default UIChat