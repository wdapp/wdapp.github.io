import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import UI from './UIControl'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'
import Swiper from 'swiper'


class Controls extends Component {

  _swtchTimer = 0
  _toggleSwitch = true

  constructor() {
    super()
    this.name = 'control'
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
    // this.initSlider()
    this.addInteractive()
    this.addEvents()
    this.addSDKEvent()
  }

  initSlider() {
    let controls = new Swiper('.swiper-container-controls', {
      direction: 'horizontal',
      loop: true,
      // autoplay: {
      //   delay: 5000,
      // },
      hiddenClass: 'swiper-button-prev',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    })
  }

  addSDKEvent() {

    // var userCount = this.liveSDK.on(this.liveSDK.ONUSERCOUNTMESSAGE)
    // userCount.then((j)=>{
    //   this.ui.setUserCount(j)
    // })
  }

  addEvents() {
    HDScene.addEvent(HDScene.OnLoginSuccess, () => {
      this.ui.barrageShow = (HDScene.getLive().isBarrage == 1)
      this.initUserInfo()
    })
    HDScene.onUserCount({
      callback: (d) => {
        this.ui.setUserCount(parseInt(d))
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
    let btn_swtch = this.getNode('controls-switch')//切换视频为主文档为主按钮
    let btn_out = this.getNode('controls-quit')//获取退出按钮
    let btn_line = this.getNodeByClass('line')//线路按钮
    let linesIndex = 0
    this.bind(btn_line, 'click', (e) => {
      HDScene.getLine()
      linesIndex = (linesIndex + 1) >= LiveInfo.lines.length ? 0 : (linesIndex + 1)
      HDScene.changeLine({'index': linesIndex})
      this.innerHTML(btn_line, `线路${linesIndex + 1}`)
      // lines =  this.ui.insertLines();

    })
    //事件监听
    this.bind(btn_out, 'click', (e) => {
      HDScene.logoutRoom({
        success: () => {
          Utils.log('退出成功')
          this.ui.logoutWindow()
        }, error: () => {
          Utils.log('退出失败')
        }
      })
    })
    this.bind(btn_swtch, 'click', (e) => {
      if (this._toggleSwitch) {
        this.ui.switchPanel()
        this._toggleSwitch = false
      }
      this._swtchTimer && clearTimeout(this._swtchTimer)
      this._swtchTimer = setTimeout(() => {
        this._toggleSwitch = true
      }, 500)
    })
  }

  initData(obj) {
    if (!obj) return
  }

}

export default Controls