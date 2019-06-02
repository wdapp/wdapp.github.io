import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import UI from './UIControl'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'
import Swiper from 'swiper'


class Controls extends Component {

  _ui = null

  constructor() {
    super()
    this.name = 'control'
    this.render('controls', template, () => {
      let controls = new Swiper('.swiper-container-controls', {
        direction: 'horizontal',
        loop: true,
        // autoplay: {
        //   delay: 5000,
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
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
      this.liveSdk = hdScience.getObjectForName(hdScience.LiveInterface)
      this.initUserInfo()
    })
    hdScience.addEvent(hdScience.OnUserCountMessage,()=>{

      this.ui.setUserCount( parseInt(LiveInfo.userCount));
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
    let btn_swtch = this.getNode('controls-switch')//切换视频为主文档为主按钮
    let btn_out = this.getNode('controls-quit')//获取退出按钮
    //事件监听
    this.bind(btn_out, 'click', (e) => {
      this.liveSdk.call(this.liveSdk.LOGOUT, {
        success: () => {
          Utils.log('退出成功')
          this.ui.logoutWindow()
        }, error: () => {
          Utils.log('退出失败')
        }
      })
    })
    this.bind(btn_swtch, 'click', (e) => {
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