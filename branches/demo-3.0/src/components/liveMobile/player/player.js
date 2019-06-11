import Component from 'common/component'
import template from './player.html'
import './player.scss'
import UIPlayer from './UIPlayer'
import Orientation from 'common/public/orientation'

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

    let canPlayOnce = true
    // if (livePlayer) {
      this.bind(document, 'WeixinJSBridgeReady',  ()=> {
        let livePlayer = this.getNode('player_live')
        // setTimeout(()=>{
        //   livePlayer.play()
        // },1000)
        this.bind(livePlayer, 'canplay',  ()=> {
          if(canPlayOnce){
            livePlayer.play()
            canPlayOnce = false
          }
        }, false)
      }, false)
    //

    // }

  }
}

export default Player