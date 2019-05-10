import 'common/config/config'//全局配置文件
import LiveAdaptive from 'common/liveAdaptive'//Web SDK
import 'common/public/liveSDK'//Web SDK
import StateMachine from 'common/StateMachine'//状态机
import Utils from 'common/utils'//公共方法
import BootStrap from 'common/userInterface'//BootStrap
import './styles/live.scss'//观看直播私有样式

import Player from 'components/live/player/player'
import drawPanel from 'components/live/drawPanel/drawPanel'
import QuestionAnswer from 'components/live/questionAnswer/questionAnswer'
import Chat from 'components/live/chat/chat'
import Controls from 'components/live/controls/controls'

window.onload = function () {
  let stateMachine = new StateMachine({
    name: 'login',
    init: 'quiting',
    transitions: [
      {name: 'login', from: 'quiting', to: 'loging'},
      {name: 'quit', from: 'loging', to: 'quiting'},
    ],
    methods: {
      onLogin: function () {
        Utils.log('login')
      },
      onQuit: function () {
        Utils.log('quit')
      }
    }
  })

  new Player()

  new drawPanel()

  new QuestionAnswer()

  new Chat()

  new Controls()

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
      stateMachine.login()
    },
    fail: function (error) {
      Utils.log(error)
      stateMachine.quit()
    }
  })

  // DWLive.init({
  //   userid: 'B27039502337407C',
  //   roomid: '3115C441D8B66A719C33DC5901307461',
  //   viewername: 'hello',
  //   groupid: '',
  //   viewertoken: '',
  //   viewercustomua: '',
  //   language: '',
  //   viewercustominfo: '',
  //   fastMode: true,
  // })
}





