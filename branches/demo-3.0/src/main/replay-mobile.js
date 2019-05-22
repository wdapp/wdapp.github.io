import 'common/hd'//提供Web SDK 观看回放事件、方法、属性
import fastClick from 'fastclick'//解决移动端点击延迟问题
import flexible from '@wdapp/flexible'//引入rem布局配置文件
import Swiper from 'swiper'//解决移动端点击延迟问题
import './styles/replay-mobile.scss'//移动端回放私有样式

//自定义组件
import Player from 'components/replayMobile/player/player'
import Document from 'components/replayMobile/document/document'
import Navigation from 'components/replayMobile/navigation/navigation'
import Chat from 'components/replayMobile/chat/chat'
import QuestionAnswer from 'components/replayMobile/questionAnswer/questionAnswer'
import Intro from 'components/replayMobile/intro/intro'

window.debug = true

window.onload = function () {

  let swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    initialSlide: 2
  })

  new Player()

  new Document()

  new Navigation()

  new Chat()

  new QuestionAnswer()

  new Intro()

  fastClick.attach(document.body)

  flexible.init(750, 750)

  $.DW.config({
    userId: 'B27039502337407C',
    roomId: '3115C441D8B66A719C33DC5901307461',
    recordId: '96C0454B9E3CE464',
    groupId: '',
    viewername: 'haha',
    viewertoken: '',
    isH5play: true,
    fastMode: true,
  })

}




