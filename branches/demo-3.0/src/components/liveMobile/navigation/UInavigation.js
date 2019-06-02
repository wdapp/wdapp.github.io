import Render from 'common/render'
import Swiper from 'swiper'

class UInavigation extends Render {
  constructor() {
    super()
    this.swiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      initialSlide: 0,
      speed: 200,
      on: {
        slideChangeTransitionEnd: function () {
          this.activeIndex
        },
      }

    })
    this.index = 0
    this.swiper.on('slideChangeTransitionEnd', () => {
      this.index = this.swiper.activeIndex
      this.active = this.swiper.activeIndex
      console.log('当前切换')
    })

  }

  set swiperChangeIndex(v) {
    this.index = v
    this.swiper.slideTo(v)
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