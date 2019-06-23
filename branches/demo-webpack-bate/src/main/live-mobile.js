import 'common/liveHDScence' //直播核心对象
import './styles/live-mobile.scss' //移动端观看直播私有样式
import Utils from 'common/utils' //公共方法库
import fastClick from 'fastclick' //解决移动端点击延迟问题
import flexible from 'common/public/flexible'//引入rem布局配置文件
import UserInterface from 'common/userInterface'//UI库

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
  let ui = new UserInterface()
  let params = Utils.parseUrl(localStorage.address)
  HDScence.components([Player, Document, Controls, Navigation, Setting, Chat, PrivateMessage, QuestionAnswer, Intro])
  HDScence.login({
    userId: params.userid, //用户id
    roomId: params.roomid,//直播间id
    viewerName: params.viewername,//用户名称
    groupId: params.groupid,
    viewerToken: params.viewertoken,//密码
    fastMode: true,//是否为急速文档
    isH5play: true,// 是否是h5播放器,观看直播PC端使用flash，移动端使用h5播放器
    success(result) {
      Utils.log('登录成功', result)
    },
    fail(error) {
      Utils.log('登录失败', error)
      ui.modal({
        titile: '登录失败',
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




