import Render from 'common/render'

class Announcement extends Render {
  constructor() {
    super()
    // this._isShow = false

  }

  get isShowPanel() {
    return this._isShow
  }

  //是否显示面板
  set isShowPanel(v) {
    this._isShow = v
    let anPanel = this.getNodeByClass('announcement-content-wrap')
    let visible = v ? 'block' : 'none'
    this.setStyle(anPanel, {'display': visible})
  }

  set content(v) {
    if (!v) {
      this.innerHTML(this.getNode('announcement_content'), '暂无公告')
    } else {
      this.innerHTML(this.getNode('announcement_content'), v)
    }
  }
}

export default Announcement