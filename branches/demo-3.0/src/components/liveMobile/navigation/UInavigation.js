import Render from 'common/render'
import Swiper from 'swiper'
import UserInterface from 'common/userInterface'

class UInavigation extends Render {
  options = ['文档', '聊天', '问答', '简介']
  isChangeSelect = true
  index = 0

  constructor() {
    super()
    let self = this
    this.navigationOptions = this.getNode('options-box')
    this.select = this.getNode('select')

    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      initialSlide: 0,
      speed: 600,
      on: {
        slideChangeTransitionStart: function () {
          self.index = this.activeIndex
          self.active = this.activeIndex
          self.updateSelect(this.activeIndex)
        },
      }
    })
    //创建ui对象
    this.ui = new UserInterface()

    //更新select位置
    HDScence.once('onOrientationChange', (orientation) => {
      this.updateSelect(this.index)
    })
    let delay = 0
    HDScence.onRotateScreenChange((orientation) => {
      if (orientation == 'portrait') {//竖屏
        delay && clearTimeout(delay)
        delay = setTimeout(() => {
          HDScence.emit('onOrientationChange', orientation)
        }, 200)
      } else {//横屏
        delay && clearTimeout(delay)
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

  set swiperChangeIndex(v) {
    this.index = v
    if(this.isChangeSelect){
      this.swiper.slideTo(v)
    }
    this.active = v

  }

  get swiperChangeIndex() {
    return this.index
  }

  set active(v) {
    let dom = this.getNode('options-box')
    let domLength = this.getNode('options-box').children.length

    for (let i = 0; i < domLength; i++) {
      this.getChildNode('options-box', i).className = ''
    }
    this.getChildNode('options-box', v).className = 'active'
  }

  set settingpanel(v) {
    this.setStyle('setting-panel', {display: 'block'})
  }

}

export default UInavigation