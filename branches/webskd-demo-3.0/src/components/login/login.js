import Component from 'common/component'
import Utils from 'common/utils'
import Model from './model'
import node from './login.html'
import './login.scss'

class Login extends Component {

  constructor() {
    super()

    this._root = {}
    this._address = {}
    this._enterRoom = {}
    this._liveButton = {}
    this._replayButton = {}
    this._mobileLiveButton = {}
    this._mobileReplayButton = {}

    this.render('login', node, () => {
      this.init()
      this.bindEvents()
    })
  }

  init() {
    this._address = document.getElementById('address') || {}
    this._enterRoom = document.getElementById('enterRoom') || {}
    this._liveButton = document.getElementById('liveButton') || {}
    this._replayButton = document.getElementById('replayButton') || {}
    this._mobileLiveButton = document.getElementById('mobileLiveButton') || {}
    this._mobileReplayButton = document.getElementById('mobileReplayButton') || {}
  }

  bindEvents() {
    this.isEmptyNode(this._enterRoom) && (this._addEventListener(this._enterRoom, 'click', this.bindEnterRoomClick))
    this.isEmptyNode(this._liveButton) && (this._addEventListener(this._liveButton, 'click', this.bindLiveClick))
    this.isEmptyNode(this._replayButton) && (this._addEventListener(this._replayButton, 'click', this.bindReplayClick))
    this.isEmptyNode(this._mobileLiveButton) && (this._addEventListener(this._mobileLiveButton, 'click', this.bindMobileLiveClick))
    this.isEmptyNode(this._mobileReplayButton) && (this._addEventListener(this._mobileReplayButton, 'click', this.bindMobileReplayClick))
  }

  _addEventListener(target, type, listener, options = true) {
    target.addEventListener(type, listener.bind(this), options)
  }

  bindEnterRoomClick(e = {}) {
    Utils.log('bindEnterRoomClick', e)
    if (Utils.isMobile()) {
      //移动端
      if (Utils.isReaply(this._address.value)) {
        this.bindMobileReplayClick()
      } else {
        this.bindMobileLiveClick()
      }
    } else {
      //PC端
      if (Utils.isReaply(this._address.value)) {
        this.bindReplayClick()
      } else {
        this.bindLiveClick()
      }
    }
  }

  bindLiveClick(e = {}) {
    Utils.log('bindLiveClick', e)
    if (!this.setLocalStorage()) {
      alert('观看地址不能为空')
      return false
    }
    if (!this.checkoutAddress()) {
      alert('请输入正确的观看地址')
      return false
    }
    location.href = Utils.getURL().LIVE
  }

  bindReplayClick(e = {}) {
    Utils.log('bindReplayClick', e)
    if (!this.setLocalStorage()) {
      alert('观看地址不能为空')
      return false
    }
    if (!this.checkoutAddress()) {
      alert('请输入正确的观看地址')
      return false
    }
    location.href = Utils.getURL().REPLAY
  }

  bindMobileLiveClick(e = {}) {
    Utils.log('bindMobileLiveClick', e)
    if (!this.setLocalStorage()) {
      alert('观看地址不能为空')
      return false
    }
    if (!this.checkoutAddress()) {
      alert('请输入正确的观看地址')
      return false
    }
    location.href = Utils.getURL().MOBILELIVE
  }

  bindMobileReplayClick(e = {}) {
    Utils.log('bindMobileReplayClick', e)
    if (!this.setLocalStorage()) {
      alert('观看地址不能为空')
      return false
    }
    if (!this.checkoutAddress()) {
      alert('请输入正确的观看地址')
      return false
    }
    location.href = Utils.getURL().MOBILEREPLAY
  }

  setLocalStorage() {
    if (!this._address.value) {
      return false
    }
    var model = new Model()
    model.address = this._address.value
    if (!model.address) {
      return false
    }
    return true
  }

  checkoutAddress() {
    if (!Utils.isAddress(this._address.value)) {
      return false
    }
    return true
  }

}

export default Login






