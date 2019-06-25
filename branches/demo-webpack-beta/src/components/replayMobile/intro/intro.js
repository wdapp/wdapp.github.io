import Component from 'common/component'
import template from './intro.html'
import './intro.scss'
import Utils from 'common/utils'

class Intro extends Component {
  constructor() {
    super()

    this.render('intro', template, () => {
      this.init()
    })
  }

  init() {
    HDScene.onDescInfo((data) => {
      this.addIntro(data.desc)
    })
  }

  addIntro(intro) {
    Utils.log('desc', intro)
    let introContent = this.getNode('introContent')
    this.appendChild(introContent, intro)
  }
}

export default Intro