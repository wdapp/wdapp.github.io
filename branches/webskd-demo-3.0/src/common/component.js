import Render from 'common/render'

class Component extends Render {

  constructor() {
    super()
  }

  on(node, t, f) {
    if (!node || !t || node == {}) return
    if (window.attachEvent) {
      let type = 'on' + t
      node.attachEvent(type, f)
    } else {
      node.addEventListener(t, f)
    }
  }
}

export default Component