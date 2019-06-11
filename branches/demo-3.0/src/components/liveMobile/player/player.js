import Component from 'common/component'
import template from './player.html'
import './player.scss'
import UIPlayer from './UIPlayer'
import Orientation from 'common/public/orientation'
import Utils from 'common/utils'
import WX from 'common/public/wx'

class Player extends Component {
  constructor() {
    super()

    this.name = 'player'
    this.render('player', template, () => {
      this.init()
    })
    this.ui = new UIPlayer()
    this.ui.showTips = true
    HDScence.addEvent(HDScence.OnLiveStart, () => {
      this.ui.showTips = false
    })
    HDScence.addEvent(HDScence.OnLiveEnd, () => {
      this.ui.showTips = true
      this.ui.tipContent = '直播已结束'
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