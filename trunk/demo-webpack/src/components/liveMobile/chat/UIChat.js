import Render from 'common/render'

class UIChat extends Render {
  constructor() {
    super()
    this.isSelectedChatSmile = false
    this._isShowChatSelect = false
    this.isShowChatSmileList = false
  }

  get isShowChatSmileList() {
    return this.isSelectedChatSmile
  }

  //设置表情列表是否显示
  set isShowChatSmileList(v) {
    this.isSelectedChatSmile = v
    let style = v ? '' : 'none'
    this.setStyle('chat-smile-list', {'display': style})
  }

  get isShowChatSelect() {
    return this._isShowChatSelect
  }

  set isShowChatSelect(v) {
    this._isShowChatSelect = v
    let style = v ? 'block' : 'none'
    this.setStyle('chat-options', {'display': style})
  }

  //获取发送的消息内容
  get msg() {
    let chatMsg = this.getNode('send-chat-content').value
    let nmsg = ''
    let ur = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    if (ur.test(chatMsg)) {
      nmsg += '[uri_' + chatMsg + '] '
    } else {
      nmsg += chatMsg + ' '
    }
    return nmsg
  }

  set msg(v) {
    this.getNode('send-chat-content').value = ''
  }

  set smiles(v) {
    this.getNode('send-chat-content').value += this.getSmiles(v)
  }

  set selectName(v) {
    let selectNameNode = this.getNode('select-name')
    this.innerHTML(selectNameNode, v)
  }

  set isShowPrivateChat(v) {
    this.setStyle('private_msg', {display: 'block'})
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

  updateScroll() {
    let chatContainer = this.getNodeByClass('chat-message')
    let h = this.getNode('chat-container').offsetHeight
    chatContainer.scrollTo(0, h)
  }

}

export default UIChat