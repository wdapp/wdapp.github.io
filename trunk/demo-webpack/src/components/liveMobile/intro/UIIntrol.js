import Render from 'common/render'

class UIIntrol extends Render {
  constructor() {
    super()


  }

  set content(v) {
    let node = this.getNode('introl-content')
    this.innerHTML(node, v)
  }
}

export default UIIntrol