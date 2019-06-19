import 'common/liveHDScence' //直播核心对象
import './styles/live.scss' //PC端直播私有样式
import Utils from 'common/utils' //公共方法库
//自定义组件
import Player from 'components/live/player/player'
import Document from 'components/live/document/document'
import QuestionAnswer from 'components/live/questionAnswer/questionAnswer'
import Chat from 'components/live/chat/chat'
import Controls from 'components/live/controls/controls'

HDScence.ready(() => {
  let params = Utils.parseUrl(localStorage.address)
  // HDScence.register({
  //   modules: [Player, Document, QuestionAnswer, Chat, Controls],
  //   config: params
  // })
  //配置自定义组件
  HDScence.components([Player, Document, QuestionAnswer, Chat, Controls])
  HDScence.login({
    userId: params.userid, //用户id
    roomId: params.roomid,//直播间id
    viewerName: params.viewername,//用户名称
    groupId: params.groupid,
    viewerToken: params.viewertoken,//密码
    isH5play: true,// 是否是h5播放
    fastMode: true,//是否为急速文档
    success(result) {
      Utils.log('登录成功', result)
      console.log('登录成功绅士手')
    },
    fail(error) {
      Utils.log('登录失败', error)
    }
  })
  // HDScence.onQAQuestion(z)
  // HDScence.addAllCallback();
})







