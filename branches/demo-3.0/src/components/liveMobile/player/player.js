import Component from 'common/component'
import template from './player.html'
import './player.scss'
import UIPlayer from "./UIPlayer"

class Player extends Component {
  constructor() {
    super()

    this.name = 'player'
    this.render('player', template, () => {

    })
    this.ui = new UIPlayer();
    this.ui.showTips=true;
    hdScience.addEvent(hdScience.OnLiveStart,()=>{
      this.ui.showTips=false;
    })
    hdScience.addEvent(hdScience.OnLiveEnd,()=>{
      this.ui.showTips = true;
      this.ui.tipContent="直播已结束"
    })
  }
}

export default Player