import Component from 'common/component'
import template from './navigation.html'
import './navigation.scss'
import Utils from 'common/utils'
import Swiper from 'swiper'//解决移动端点击延迟问题
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
    //初始化导航
    Utils.log('navigation options', this.options)
    this.select = this.getNode('select')
    this.navigationOptions = this.getNode('navigationOptions')
    this.addOptions(this.navigationOptions, this.options, () => {
      this.eventEntrust()
    })

    //配置Swiper
    let self = this
    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      initialSlide: 0,
      speed: 600,
      on: {
        slideChangeTransitionStart: function () {
          self.index = this.activeIndex
          self.updateSelect(self.index)
          Utils.log('Swiper', self.index)
        }
      }
    })

    //创建ui对象
    this.ui = new UserInterface()

    //更新select位置
    HDScene.once('onOrientationChange', (orientation) => {
      this.updateSelect(this.index)
    })
    let delay = 0
    HDScene.onRotateScreenChange((orientation) => {
      if (orientation == 'portrait') {//竖屏
        delay && clearTimeout(delay)
        delay = setTimeout(() => {
          HDScene.emit('onOrientationChange', orientation)
        }, 200)
      } else {//横屏
        delay && clearTimeout(delay)
      }
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
      if (this.isChangeSelect) {
        this.swiper.slideTo(this.index)
      }
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
    let value = _index * section + left
    this.ui.moveX(this.select, value, () => {
      this.isChangeSelect = true
    })
  }
}

export default Navigation