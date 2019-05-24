import Component from 'common/component'
import template from './navigation.html'
import './navigation.scss'
import Utils from 'common/utils'
import UserInterface from 'common/userInterface'

class Navigation extends Component {

  options = ['文档', '聊天', '问答', '简介']
  isChangeSelect = true
  index = 0

  constructor() {
    super()

    this.render('navigation', template, () => {
      this.init()
    })
  }

  init() {
    Utils.log('navigation options', this.options)
    this.select = this.getNode('select')
    this.navigationOptions = this.getNode('navigationOptions')
    this.addOptions(this.navigationOptions, this.options, () => {
      this.eventEntrust()
    })
    this.ui = new UserInterface()
    this.updateSelect(this.index)
    hd.on('activeIndex', (index) => {
      this.index = index
      this.updateSelect(this.index)
      Utils.log('Swiper', this.index)
    })
  }

  addOptions(parent, options, callback) {
    let template = ``
    for (let i = 0; i < options.length; i++) {
      let option = options[i]
      template += `<li index="${i}">${option}</li>`
    }
    this.appendChild(parent, template)
    callback && callback()
  }

  eventEntrust() {
    this.navigationOptions.addEventListener('click', (event) => {
      let target = event.target
      let index = target.getAttribute('index')
      this.index = parseInt(index)
      this.updateSelect(this.index)
      hd.emit('navigationIndex', this.index)
      Utils.log('Swiper', this.index)
    })
  }

  updateSelect(index) {
    if (!this.isChangeSelect) {
      return false
    }
    this.isChangeSelect = false
    let clientWidth = this.navigationOptions.clientWidth
    let section = clientWidth / this.options.length
    let width = this.select.clientWidth
    let left = (section / 2) - (width / 2)
    let _index = parseInt(index)
    // this.select.style.left = _index * 80 + left + 'px'
    let value = _index * section + left
    this.ui.moveX(this.select, value, () => {
      this.isChangeSelect = true
    })
  }
}

export default Navigation