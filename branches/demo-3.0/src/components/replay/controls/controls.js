import Component from 'common/component'
import template from './controls.html'
import './controls.scss'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import Slider from 'bootstrap-slider'
import Utils from 'common/utils'
import UserInterface from 'common/userInterface'

class Controls extends Component {

  timer = 0
  delaySeek = 0
  isPlayerLoad = false
  playState = false
  durationTime = 0
  currentTime = 0
  formatCurrentTime = 0
  isShowThumbnailList = false
  isShowRate = false

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
    this.playRateNumber = [...document.getElementsByClassName('play-rate-number')]

    this.bind(this.leftBar, 'click', this.bindLeftBar.bind(this))
    this.bind(this.rightBar, 'click', this.bindRightBar.bind(this))
    this.bind(this.playButton, 'click', this.bindPlay.bind(this))
    this.bind(this.quitButton, 'click', this.bindQuit.bind(this))
    this.bind(this.switchBtnWrap, 'click', this.bindSwitchBtnWrap.bind(this))
    this.bind(this.playRateWrap, 'click', this.bindPlayRateWrap.bind(this))
    this.bind(this.playRateList, 'click', this.bindPlayRateList.bind(this))
    this.bind(this.thumbnailListButton, 'click', this.toggleThumbnailList.bind(this))

    this.initHD()

    this.initSlider()
  }

  initHD() {
    hd.onPlayerLoad(() => {
      this.isPlayerLoad = true
      this.updateVolume()
      this.setDurationTime()
      Utils.log('onPlayerLoad', this.isPlayerLoad)
      this.updateCurrentTime()
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
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerEnd', this.playState)
      this.updateCurrentTime()
    })
  }

  initSlider() {
    this.playerSlider = new Slider('#playerSlider', {
      precision: 2,
      formatter: (value) => {
        return this.formatCurrentTime
      }
    })
    this.playerSlider.on('slideStop', (value) => {
      this.onSeek(value)
    })
    this.buffer = this.addBuffer()
    this.voiceSlider = new Slider('#voiceSlider', {})
    this.voiceSlider.on('slideStop', (value) => {
      this.setVolume(value)
    })
  }

  bindLeftBar() {
    // this.ui.hideLeft()
  }

  bindRightBar() {

  }

  bindSwitchBtnWrap() {
    let playbackPlayer = this.getNode('playbackPlayer')
    let drawPanel = this.getNode('draw_panel')
    let video = playbackPlayer.firstElementChild
    let iframe = drawPanel.firstElementChild
    playbackPlayer.appendChild(iframe)
    drawPanel.appendChild(video)
  }

  bindPlayRateList(e) {
    this.playRateNumber.forEach((element) => {
      this.removeClass(element, 'active')
    })
    let option = e.target
    this.addClass(option, 'active')
    let rateLabel = option.innerHTML
    let rate = rateLabel.substring(0, rateLabel.length - 1)
    hd.rate = rate
    this.playRateBtn.innerHTML = rateLabel
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
    if (!this.isPlayerLoad) {
      return false
    }
    hd.togglePlay()
  }

  stopTimer() {
    clearInterval(this.timer)
  }

  startTimer() {
    this.stopTimer()
    this.timer = setInterval(this.bindTimerUpdate.bind(this), 999)
  }

  bindTimerUpdate() {
    this.updateCurrentTime()
    this.updateBuffer()
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
  }

  updateVolume() {
    this.voiceSlider.setValue(hd.volume)
    Utils.log('getValue volume', this.voiceSlider.getValue())
  }

  setVolume(volume) {
    if (!this.isPlayerLoad) {
      return false
    }
    hd.volume = volume
    Utils.log('hd.volume', hd.volume)
    this.setMute(hd.volume)
  }

  setMute(volume) {
    if (volume == 0) {
      this.addClass(this.voiceButton, 'mute')
    } else {
      this.removeClass(this.voiceButton, 'mute')
    }
  }

  setPlayerSliderMax() {
    this.playerSlider.setAttribute('max', this.durationTime)
  }

  onSeek(value) {
    this.delaySeek && clearTimeout(this.delaySeek)
    this.delaySeek = setTimeout(() => {
      this.stopTimer()
      hd.seek(value)
    }, 500)
  }

  updatePlayerSliderValue() {
    this.playerSlider.setValue(this.currentTime)
  }

  addBuffer() {
    let sliderTrack = this.getNodeByClass('slider-track')
    let div = this.creatNode('div')
    div.id = 'buffer'
    div.className = 'buffer'
    sliderTrack.insertBefore(div, sliderTrack.childNodes[0])
  }

  updateBuffer() {
    // if (!this.isPlayerLoad) {
    //   return false
    // }
    // let buffer = (hd.buffer / this.durationTime) * 100
    // console.log(buffer)
    // if (buffer <= 100) {
    //   this.buffer.style.width = buffer + '%'
    // }
  }

}

export default Controls