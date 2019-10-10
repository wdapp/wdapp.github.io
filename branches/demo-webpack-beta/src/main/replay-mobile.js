import 'common/replayHDScene'//提供Web SDK 观看回放事件、方法、属性
import './styles/replay-mobile.scss'//移动端回放私有样式
import Utils from 'common/utils'//公共方法库
import fastClick from 'fastclick'//解决移动端点击延迟问题
import flexible from 'common/public/flexible'//引入rem布局配置文件
import UserInterface from 'common/userInterface'//UI库

//自定义组件
import Player from 'components/replayMobile/player/player'
import Document from 'components/replayMobile/document/document'
import Navigation from 'components/replayMobile/navigation/navigation'
import Chat from 'components/replayMobile/chat/chat'
import QuestionAnswer from 'components/replayMobile/questionAnswer/questionAnswer'
import Intro from 'components/replayMobile/intro/intro'

HDScene.ready(() => {
  //配置rem布局
  flexible.init(750, 750)
  //解决移动端click点击300ms延迟问题
  fastClick.attach(document.body)

  //配置自定义组件
  HDScene.components({
    Player,
    Document,
    Navigation,
    Chat,
    QuestionAnswer,
    Intro
  })

  //创建UI组件
  let ui = new UserInterface()

  //获取登录参数
  let params = Utils.parseUrl(localStorage.address)
  Utils.log('params', params)

  //登录
  HDScene.login({
    userId: params.userid || Utils.admin.replayMobile.userid,
    roomId: params.roomid || Utils.admin.replayMobile.roomid,
    recordId: params.recordid || Utils.admin.replayMobile.recordid,
    viewerName: params.viewername || Utils.admin.replayMobile.viewername,
    viewerToken: params.viewertoken || Utils.admin.replayMobile.viewertoken,
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







