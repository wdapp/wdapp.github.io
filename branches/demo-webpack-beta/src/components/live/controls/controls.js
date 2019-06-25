import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import UI from './UIControl'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'


class Controls extends Component {

  constructor() {
    super()
    this.name = 'controls'
    this.render('controls', template, () => {
    })
    this.init()
  }

  _ui = null

  get ui() {
    if (!this._ui) {
      this._ui = new UI()
    }
    return this._ui
  }

  set viewName(v) {
    this.ui.setViewName(v)
  }

  set isMainVideo(v) {
    this.ui.isMainVideo(v)
  }

  init() {
    this.addShowBarActive()
    this.addInteractive()
    this.addEvents()
    this.addSDKEvent()
  }

  addShowBarActive() {
    this.leftBar = this.getNode('leftBar')
    this.rightBar = this.getNode('rightBar')
    this.bind(this.leftBar, 'click', () => {
      this.ui.bindLeftBar()
    })
    this.bind(this.rightBar, 'click', () => {
      this.ui.bindRightBar()
    })
  }

  addSDKEvent() {
  }

  addEvents() {
    HDScene.addEvent(HDScene.OnLoginSuccess, () => {
      this.initUserInfo()
    })
    HDScene.onUserCount({
      callback: (d) => {
        this.ui.setUserCount(parseInt(d))
      }
    })
    this.ui.switchPanel()
    HDScene.onFlashPlayerLoad({
      callback: () => {
        this.ui.switchPanel()
      }
    })
  }

  initUserInfo() {
    if (LiveInfo.loginInfo) {
      this.viewName = LiveInfo.getLoginInfoData('viewer', 'name')
    }
  }

  //退出登录
  addInteractive() {
    let btnSwitch = this.getNodeByClass('controls-switch')//切换视频为主文档为主按钮
    let btnLine = this.getNodeByClass('controls-line')//切换视频为主文档为主按钮
    let btnOut = this.getNodeByClass('controls-quit')//获取退出按钮

    //事件监听  //TODO 所有文字提示需要单独提取到一个文件中，方便国际化处理
    this.bind(btnOut, 'click', (e) => {
      this.ui.ui.modal({
        title: '退出',
        content: '您确定要退出吗？',
        cancelText: '取消',
        confirmText: '确定',
        confirm: () => {
          HDScene.logoutRoom({
            success: () => {
              Utils.log('退出成功')
              this.ui.logoutWindow()
            }, error: () => {
              Utils.log('退出失败')
            }
          })
        }
      })
    })
    this.bind(btnSwitch, 'click', (e) => {
      this.ui.switchPanel()
    })
    let lines = ''
    this.bind(btnLine, 'click', (e) => {
      HDScene.getLine()
      lines = this.ui.insertLines(LiveInfo.lines)
      // this.ui.insertLines()
      this.ui.ui.modal({
        title: '选择网络',
        content: lines,
        cancelText: '取消',
        confirmText: '确定',
        confirm: () => {
          let index = 0
          let dom = document.getElementsByClassName('line-radio')
          for (let i = 0; i < dom.length; i++) {
            if (dom[i].checked) {
              LiveInfo.lines[i].select = 1
              index = i

            } else {
              LiveInfo.lines[i].select = 0
            }
          }
          HDScene.changeLine({'index': index})
        }
      })
    })
  }

  initData(obj) {
    if (!obj) return

  }

}

export default Controls