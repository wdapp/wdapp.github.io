import 'common/replayHDScene'//提供Web SDK 观看回放事件、方法、属性
import Utils from 'common/utils'//公共方法库
import './styles/replay.scss'//PC端回放私有样式
import UserInterface from 'common/userInterface'//UI库

//自定义组件
import Player from 'components/replay/player/player'
import Document from 'components/replay/document/document'
import QuestionAnswer from 'components/replay/questionAnswer/questionAnswer'
import Chat from 'components/replay/chat/chat'
import Controls from 'components/replay/controls/controls'
import Thumbnail from 'components/replay/thumbnail/thumbnail'

HDScene.ready(() => {
  //配置自定义组件
  HDScene.components({
    Player,
    Document,
    QuestionAnswer,
    Chat,
    Controls,
    Thumbnail
  })

  //创建UI组件
  let ui = new UserInterface()

  //获取登录参数
  let params = Utils.parseUrl(localStorage.address)
  Utils.log('params', params)

  //登录
  HDScene.login({
    userId: params.userid || Utils.admin.replay.userid,
    roomId: params.roomid || Utils.admin.replay.roomid,
    recordId: params.recordid || Utils.admin.replay.recordid,
    viewerName: params.viewername || Utils.admin.replay.viewername,
    viewerToken: params.viewertoken || Utils.admin.replay.viewertoken,
    isH5play: (typeof Utils.admin.replay.isH5play == 'boolean' ? Utils.admin.replay.isH5play : params.isH5play),
    fastMode: (typeof Utils.admin.replay.fastMode == 'boolean' ? Utils.admin.replay.fastMode : params.fastMode),
    success(result) {
      Utils.log('登录成功', result)
      // ui.alert({content: '登录成功'})
    },
    fail(error) {
      Utils.log('登录失败', error)
      ui.alert({type: 'danger', content: '登录失败', time: false})
      ui.modal({
        title: '登录失败',
        content: '点击确定返回登录界面。',
        confirmText: '确定',
        cancelText: false,
        complete: () => {
          location.href = Utils.PATH.INDEX
        }
      })
    }
  })
})

