import 'common/liveHDScence' //直播核心对象
import './styles/live-mobile.scss' //移动端观看直播私有样式
import Utils from 'common/utils' //公共方法库
import fastClick from 'fastclick' //解决移动端点击延迟问题
import flexible from 'common/public/flexible'//引入rem布局配置文件
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

HDScence.ready(() => {
  flexible.init(750, 750)
  fastClick.attach(document.body)
  let params = Utils.parseUrl(localStorage.address)
  HDScence.register({
    modules: [Player, Document, Controls, Navigation, Setting, Chat, PrivateMessage, QuestionAnswer, Intro],
    config: params,
    success: function (data) {
      Utils.log('login success', data)
    },
    fail: function (data) {
      Utils.log('login fail', data)
    }
  })
})




