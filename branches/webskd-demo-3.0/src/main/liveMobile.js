import 'common/config/config.js'//全局配置文件
import LiveAdaptive from 'common/liveAdaptive'
import {fastClick, flexible, Swiper} from 'common/config/mobile'//移动端配置文件
import './styles/live-mobile.scss'//移动端观看直播私有样式
import Utils from 'common/utils'//公共方法

import Player from 'components/liveMobile/player/player'
import DrawPanel from 'components/liveMobile/drawPanel/drawPanel'
import Controls from 'components/liveMobile/controls/controls'
import Navigation from 'components/liveMobile/navigation/navigation'
import Setting from 'components/liveMobile/setting/setting'
import Chat from 'components/liveMobile/chat/chat'
import PrivateMessage from 'components/liveMobile/privateMessage/privateMessage'
import QuestionAnswer from 'components/liveMobile/questionAnswer/questionAnswer'
import Intro from 'components/liveMobile/intro/intro'

window.onload = function () {
  fastClick.attach(document.body)
  flexible.init(750, 750)

  let swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    initialSlide: 3
  })

  new Player()

  new DrawPanel()

  new Controls()

  new Navigation()

  new Setting()

  new Chat()

  new PrivateMessage()

  new QuestionAnswer()

  new Intro()

  let params = Utils.parseUrl(localStorage.address)

  var liveAdaptive = new LiveAdaptive()

  liveAdaptive.init({
    userId: params.userid || 'B27039502337407C',
    roomId: params.roomid || '3115C441D8B66A719C33DC5901307461',
    viewerName: params.viewername || '抖音BGM',
    viewerToken: '',
    groupId: '',
    viewerCustominfo: '',
    viewerCustomua: 'web',
    language: 'en',
    fastMode: true,
    success: function (result) {
      Utils.log(result)
    },
    fail: function (error) {
      Utils.log(error)
    }
  })

}


