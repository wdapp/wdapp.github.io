import Component from 'common/component'
import node from './controls.html'
import './controls.scss'
import UI from './UIControl'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'


class Controls extends Component {

  _ui = null

  constructor() {
    super()
    this.render('controls', node, () => {
    })
    this.init()
  }

  init() {
    this.addInteractive()
    this.addEvents()
    this.addSDKEvent()
  }

  addSDKEvent() {

    // var userCount = this.liveSDK.on(this.liveSDK.ONUSERCOUNTMESSAGE)
    // userCount.then((j)=>{
    //   this.ui.setUserCount(j)
    // })
  }

  addEvents() {
    hdScience.addEvent(hdScience.OnLoginSuccess, () => {
      this.initUserInfo()
    })

  }

  initUserInfo() {
    if (LiveInfo.loginInfo) {
      this.viewName = LiveInfo.getLoginInfoData('viewer', 'name')
    }
  }

  set viewName(v) {
    this.ui.setViewName(v)
  }

  //退出登录
  addInteractive() {
    let btn_swtch = this.getNodeByClass('controls-switch')//切换视频为主文档为主按钮
    let btn_out = this.getNodeByClass('controls-quit')//获取退出按钮
    //事件监听
    this.on(btn_out, 'click', (e) => {
      this.liveSDK.call(this.liveSDK.LOGOUT, {
        success: () => {
          Utils.log('退出成功')
          this.ui.logoutWindow()
        }, error: () => {
          Utils.log('退出失败')
        }
      })
    })
    this.on(btn_swtch, 'click', (e) => {
      this.ui.switchPanel()
    })

  }

  initData(obj) {
    if (!obj) return

  }

  get ui() {
    if (!this._ui) {
      this._ui = new UI()
    }
    return this._ui
  }

  set isMainVideo(v) {
    this.ui.isMainVideo(v)
  }

}

export default Controls