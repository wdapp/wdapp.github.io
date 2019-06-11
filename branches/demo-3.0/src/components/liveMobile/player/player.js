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


    // if (livePlayer) {
      this.bind(document, 'WeixinJSBridgeReady',  ()=> {
        console.log(111)
        let livePlayer = this.getNode('player_live')
        console.log(livePlayer)
        setTimeout(()=>{
          livePlayer.play()
        },1000)
        this.bind(livePlayer, 'canplay',  ()=> {
          livePlayer.play()
          alert(111)
        }, false)
      }, false)
    //

    // }

  }
}

export default Player