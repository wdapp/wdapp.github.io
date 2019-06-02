import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import LoadBar from './loadBar'
import Utils from 'common/utils'
import Slider from 'bootstrap-slider'
import UserInterface from 'common/userInterface'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'

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
  isShowLeft = true
  isShowRight = true
  isMute = false
  volume = 0
  isFullScreen = false

  constructor() {
    super()
    this.render('controls', template, () => {
      this.init()
    })
  }

  init() {
    this.ui = new UserInterface()
    this.leftBar = this.getNode('leftBar')
    this.rightBar = this.getNode('rightBar')
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
    this.switchBtnWrap = this.getNode('switchBtnWrap')
    this.playRateWrap = this.getNode('playRateWrap')
    this.playRateList = this.getNode('playRateList')
    this.playRateBtn = this.getNode('playRateBtn')
    this.fullScreenButtonWrap = this.getNode('fullScreenButtonWrap')
    this.fullScreenButton = this.fullScreenButtonWrap.getElementsByClassName('full-screen-btn')[0]
    this.playRateNumber = [...document.getElementsByClassName('play-rate-number')]

    this.onEvents()

    this.initSlider()

    this.handleClick()
  }

  onEvents() {
    hd.onPlayerLoad(() => {
      this.isPlayerLoad = true
      this.updateVolume()
      this.setDurationTime()
      this.updateCurrentTime()
      hd.emit('initLoadBar', this.durationTime)
      hd.emit('isPlayerLoad', this.isPlayerLoad)
      Utils.log('onPlayerLoad', this.isPlayerLoad)
    })
    hd.onPlayerStart(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerStart', this.playState)
    })
    hd.onPlayerPause(() => {
      this.playState = false
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerPause', this.playState)
    })
    hd.onPlayerResume(() => {
      this.playState = true
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerResume', this.playState)
    })
    hd.onPlayerEnd(() => {
      this.playState = false
      this.updateCurrentTime()
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerEnd', this.playState)
    })
    hd.on('barrage', (barrage) => {
      Utils.log('barrage', barrage)
      this.bulletsScreen.style.display = barrage == 1 ? 'blcok' : 'none'
    })
  }

  initSlider() {
    this.playerSlider = new Slider('#playerSlider', {
      precision: 2,
      formatter: () => {
        return this.formatCurrentTime
      }
    })
    this.initTooltip()
    hd.once('initLoadBar', (durationTime) => {
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

    this.voiceSlider = new Slider('#voiceSlider', {})
    this.voiceSlider.on('slideStop', (value) => {
      this.setVolume(value)
    })
  }

  handleClick() {
    this.bind(this.leftBar, 'click', this.bindLeftBar.bind(this))
    this.bind(this.rightBar, 'click', this.bindRightBar.bind(this))
    this.bind(this.playButton, 'click', this.bindPlay.bind(this))
    this.bind(this.voiceButton, 'click', this.toggleMute.bind(this))
    this.bind(this.quitButton, 'click', this.bindQuit.bind(this))
    this.bind(this.switchBtnWrap, 'click', this.bindSwitchBtnWrap.bind(this))
    this.bind(this.playRateWrap, 'click', this.bindPlayRateWrap.bind(this))
    this.bind(this.playRateList, 'click', this.bindPlayRateList.bind(this))
    this.bind(this.thumbnailListButton, 'click', this.toggleThumbnailList.bind(this))
    this.bind(this.fullScreenButtonWrap, 'click', this.bindFullScreen.bind(this))
  }

  initTooltip() {
    let sliderTooltip = document.getElementById('sliderTooltip')
    let toolTipWidth = 0
    let sliderTooltipInner = sliderTooltip.getElementsByClassName('slider-tooltip-inner')[0]
    let playerSliderWrap = document.getElementById('playerSliderWrap')
    let playerSlider = document.getElementById('sliderPlayer')
    let centerOffsetLeft = document.getElementById('center').offsetLeft + 10
    let playerSliderWidth = playerSlider.clientWidth
    let clientX = 0
    let left = 0
    let seconds = 0
    let percent = 0
    playerSlider.onmousemove = (e) => {
      clientX = e.clientX
      left = clientX - centerOffsetLeft
      if (left < -10) {
        left = 0
      }
      toolTipWidth = sliderTooltip.clientWidth
      sliderTooltip.style.left = left + 10 - (toolTipWidth / 2) + 'px'
      percent = (left / playerSliderWidth)
      if (percent > 1) {
        percent = 1
      }
      if (percent < 0) {
        percent = 0
      }
      seconds = percent * this.durationTime
      sliderTooltipInner.innerText = Utils.formatSeconds(seconds)
    }
    playerSliderWrap.onmouseenter = (e) => {
      sliderTooltip.style.opacity = '1'
    }
    playerSliderWrap.onmouseleave = () => {
      sliderTooltip.style.opacity = '0'
    }
  }

  bindFullScreen() {
    if (this.isFullScreen) {
      this.ui.showLeft()
      this.ui.showRight(() => {
        this.initTooltip()
      })
      this.isShowLeft = true
      this.isShowRight = true
      this.removeClass(this.fullScreenButton, 'active')
    } else {
      this.ui.hideLeft()
      this.ui.hideRight(() => {
        this.initTooltip()
      })
      this.isShowRight = false
      this.isShowLeft = false
      this.addClass(this.fullScreenButton, 'active')
    }
    this.isFullScreen = !this.isFullScreen
  }

  updateFullScreenState() {
    if (this.isShowLeft == this.isShowRight) {
      this.isFullScreen = !this.isShowLeft
    }
  }

  bindLeftBar() {
    if (this.isShowLeft) {
      this.ui.hideLeft(() => {
        this.initTooltip()
        Utils.log('hideLeft')
      })
    } else {
      this.ui.showLeft(() => {
        this.initTooltip()
        Utils.log('showLeft')
      })
    }
    this.isShowLeft = !this.isShowLeft
    this.updateFullScreenState()
  }

  bindRightBar() {
    if (this.isShowRight) {
      this.ui.hideRight(() => {
        this.initTooltip()
        Utils.log('hideRight')
      })
    } else {
      this.ui.showRight(() => {
        this.initTooltip()
        Utils.log('showRight')
      })
    }
    this.isShowRight = !this.isShowRight
    this.updateFullScreenState()
  }

  bindSwitchBtnWrap() {
    if (!this.checkout('bindSwitchBtnWrap')) {
      return false
    }
    let player = this.getNode('player')
    let document = this.getNode('document')
    let video = player.firstElementChild
    let iframe = document.firstElementChild
    player.appendChild(iframe)
    document.appendChild(video)

    // let playbackPlayer = this.getNode('playbackPlayer')
    // let drawPanel = this.getNode('draw_panel')
    // let video = playbackPlayer.firstElementChild
    // let iframe = drawPanel.firstElementChild
    // playbackPlayer.appendChild(iframe)
    // drawPanel.appendChild(video)
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
    hd.rate = rate
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
    } else {
      this.stopTimer()
      this.removeClass(this.playButtonIcon, 'pause')
    }
  }

  toggleThumbnailList() {
    if (this.isShowThumbnailList) {
      this.thumbnailWrapper.style.display = 'none'
      this.removeClass(this.thumbnailListButton.getElementsByTagName('span')[0], 'active')
    } else {
      this.addClass(this.thumbnailListButton.getElementsByTagName('span')[0], 'active')
      this.thumbnailWrapper.style.display = 'block'
      hd.emit('showThumbnailList')
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
        hd.logout()
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
    hd.togglePlay()
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
    this.durationTime = hd.durationTime
    this.playTimeDuration.innerText = Utils.formatSeconds(this.durationTime)
    this.setPlayerSliderMax()
  }

  updateCurrentTime() {
    this.currentTime = Math.ceil(hd.currentTime)
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
    this.volume = hd.volume
    this.voiceSlider.setValue(this.volume)
    this.updateMute(this.volume)
    Utils.log('updateVolume volume', this.volume)
  }

  setVolume(volume) {
    if (!this.checkout('setVolume')) {
      return false
    }
    hd.volume = volume
    this.volume = hd.volume
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
      hd.volume = this.volume
    } else {
      hd.volume = 0
    }
    this.updateMute(hd.volume)
    this.voiceSlider.setValue(hd.volume)
    Utils.log('toggleMute volume', hd.volume)
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
    this.delaySeek && clearTimeout(this.delaySeek)
    this.delaySeek = setTimeout(() => {
      this.stopTimer()
      hd.seek(value)
    }, 500)
    return true
  }

  updatePlayerSliderValue() {
    this.playerSlider.setValue(this.currentTime)
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