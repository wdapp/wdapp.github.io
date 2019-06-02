import Render from 'common/render'

class UIChat extends Render {
  constructor() {
    super()
    this.isSelectedChatSmile = false
    this._isShowChatSelect = false
    this.isShowChatSmileList = false
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

  set isShowChatSelect(v) {
    this._isShowChatSelect = v
    let style = v ? 'block' : 'none'
    this.setStyle('chat-options', {'display': style})
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

}

export default UIChat