import 'common/hd'//提供Web SDK 观看回放事件、方法、属性
import Utils from 'common/utils'//公共方法库
import UserInterface from 'common/userInterface'//UI库
import './styles/replay.scss'//PC端回放私有样式
//自定义组件
import Player from 'components/replay/player/player'
import Document from 'components/replay/document/document'
import QuestionAnswer from 'components/replay/questionAnswer/questionAnswer'
import Chat from 'components/replay/chat/chat'
import Controls from 'components/replay/controls/controls'
import Thumbnail from 'components/replay/thumbnail/thumbnail'
//显示log信息
window.debug = true

//配置自定义组件
hd.components({
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

//隐藏播放器控制器
hd.isShowControl(false)

//登录
hd.login({
  userId: params.userid || 'B27039502337407C',
  roomId: params.roomid || '3115C441D8B66A719C33DC5901307461',
  recordId: params.recordid || '96C0454B9E3CE464',
  // userId: params.userid || '920022FE264A70C1',
  // roomId: params.roomid || '8435F7E261F04EB69C33DC5901307461',
  // recordId: params.recordid || 'D606FBAFE0000829',
  viewerName: params.username || '关羽',
  viewerToken: params.viewertoken || '',
  isH5play: params.isH5play,
  fastMode: params.fastMode,
  // isH5play: false,
  // fastMode: false,
  success: function (result) {
    Utils.log('登录成功', result)
    //开启极速文档自适应模式
    hd.documentAdaptive(true)
    ui.alert({
      content: '登录成功'
    })
  },
  fail: function (error) {
    Utils.log('登录失败', error)
    ui.alert({
      type: 'danger',
      content: '登录失败'
    })
  }
})

