import 'common/liveHDScene' //直播核心对象
import './styles/live.scss' //PC端直播私有样式
import Utils from 'common/utils' //公共方法库
import UserInterface from 'common/userInterface'//UI库

//自定义组件
import Player from 'components/live/player/player'
import Document from 'components/live/document/document'
import QuestionAnswer from 'components/live/questionAnswer/questionAnswer'
import Chat from 'components/live/chat/chat'
import Controls from 'components/live/controls/controls'

HDScene.ready(() => {
  let ui = new UserInterface()
  let params = Utils.parseUrl(localStorage.address)
  //配置自定义组件
  HDScene.components([Player, QuestionAnswer, Chat, Controls])
  HDScene.login({
    userId: params.userid || Utils.admin.live.userid, //用户id
    roomId: params.roomid || Utils.admin.live.roomid,//直播间id
    viewerName: params.viewername || Utils.admin.live.viewername,//用户名称
    viewerToken: params.viewertoken || Utils.admin.live.viewertoken,//密码
    fastMode: (typeof Utils.admin.live.fastMode == 'boolean' ? Utils.admin.live.fastMode : params.fastMode),//是否为急速文档
    groupId: params.groupid,//groupid
    isH5play: true,// 是否是h5播放器,观看直播PC端使用flash，移动端使用h5播放器
    success(result) {
      Utils.log('登录成功', result)
    },
    fail(error) {
      Utils.log('登录失败', error)
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







