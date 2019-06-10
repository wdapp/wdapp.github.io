import Component from 'common/component'
import template from './player.html'
import './player.scss'
import Orientation from 'common/public/orientation'
import VideoTip from './videotip'

class Player extends Component {
  constructor() {
    super()

    this.render('player', template, () => {
      this.init()
    })
  }

  init() {
    let orientation = new Orientation()
    orientation.init()
    let videoTip = new VideoTip()
    videoTip.init('视频正在加载中...')
  }

}

export default Player