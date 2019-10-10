import Render from 'common/render'

class UITeacher extends Render {
  constructor() {
    super()
    this.node = {}
  }

  appendSelected(id, name) {
    this.id = id
    let li = this.createNode('li')
    li.className = 'message'
    li.id = id
    li.name = name
    this.innerHTML(li, `<span class="message-name">${name}</span>
                       <!--<span class="message-time">15:22:31</span>-->
                       <p class="message-content"></p>`)
    this.appendChild('private-message-list', li)
    this.node = li
  }
}

export default UITeacher