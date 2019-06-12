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
    HDScence.onPlayerLoad(() => {
      this.isPlayerLoad = true
      this.updateVolume()
      this.setDurationTime()
      this.updateCurrentTime()
      HDScence.emit('initLoadBar', this.durationTime)
      HDScence.emit('isPlayerLoad', this.isPlayerLoad)
      Utils.log('onPlayerLoad', this.isPlayerLoad)
    })
    HDScence.onPlayerStart(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerStart', this.playState)
    })
    HDScence.onPlayerPause(() => {
      this.playState = false
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerPause', this.playState)
    })
    HDScence.onPlayerResume(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerResume', this.playState)
    })
    HDScence.onPlayerEnd(() => {
      this.playState = false
      this.updateCurrentTime()
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerEnd', this.playState)
    })
    HDScence.onBarrageInfo((data) => {
      Utils.log('barrage', data)
      this.bulletsScreen.style.display = data.isBarrage == 1 ? 'blcok' : 'none'
    })
  }

  initSlider() {
    this.playerSlider = new Slider('#playerSlider', {})
    HDScence.once('initLoadBar', (durationTime) => {
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
    let switchBtnWrap = this.getNode('switchBtnWrap')
    let fullScreenButtonWrap = this.getNode('fullScreenButtonWrap')

    this.bind(leftBar, 'click', this.bindLeftBar.bind(this))
    this.bind(rightBar, 'click', this.bindRightBar.bind(this))
    this.bind(fullScreenButtonWrap, 'click', this.bindFullScreen.bind(this))
    this.bind(switchBtnWrap, 'click', this.bindSwitchBtnWrap.bind(this))

    this.bind(this.playButton, 'click', this.bindPlay.bind(this))
    this.bind(this.voiceButton, 'click', this.toggleMute.bind(this))
    this.bind(this.quitButton, 'click', this.bindQuit.bind(this))
    this.bind(this.playRateWrap, 'click', this.bindPlayRateWrap.bind(this))
    this.bind(this.playRateList, 'click', this.bindPlayRateList.bind(this))
    this.bind(this.thumbnailListButton, 'click', this.toggleThumbnailList.bind(this))
  }

  bindFullScreen() {
    this.fullScreen.toggleFullScreen((isFullScreen) => {
      this.loadBar.initTooltip()
      if (isFullScreen) {
        this.quitButton.style.display = 'none'
      }
    })
  }

  bindLeftBar() {
    this.fullScreen.toggleLeftBar(() => {
      this.loadBar.initTooltip()
    })
  }

  bindRightBar() {
    this.fullScreen.toggleRightBar(() => {
      this.loadBar.initTooltip()
    })
  }

  bindSwitchBtnWrap() {
    if (!this.isSwitch || !this.checkout('bindSwitchBtnWrap')) {
      return false
    }
    this.isSwitch = false
    let player = this.getNode('player')
    let drawPanel = this.getNode('document')
    let playerChildren = player.firstElementChild
    let drawPanelChildren = drawPanel.firstElementChild
    this.ui.fadeOut({
      node: [playerChildren, drawPanelChildren],
      complete: () => {
        player.appendChild(drawPanelChildren)
        drawPanel.appendChild(playerChildren)
        this.ui.fadeIn({
          node: [playerChildren, drawPanelChildren],
          complete: () => {
            this.isSwitch = true
          }
        })
      }
    })
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
    HDScence.rate = rate
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
      HDScence.emit('showThumbnailList')
    }
    this.isShowThumbnailList = !this.isShowThumbnailList
  }

  bindQuit() {
    this.ui.modal({
      titile: '退出',
      content: '您确定要退出吗？',
      cancelText: '取消',
      confirmText: '确定',
      cancel: () => {

      },
      confirm: () => {
        HDScence.logout()
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
    HDScence.togglePlay()
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
    this.durationTime = HDScence.durationTime
    this.playTimeDuration.innerText = Utils.formatSeconds(this.durationTime)
    this.setPlayerSliderMax()
  }

  updateCurrentTime() {
    this.currentTime = Math.ceil(HDScence.currentTime)
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
    this.volume = HDScence.volume
    this.voiceSlider.setValue(this.volume)
    this.updateMute(this.volume)
    Utils.log('updateVolume volume', this.volume)
  }

  setVolume(volume) {
    if (!this.checkout('setVolume')) {
      return false
    }
    HDScence.volume = volume
    this.volume = HDScence.volume
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
      HDScence.volume = this.volume
    } else {
      HDScence.volume = 0
    }
    this.updateMute(HDScence.volume)
    this.voiceSlider.setValue(HDScence.volume)
    Utils.log('toggleMute volume', HDScence.volume)
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
      HDScence.seek(value)
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