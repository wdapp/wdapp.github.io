import Render from 'common/render'

class LoadBar extends Render {
  bufferTimer = 0
  interval = 999
  buffer = false
  progress = false
  color = {
    gray: '#757575',
    silver: '#999999',
    orange: '#ff920a'
  }
  durationTime = 0

  constructor(options) {
    super()
    this.init(options)
  }

  init(options) {
    this.durationTime = options.durationTime
    this.playerSliderWrap = document.getElementById(options.element)
    this.bufferWrap = this.addBuffer()
    this.startBufferTimer()
  }

  addBuffer() {
    let sliderTrack = this.getNodeByClass('slider-track')
    let div = this.createNode('div')
    div.id = 'buffer'
    div.className = 'buffer'
    sliderTrack.insertBefore(div, sliderTrack.childNodes[0])
    return div
  }

  startBufferTimer() {
    this.bufferTimer && this.stopTimer()
    this.bufferTimer = setInterval(this.bindBufferTimerUpdate.bind(this), this.interval)
  }

  stopBufferTimer() {
    clearInterval(this.bufferTimer)
  }

  bindBufferTimerUpdate() {
    this.updateBuffer()
  }

  updateBuffer() {
    if (!hd.buffer) {
      return false
    }
    let buffer = (hd.buffer / this.durationTime) * 100
    if (buffer <= 100) {
      this.bufferWrap.style.width = buffer + '%'
    } else {
      this.bufferWrap.style.width = '100%'
      this.stopBufferTimer()
    }
    if (buffer > 0) {
      this.loadBarGrayToSilver()
    }
  }

  loadBarGrayToSilver() {
    if (!this.progress && this.playerSliderWrap.style.backgroundColor !== this.color.gray) {
      this.playerSliderWrap.style.backgroundColor = this.color.silver
      this.buffer = true
    }
  }

  loadBarGrayToOrange() {
    if (this.playerSliderWrap.style.backgroundColor !== this.color.gray) {
      this.playerSliderWrap.style.backgroundColor = this.color.orange
      this.progress = true
    }
  }

  loadBarRegress() {
    if (this.buffer) {
      this.loadBarOrangeToSilver(this.playerSliderWrap)
    } else {
      this.loadBarOrangeToGray(this.playerSliderWrap)
    }
    this.progress = false
  }

  loadBarOrangeToSilver() {
    if (this.playerSliderWrap.style.backgroundColor !== this.color.gray) {
      this.playerSliderWrap.style.backgroundColor = this.color.silver
    }
  }

  loadBarOrangeToGray() {
    if (this.playerSliderWrap.style.backgroundColor !== this.color.orange) {
      this.playerSliderWrap.style.backgroundColor = this.color.gray
    }
  }

}

export default LoadBar