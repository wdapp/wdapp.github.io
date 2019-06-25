import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import LoadBar from './loadbar'
import Utils from 'common/utils'
import Slider from 'bootstrap-slider'
import UserInterface from 'common/userInterface'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import FullScreen from './fullscreen'

class Controls extends Component {

  timer = 0
  interval = 999
  delaySeek = 0
  isPlayerLoad = false
  playState = false
  durationTime = 0
  currentTime = 0
  formatCurrentTime = 0
  isShowThumbnailList = false
  isShowRate = false
  isMute = false
  volume = 0
  isPlayerSliderAutoChange = true
  isVideoMain = true
  isH5play = false
  isFullScreen = false
  isSwitch = true

  constructor() {
    super()
    this.render('controls', template, () => {
      this.init()
    })
  }

  init() {

    this.ui = new UserInterface()
    this.fullScreen = new FullScreen()
    this.playButton = this.getNode('playButton')
    this.bulletsScreen = this.getNode('bulletsScreen')
    this.playButtonIcon = this.getNode('playButtonIcon')
    this.playTimeDuration = this.getNode('playTimeDuration')
    this.palyTimeCurrent = this.getNode('palyTimeCurrent')
    this.palyTimeCurrent = this.getNode('palyTimeCurrent')
    this.voiceButton = this.getNode('voiceButton')
    this.quitButton = this.getNode('quitButton')
    this.switchBtnWrap = this.getNode('switchBtnWrap')
    this.thumbnailListButton = this.getNode('thumbnailListButton')
    this.thumbnailWrapper = this.getNode('thumbnailWrapper')
    this.playRateWrap = this.getNode('playRateWrap')
    this.playRateList = this.getNode('playRateList')
    this.playRateBtn = this.getNode('playRateBtn')
    this.playRateNumber = [...document.getElementsByClassName('play-rate-number')]

    this.onEvents()

    this.initSlider()

    this.handleClick()
  }

