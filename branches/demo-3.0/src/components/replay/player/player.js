import Component from 'common/component'
import template from './player.html'
import './player.scss'
import FlashTip from './flashtip'

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
    hd.onPlayerMode((data) => {
      if (!data.isH5play) {
        FlashTip.init()
      } else {
        let videoTip = new VideoTip()
        videoTip.init('视频正在加载中...')
      }
    })
  }
}

export default Player