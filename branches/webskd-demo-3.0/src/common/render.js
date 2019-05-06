class Render {

  constructor() {

  }

  render(id = "", node = "", callback) {
    const root = this.getRoot(id);

    this.innerHTML(root, node);

    callback && callback();
  }

  getRoot(id = "") {
    if (!id && typeof id !== "string") {
      return false;
    }
    const root = document.getElementById(id) || {};
    return root;
  }

  innerHTML(root = {}, node = "") {
    node && this.isEmptyNode(root) && (root.innerHTML = node);
  }

  isEmptyNode(node = {}) {
    if (!node) {
      return false;
    }
    return node.nodeType > 0 ? true : false;
  }

}

export default Render;