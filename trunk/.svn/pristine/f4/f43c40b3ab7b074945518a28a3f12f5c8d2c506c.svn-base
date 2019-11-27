import Render from 'common/render'

class UIPrivate extends Render {
  constructor() {
    super()
    this.privateInput = this.getNode('private_input')
  }

  set isPrivatePanelShow(v) {
    if (!v) {
      this.setStyle('private_msg', {display: 'none'})
    } else {
      this.setStyle('private_msg', {display: 'block'})
    }
  }

  set isShowSelfPrivatePanel(v) {
    let show = v ? 'block' : 'none'
    this.setStyle('send-private-message', {display: (v ? 'flex' : 'none')})
    this.setStyle('private-message-content-wrap', {display: show})
    this.setStyle('private-message-list', {display: (v ? 'none' : 'block')})
    this.setStyle('private-message-return', {display: show})
  }

  get privateValue() {
    let value = this.privateInput.value
    this.privateInput.value = ''
    return value
  }
}

export default UIPrivate