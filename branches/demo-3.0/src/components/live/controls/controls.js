import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import UI from './UIControl'
import LiveInfo from 'common/liveinfo'
import Utils from 'common/utils'


class Controls extends Component {

  _ui = null

  constructor() {
    super()
    this.name = 'controls'
    this.render('controls', template, () => {
    })
    this.init()
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
    HDScence.addEvent(HDScence.OnLoginSuccess, () => {
      this.liveSdk = HDScence.getObjectForName(HDScence.LiveInterface)
      this.initUserInfo()
    })
    HDScence.addEvent(HDScence.OnUserCountMessage, () => {

      this.ui.setUserCount(parseInt(LiveInfo.userCount))
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
    let btn_line = this.getNodeByClass('controls-line')//切换视频为主文档为主按钮
    let btn_out = this.getNodeByClass('controls-quit')//获取退出按钮
    let line = `
                <div class="line-wrap">
                  <p class="line-title">以下可以选择的网络途径：</p>
                  <div class="radio-wrapp">
                    <input class="line-radio" type="radio" checked name="line" id="line_1"><label class="line-label" for="line_1">线路1</label>
                  </div>
                  <div class="radio-wrapp">
                    <input class="line-radio" type="radio" name="line" id="line_2"><label class="line-label" for="line_2">线路2</label>
                  </div>
                </div>
                 `
    //事件监听
    this.bind(btn_out, 'click', (e) => {
      this.ui.ui.modal({
        titile: '退出',
        content: '您确定要退出吗？',
        cancelText: '取消',
        confirmText: '确定',
        cancel: () => {

        },
        confirm: () => {
          this.liveSdk.call(this.liveSdk.LOGOUT, {
            success: () => {
              Utils.log('退出成功')
              this.ui.logoutWindow()
            }, error: () => {
              Utils.log('退出失败')
            }
          })
        },
        complete: () => {

        }
      })
    })
    this.bind(btn_swtch, 'click', (e) => {
        this.ui.switchPanel()
    })
    this.bind(btn_line, 'click', (e) => {
      this.ui.ui.modal({
        titile: '选择网络',
        content: line,
        cancelText: '取消',
        confirmText: '确定',
        cancel: () => {

        },
        confirm: () => {
          let lineRadio = document.getElementsByClassName('line-radio')
          Utils.log('获取线路', lineRadio)
          Utils.log('获取线路', this.getNode('line_1').checked)
          Utils.log('获取线路', this.getNode('line_2').checked)
        },
        complete: () => {

        }
      })
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