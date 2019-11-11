import Render from 'common/render'

class UIPlayer extends Render {
  constructor() {
    super()
  }

  set showTips(v) {
    let display = v ? 'block' : 'none'
    let flex = v ? 'flex' : 'none'
    this.setStyle('video-tip', {display: display})
    this.setStyle('noVideo', {display: flex})
  }

  set tipContent(v) {
    let contentNode = this.getNode('video-tip-content')
    this.innerHTML(contentNode, v)
  }

}

export default UIPlayer