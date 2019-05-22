import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import Swiper from 'swiper'

class Controls extends Component {
  constructor() {
    super()

    this.render('controls', template, () => {
      let controls = new Swiper('.swiper-container-controls', {
        direction: 'horizontal',
        loop: true,
        // autoplay: {
        //   delay: 5000,
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
    })
  }
}

export default Controls