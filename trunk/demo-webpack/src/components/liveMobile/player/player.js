import Component from 'common/component'
import template from './player.html'
import './player.scss'
import UIPlayer from './UIPlayer'
import Orientation from 'common/public/orientation'
import Utils from 'common/utils'
import WX from 'common/public/wx'

class Player extends Component {
  tipTimer = 0
  tipTimerInterval = 15000

  constructor() {
    super()

    this.name = 'player'
    this.render('player', template, () => {
      this.init()
    })
    this.ui = new UIPlayer()

    HDScene.addEvent(HDScene.OnLoginSuccess, (e) => {
      Utils.log('HDScene.isLive', HDScene.isLive)
      if (!HDScene.isLive) {
        this.ui.showTips = true
      }
    })

    HDScene.onLiveStream({
      liveStart: () => {
        this.ui.showTips = false
      },
      living: () => {
        this.ui.showTips = false
      }, liveEnd: () => {
        this.ui.showTips = true
        this.ui.tipContent = '直播已结束'
        this.tipTimer && clearTimeout(this.tipTimer)
        this.tipTimer = setTimeout(() => {
          this.ui.tipContent = '直播正在准备中'
        }, this.tipTimerInterval)
      }
    })
  }

  init() {
    let orientation = new Orientation()
    orientation.init()

    if (Utils.isIOS && Utils.isWeiXin()) {
      let wx = new WX()
      wx.WeiXinVideoAutoPlayer('player_live')
    }
  }
}

export default Player