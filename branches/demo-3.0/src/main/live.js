import 'common/HDScience'//直播核心对象
import LiveAdaptive from 'common/liveAdaptive'//Web SDK
import Utils from 'common/utils'//公共方法
import UserInterface from 'common/userInterface'//bootstrap组件库
import './styles/live.scss'//PC端直播私有样式

//自定义组件
import Player from 'components/live/player/player'
import Document from 'components/live/document/document'
import QuestionAnswer from 'components/live/questionAnswer/questionAnswer'
import Chat from 'components/live/chat/chat'
import Controls from 'components/live/controls/controls'

window.debug = true

window.onload = function () {

  new Player()

  new Document()

  new QuestionAnswer()

  new Chat()

  new Controls()

  let params = Utils.parseUrl(localStorage.address)

  var liveAdaptive = new LiveAdaptive()

  liveAdaptive.init({
    userId: params.userid || 'B27039502337407C',
    roomId: params.roomid || '3115C441D8B66A719C33DC5901307461',
    viewerName: params.viewername || '抖音BGM',
    viewerToken: '123',
    groupId: '',
    viewerCustominfo: '',
    viewerCustomua: 'web',
    language: 'zh',
    fastMode: true,
    success: function (result) {
      Utils.log(result)
    },
    fail: function (error) {
      Utils.log(error)
    }
  })
}





