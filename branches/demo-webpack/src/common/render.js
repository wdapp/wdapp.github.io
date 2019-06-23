/**
 * 渲染类
 * */
import Utils from 'common/utils'

class Render {

  constructor() {
    this._root = {}
  }

  getRoot(id = 'app') {
    if (!Utils.isEmptyObject(this._root) || !this.isEmptyNode(this._root)) {
      this._root = document.getElementById(id)
    }
    return this._root
  }

  render(id = '', template = '', callback) {
    if (!Utils.isEmptyString(id) || !Utils.isEmptyString(template)) {
      return false
    }
    let _node = this.getNode(id)
    this.innerHTML(_node, template)
    callback && callback()
  }

  innerHTML(node = {}, template = '') {
    Utils.isEmptyString(template) && this.isEmptyNode(node) && (node.innerHTML = template)
  }

  isEmptyNode(node = {}) {
    if (!node || typeof node !== 'object') {
      return false
    }
    if (node.nodeType) {
      return node.nodeType > 0 ? true : false
    }
    if (node == window) {
      return true
    }
    if (node.length > 0) {
      let result = false
      for (let item of node) {
        if (item.nodeType <= 0) {
          result = false
          break
        } else {
          result = true
        }
      }
      return result
    }
    return false
  }

  deleteNode(node = {}) {
    if (node.length > 0) {
      node.forEach((element, index) => {
        if (!this.isEmptyNode(element)) {
          return false
        }
        this.getRoot().removeChild(element)
      })
      return true
    } else {
      if (!this.isEmptyNode(node)) {
        return false
      }
      this.getRoot().removeChild(node)
      return true
    }
  }

  deleteNodes(nodes = []) {
    if (nodes.length && nodes.length > 0) {
      nodes.forEach((element, index) => {
        if (!this.isEmptyNode(element)) {
          return false
        }
        this.getRoot().removeChild(element)
      })
    }
  }

  createNode(node = 'div') {
    return document.createElement(node)
  }

  getNode(id = '') {
    if (!Utils.isEmptyString(id)) {
      return false
    }
    let dom = document.getElementById(id)
    return dom
  }

  getNodeByClass(className, index = 0) {
    if (!className) {
      return false
    }
    let element = document.getElementsByClassName(className)[index]
    return element
  }

  //删除节点，如果传入空则删除所有子节点，如果child有数据则删除对应节点
  deleteChild(id = '', childNodeId = []) {
    let node = this.getNode(id)
    if (!this.isEmptyNode(node)) {
      return false
    }
    if (childNodeId.length < 1) {
      let children = node.children
      let length = children.length
      for (let i = length - 1; i >= 0; i--) {
        node.removeChild(children[i])
      }
    } else {
      for (let i = 0; i < childNodeId.length; i++) {
        var child = this.getNode(childNodeId[i])
        node.removeChild(child)
      }
    }
  }

  appendChild(node, child) {
    if (this.isEmptyNode(node) && this.isEmptyNode(child)) {
      if (child.length > 0) {
        for (let item of child) {
          node.appendChild(item)
        }
      } else {
        node.appendChild(child)
      }
      return node
    }
    if (Utils.isEmptyString(node) && this.isEmptyNode(child)) {
      let id = node
      let _node = this.getNode(id)
      this.isEmptyNode(_node) && _node.appendChild(child)
      return node
    }
    if (this.isEmptyNode(node) && Utils.isEmptyString(child)) {
      let template = child
      let div = this.createNode('div')
      div.innerHTML = template
      let children = [...div.children]
      children.forEach(function (child) {
        node.appendChild(child)
      })
      return children
    }
    return false
  }

  appendHtml(node, html = '') {
    if (!node) return

    if (this.isEmptyNode(node)) {
      let h = node.innerHTML
      let content = h + html
      node.innerHTML = content
    }
    if (Utils.isEmptyString(node)) {
      let n = this.getNode(node)
      let h = n.innerHTML
      let content = h + html
      n.innerHTML = content
    }
  }

  getChildNode(id = '', index = 0) {
    if (!id) {
      return false
    }
    let element = this.getNode(id)
    return element.children[index]
    return true
  }

  toggleClass(node, className) {
    let oldClassName = node.className
    let _className = className
    let reg = new RegExp(_className)
    if (reg.test(oldClassName)) {
      this.removeClass(node, className)
    } else {
      this.addClass(node, className)
    }
  }

  addClass(node, className) {
    if (!this.isEmptyNode(node) || !Utils.isEmptyString(className)) {
      return false
    }
    let oldClassName = node.className
    let _className = className
    let reg = new RegExp(_className)
    if (reg.test(oldClassName)) {
      return false
    }
    let newClassNmae = oldClassName + ' ' + _className
    node.className = newClassNmae.trim()
    return true
  }

  removeClass(node, className) {
    if (!this.isEmptyNode(node) || !Utils.isEmptyString(className)) {
      return false
    }
    let _classNmae = node.className.replace(className, '')
    node.className = _classNmae.trim()
    return true
  }

  //------

  setStyle(node, style) {
    let element
    if (this.isEmptyNode(node)) {
      element = node
    } else {
      element = this.getNode(node)
    }
    if (!element) return
    for (let str in style) {
      element.style[str] = style[str]
    }

  }

  getAttr(node, attr) {
    let element = node
    if (typeof element === 'string') {
      element = this.getNode(node)
    }
    return element.getAttribute(attr)
  }

}

export default Render