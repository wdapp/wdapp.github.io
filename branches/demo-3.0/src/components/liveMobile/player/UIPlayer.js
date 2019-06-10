import Render from 'common/render'

class UIPlayer extends Render {
  constructor() {
    super()
  }

  set showTips(v) {
    let display = v ? 'block' : 'none'
    this.setStyle('video-tip', {display: display})
  }

  set tipContent(v) {
    let contentNode = this.getNode('video-tip-content')
    this.innerHTML(contentNode, v)
  }

}

export default UIPlayer