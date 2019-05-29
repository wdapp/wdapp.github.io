import 'common/hd'//提供Web SDK 观看回放事件、方法、属性
import Utils from 'common/utils'//公共方法库
import flexible from '@wdapp/flexible'//引入rem布局配置文件
import fastClick from 'fastclick'//解决移动端点击延迟问题
import UserInterface from 'common/userInterface'//UI库
import './styles/replay-mobile.scss'//移动端回放私有样式

//自定义组件
import Player from 'components/replayMobile/player/player'
import Document from 'components/replayMobile/document/document'
import Navigation from 'components/replayMobile/navigation/navigation'
import Chat from 'components/replayMobile/chat/chat'
import QuestionAnswer from 'components/replayMobile/questionAnswer/questionAnswer'
import Intro from 'components/replayMobile/intro/intro'

window.debug = true

fastClick.attach(document.body)

flexible.init(750, 750)

//配置自定义组件
hd.components({
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
hd.login({
  userId: params.userid || 'B27039502337407C',
  roomId: params.roomid || '3115C441D8B66A719C33DC5901307461',
  recordId: params.recordid || '96C0454B9E3CE464',
  // roomId: params.roomid || '4E817009A54A9DC49C33DC5901307461',
  // recordId: params.recordid || '1EDC2FF131B30BC9',
  // userId: params.userid || '920022FE264A70C1',
  // roomId: params.roomid || '8435F7E261F04EB69C33DC5901307461',
  // recordId: params.recordid || 'D606FBAFE0000829',
  viewerName: params.username || '移动的关羽',
  viewerToken: params.viewertoken || '',
  isH5play: params.isH5play,
  fastMode: params.fastMode,
  success (result) {
    Utils.log('登录成功', result)
    hd.documentAdaptive(true)
    hd.emit('roomDesc', result.room.desc)
    ui.alert({
      content: '登录成功'
    })
  },
  fail (error) {
    Utils.log('登录失败', error)
    ui.alert({
      type: 'danger',
      content: '登录失败'
    })
  }
})






