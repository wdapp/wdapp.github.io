import 'common/HDScience'//直播核心对象
import './styles/live-mobile.scss'//移动端观看直播私有样式
import Swiper from 'swiper'//解决移动端点击延迟问题
import fastClick from 'fastclick'//解决移动端点击延迟问题
import flexible from '@wdapp/flexible'//引入rem布局配置文件

import LiveAdaptive from 'common/liveAdaptive'
import Utils from 'common/utils'//公共方法库
import UserInterface from 'common/userInterface'

//自定义组件
import Player from 'components/liveMobile/player/player'
import Document from 'components/liveMobile/document/document'
import Controls from 'components/liveMobile/controls/controls'
import Navigation from 'components/liveMobile/navigation/navigation'
import Setting from 'components/liveMobile/setting/setting'
import Chat from 'components/liveMobile/chat/chat'
import PrivateMessage from 'components/liveMobile/privateMessage/privateMessage'
import QuestionAnswer from 'components/liveMobile/questionAnswer/questionAnswer'
import Intro from 'components/liveMobile/intro/intro'

window.debug = true

window.onload = function () {

  fastClick.attach(document.body)
  flexible.init(750, 750)

  let swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    initialSlide: 0
  })

  new Player()

  new Document()

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