  onEvents() {
    HDScene.onDocumentMode((data) => {
      if (!data.fastMode && this.fullScreen.isSupportFullscreen) {
        this.isSwitch = false
      }
    })
    HDScene.onPlayerMode((data) => {
      this.isH5play = data.isH5play
      this.autoPlay(this.isH5play)
      if (!this.isH5play && this.fullScreen.isSupportFullscreen) {
        this.isSwitch = false
      }
      if (!this.isH5play) {
        this.playRateWrap.parentNode.style.display = 'none'
      }
    })
    HDScene.onPlayerLoad(() => {
      this.isPlayerLoad = true
      this.updateVolume()
      this.setDurationTime()
      this.updateCurrentTime()
      HDScene.emit('initLoadBar', this.durationTime)
      HDScene.emit('isPlayerLoad', this.isPlayerLoad)
      Utils.log('onPlayerLoad', this.isPlayerLoad)
      this.autoPlay(this.isH5play)
    })
    HDScene.onPlayerStart(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerStart', this.playState)
    })
    HDScene.onPlayerPause(() => {
      this.playState = false
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerPause', this.playState)
    })
    HDScene.onPlayerResume(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerResume', this.playState)
    })
    HDScene.onPlayerEnd(() => {
      this.playState = false
      this.updateCurrentTime()
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerEnd', this.playState)
    })
    HDScene.onBarrageInfo((data) => {
      Utils.log('barrage', data)
      this.bulletsScreen.style.display = data.isBarrage == 1 ? 'blcok' : 'none'
    })
  }

  initSlider() {
    this.playerSlider = new Slider('#playerSlider', {})
    HDScene.once('initLoadBar', (durationTime) => {
      this.loadBar = new LoadBar({
        element: 'playerSliderWrap',
        durationTime: durationTime
      })
    })
    this.playerSlider.on('slideStop', (value) => {
      this.onSeek(value)
    })
    this.playerSlider.on('change', (value) => {
      if (value.newValue == 0) {
        this.loadBar && this.loadBar.loadBarRegress()
      } else {
        this.loadBar && this.loadBar.loadBarGrayToOrange()
      }
    })
    let playerSliderWrap = document.getElementById('playerSliderWrap')
    playerSliderWrap.onclick = (event) => {
      if (event.target.id == 'playerSliderWrap') {
        this.onSeek(0)
      }
    }

    this.voiceSlider = new Slider('#voiceSlider', {})
    this.voiceSlider.on('slideStop', (value) => {
      this.setVolume(value)
    })
  }

  handleClick() {
    let leftBar = this.getNode('leftBar')
    let rightBar = this.getNode('rightBar')
    let fullScreenButtonWrap = this.getNode('fullScreenButtonWrap')

    this.bind(leftBar, 'click', this.bindLeftBar.bind(this))
    this.bind(rightBar, 'click', this.bindRightBar.bind(this))
    this.bind(fullScreenButtonWrap, 'click', this.bindFullScreen.bind(this))

    this.bind(this.switchBtnWrap, 'click', this.bindSwitchBtnWrap.bind(this))
    this.bind(this.playButton, 'click', this.bindPlay.bind(this))
    this.bind(this.voiceButton, 'click', this.toggleMute.bind(this))
    this.bind(this.quitButton, 'click', this.bindQuit.bind(this))
    this.bind(this.playRateWrap, 'click', this.bindPlayRateWrap.bind(this))
    this.bind(this.playRateList, 'click', this.bindPlayRateList.bind(this))
    this.bind(this.thumbnailListButton, 'click', this.toggleThumbnailList.bind(this))
  }

  autoPlay(isH5play) {
    if (!isH5play) {
      this.bindSwitchBtnWrap()
    }
  }

  bindFullScreen() {
    this.fullScreen.toggleFullScreen({
      fullScreenStateChange: (data) => {
        this.isFullScreen = data.isFullScreen
        this.fullScreenChangeCallback(data)
      }
    })
  }

  fullScreenChangeCallback(data) {
    if (typeof data.isFullScreen == 'undefined') {
      return false
    }
    this.loadBar && this.loadBar.initTooltip && this.loadBar.initTooltip()
    if (data.isFullScreen) {
      this.quitButton.style.display = 'none'
      !this.isSwitch && (this.switchBtnWrap.parentNode.style.display = 'none')
    } else {
      this.quitButton.style.display = 'block'
      !this.isSwitch && (this.switchBtnWrap.parentNode.style.display = 'block')
    }
  }

  bindLeftBar() {
    this.fullScreen.toggleLeftBar({
      barStateChange: (data) => {
        this.loadBar && this.loadBar.initTooltip && this.loadBar.initTooltip()
      },
      fullScreenStateChange: (data) => {
        this.fullScreenChangeCallback(data)
      }
    })
  }

  bindRightBar() {
    this.fullScreen.toggleRightBar({
      barStateChange: (data) => {
        this.loadBar && this.loadBar.initTooltip && this.loadBar.initTooltip()
      },
      fullScreenStateChange: (data) => {
        this.fullScreenChangeCallback(data)
      }
    })
  }

  bindSwitchBtnWrap() {
    if (this.isFullScreen && this.fullScreen.isSupportFullscreen) {
      this.switchNode()
    } else {
      this.switchClass()
    }
  }

  switchNode() {
    let player = this.getNode('player')
    let drawPanel = this.getNode('document')
    let playerChildren = player.firstElementChild
    let drawPanelChildren = drawPanel.firstElementChild
    player.appendChild(drawPanelChildren)
    drawPanel.appendChild(playerChildren)
  }

  switchClass() {
    let left = document.querySelector('.left')
    let center = document.querySelector('.center')
    let leftBar = document.getElementById('leftBar')
    let rightBar = document.getElementById('rightBar')
    let questionWrapper = document.querySelector('.question-wrapper')
    let controlsWrapper = document.querySelector('.controls-wrapper')
    let thumbnailWrapper = document.querySelector('.thumbnail-wrapper')
    let leftId = left.id
    let centerId = center.id
    let leftClassName = left.className
    let centerClassName = center.className
    let leftStyle = left.getAttribute('style') || ''
    let centerStyle = center.getAttribute('style') || ''

    left.id = centerId
    center.id = leftId
    left.className = centerClassName
    center.className = leftClassName
    left.setAttribute('style', centerStyle)
    center.setAttribute('style', leftStyle)

    center.appendChild(questionWrapper)
    left.insertBefore(leftBar, left.childNodes[0])
    left.appendChild(thumbnailWrapper)
    left.appendChild(controlsWrapper)
    left.appendChild(rightBar)

    this.isVideoMain = !this.isVideoMain

    HDScene.emit('switch', this.isVideoMain)
  }

  bindPlayRateList(e) {
    if (!this.checkout('bindPlayRateList')) {
      return false
    }
    this.playRateNumber.forEach((element) => {
      this.removeClass(element, 'active')
    })
    let option = e.target
    this.addClass(option, 'active')
    let rateLabel = option.innerHTML
    let rate = rateLabel.substring(0, rateLabel.length - 1)
    HDScene.rate = rate
    Utils.log('rate', rate)
    this.playRateBtn.innerHTML = rateLabel
    this.interval = Math.floor(999 / rate)
    Utils.log('interval', this.interval)
    this.startTimer()
  }

  bindPlayRateWrap() {
    if (this.isShowRate) {
      this.playRateList.style.display = 'none'
      this.removeClass(this.playRateWrap, 'select')
    } else {
      this.playRateList.style.display = 'block'
      this.addClass(this.playRateWrap, 'select')
    }
    this.isShowRate = !this.isShowRate
  }

  onPlayStateChange(playState) {
    let _playState = playState
    if (_playState) {
      this.startTimer()
      this.addClass(this.playButtonIcon, 'pause')
      this.playButtonIcon.title = '暂停'
    } else {
      this.stopTimer()
      this.removeClass(this.playButtonIcon, 'pause')
      this.playButtonIcon.title = '播放'
    }
  }

  toggleThumbnailList() {
    if (this.isShowThumbnailList) {
      this.thumbnailWrapper.style.display = 'none'
      this.removeClass(this.thumbnailListButton.getElementsByTagName('span')[0], 'active')
    } else {
      this.addClass(this.thumbnailListButton.getElementsByTagName('span')[0], 'active')
      this.thumbnailWrapper.style.display = 'block'
      HDScene.emit('showThumbnailList')
    }
    this.isShowThumbnailList = !this.isShowThumbnailList
  }

  bindQuit() {
    this.ui.modal({
      title: '退出',
      content: '您确定要退出吗？',
      cancelText: '取消',
      confirmText: '确定',
      cancel: () => {

      },
      confirm: () => {
        HDScene.logout()
        location.href = Utils.PATH.INDEX
      },
      complete: () => {

      }
    })
  }

  bindPlay() {
    if (!this.checkout('bindPlay')) {
      return false
    }
    HDScene.togglePlay()
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  startTimer() {
    this.timer && this.stopTimer()
    this.timer = setInterval(this.bindTimerUpdate.bind(this), this.interval)
  }

  bindTimerUpdate() {
    this.updateCurrentTime()
  }

  setDurationTime() {
    this.durationTime = HDScene.durationTime
    this.playTimeDuration.innerText = Utils.formatSeconds(this.durationTime)
    this.setPlayerSliderMax()
  }

  updateCurrentTime() {
    this.currentTime = Math.ceil(HDScene.currentTime)
    if (this.currentTime > this.durationTime) {
      this.currentTime = this.durationTime
    }
    this.formatCurrentTime = Utils.formatSeconds(this.currentTime)
    this.palyTimeCurrent.innerText = this.formatCurrentTime
    this.updatePlayerSliderValue()
    if (this.currentTime > 0) {
      this.loadBar && this.loadBar.loadBarGrayToOrange()
    } else {
      this.loadBar && this.loadBar.loadBarRegress()
    }
  }

  updateVolume() {
    this.volume = HDScene.volume
    this.voiceSlider.setValue(this.volume)
    this.updateMute(this.volume)
    Utils.log('updateVolume volume', this.volume)
  }

  setVolume(volume) {
    if (!this.checkout('setVolume')) {
      return false
    }
    HDScene.volume = volume
    this.volume = HDScene.volume
    this.updateMute(this.volume)
    Utils.log('setVolume volume', this.volume)
  }

  toggleMute() {
    if (!this.checkout('toggleMute')) {
      return false
    }
    if (this.isMute) {
      if (!this.volume) {
        this.volume = 1
      }
      HDScene.volume = this.volume
    } else {
      HDScene.volume = 0
    }
    this.updateMute(HDScene.volume)
    this.voiceSlider.setValue(HDScene.volume)
    Utils.log('toggleMute volume', HDScene.volume)
  }

  updateMute(volume) {
    if (volume == 0) {
      this.addClass(this.voiceButton, 'mute')
      this.isMute = true
      Utils.log('updateMute', this.isMute)
    } else {
      this.isMute = false
      this.removeClass(this.voiceButton, 'mute')
      Utils.log('updateMute', this.isMute)
    }
  }

  setPlayerSliderMax() {
    this.playerSlider.setAttribute('max', this.durationTime)
  }

  onSeek(value) {
    if (!this.checkout('onSeek')) {
      return false
    }
    this.isPlayerSliderAutoChange = false
    this.delaySeek && clearTimeout(this.delaySeek)
    this.delaySeek = setTimeout(() => {
      this.stopTimer()
      HDScene.seek(value)
      if (Utils.IEVersion() != -1) {
        this.updateCurrentTime()
      }
      this.isPlayerSliderAutoChange = true
    }, 500)
    return true
  }

  updatePlayerSliderValue() {
    if (!this.isPlayerSliderAutoChange) {
      return false
    }
    this.playerSlider.setValue(this.currentTime)
    return true
  }

  checkout(message) {
    if (!this.isPlayerLoad) {
      Utils.log(`${message} fail await player load!`)
      return false
    }
    return true
  }
}

export default Controls