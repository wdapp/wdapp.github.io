import Component from 'common/component'
import template from './player.html'
import './player.scss'
import FlashTip from 'common/public/flashtip'

class Player extends Component {
  constructor() {
    super()

    this.render('player', template, () => {
      this.init()
    })
  }

  init() {
    this.config()
  }

  config() {
    //隐藏播放器控制器
    HDScene.isShowControl(false)
    //初始化flash播放器
    HDScene.onPlayerMode((data) => {
      if (!data.isH5play) {
        FlashTip.init('player')
      }
    })
  }
}

export default Player