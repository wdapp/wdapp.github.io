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

    HDScence.addEvent(HDScence.OnLoginSuccess, (e) => {
      Utils.log('HDScence.isLive', HDScence.isLive)
      if (!HDScence.isLive) {
        this.ui.showTips = true
      }
    })

    HDScence.addEvent(HDScence.OnLiveStart, () => {
      this.ui.showTips = false
    })
    HDScence.addEvent(HDScence.OnLiveEnd, () => {
      this.ui.showTips = true
      this.ui.tipContent = '直播已结束'
      this.tipTimer && clearTimeout(this.tipTimer)
      this.tipTimer = setTimeout(() => {
        this.ui.tipContent = '直播正在准备中'
      }, this.tipTimerInterval)
    })
    HDScence.addEvent(HDScence.OnLiveStarting, () => {
      this.ui.showTips = false
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