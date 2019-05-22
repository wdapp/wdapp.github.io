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
  isThumbnailList = false

  constructor() {
    super()
    this.render('controls', template, () => {
      this.init()
    })
  }

  init() {
    this.ui = new UserInterface()
    this.playButton = this.getNode('playButton')
    this.playButtonIcon = this.getNode('playButtonIcon')
    this.playTimeDuration = this.getNode('playTimeDuration')
    this.palyTimeCurrent = this.getNode('palyTimeCurrent')
    this.palyTimeCurrent = this.getNode('palyTimeCurrent')
    this.voiceButton = this.getNode('voiceButton')
    this.quitButton = this.getNode('quitButton')
    this.thumbnailListButton = this.getNode('thumbnailListButton')
    this.thumbnailWrapper = this.getNode('thumbnailWrapper')

    this.bind(this.playButton, 'click', this.bindPlay.bind(this))
    this.bind(this.quitButton, 'click', this.bindQuit.bind(this))
    this.bind(this.thumbnailListButton, 'click', this.togglethumbnailList.bind(this))

    this.initHD()

    this.initSlider()
  }

  initHD() {
    hd.onPlayerLoad(() => {
      this.isPlayerLoad = true
      this.updateVolume()
      this.setDurationTime()
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
      this.onPlayStateChange(this.playState)
      Utils.log('onPlayerEnd', this.playState)
    })
  }

  initSlider() {
    this.playerSlider = new Slider('#playerSlider', {
      precision: 2,
      formatter: function (value) {
        return Utils.formatSeconds(value)
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

  togglethumbnailList() {
    if (this.isThumbnailList) {
      this.thumbnailWrapper.style.display = 'none'
    } else {
      this.thumbnailWrapper.style.display = 'block'
    }
    this.isThumbnailList = !this.isThumbnailList
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
    this.currentTime = hd.currentTime
    this.palyTimeCurrent.innerText = Utils.formatSeconds(this.currentTime)
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
    clearTimeout(this.delaySeek)
    this.delaySeek = setTimeout(() => {
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