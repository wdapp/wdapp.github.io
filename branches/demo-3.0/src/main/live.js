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
  HDScence.register({
    modules: [Player, Document, QuestionAnswer, Chat, Controls],
    config: params
  })
})







