class Render {

  constructor() {

  }

  render(id = '', node = '', callback) {
    const root = this.getNode(id)

    this.innerHTML(root, node)

    callback && callback()
  }

  getRoot() {
    const node = document.getElementById('app') || {}
    return node
  }

  getNode(id = '') {
    if (!id && typeof id !== 'string') {
      return false
    }
    const root = document.getElementById(id) || {}
    return root
  }

  innerHTML(root = {}, node = '') {
    node && this.isEmptyNode(root) && (root.innerHTML = node)
  }

  isEmptyNode(node = {}) {
    if (!node) {
      return false
    }
    return node.nodeType > 0 ? true : false
  }

  getChildNode(node = '', index = 0) {
    if (!node) return ''
    let el = this.getNode(node)
    return el.children[index]

  }

  getNodeByClass(c, index = 0) {
    if (!c) return
    let el = document.getElementsByClassName(c)[index] || {}
    return el
  }

  appendchild(node, child) {
    if (!node) return
    if (typeof node === 'object') {
      node.appendchild(child)
    } else {
      let el = this.getNode(node)

      el.appendChild(child)
    }

  }

  setStyle(node, style) {
    let el = this.getNode(node)
    if (this.isEmptyNode(el)) {
      el.style = style
    }
  }

  //删除节点，如果传入空则删除所有子节点，如果child有数据则删除对应节点
  deletChild(node, child = []) {
    if (!node) return

    let el = this.getNode(node)
    if (el) {
      if (child.length < 1) {
        var children = el.children
        for (let i = 0; i < children.length; i++) {
          el.removeChild(children[i])
        }
      } else {
        for (let i = 0; i < child.length; i++) {
          var cEl = this.getNode(child[i])
          el.removeChild(cEl)
        }
      }

    }
  }

  creatNode(node = 'div') {
    return document.createElement(node)
  }

}

export default Render