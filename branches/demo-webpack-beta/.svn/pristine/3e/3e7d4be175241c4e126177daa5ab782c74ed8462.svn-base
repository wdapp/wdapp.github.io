import Component from 'common/component'
import Utils from 'common/utils'

class LoadBar extends Component {
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
    this.addTooltipEventTarget()
    this.initTooltip()
    let resizeTimer = 0
    this.bind(window, 'resize', () => {
      resizeTimer && clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.initTooltip()
      }, 500)
    })
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
    if (!HDScene.buffer) {
      return false
    }
    let buffer = (HDScene.buffer / this.durationTime) * 100
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

  addTooltipEventTarget() {
    let parent = this.getNodeByClass('slider-horizontal')
    let div = this.createNode('div')
    div.style.height = '100%'
    div.style.width = '100%'
    div.style.position = 'absolute'
    this.appendChild(parent, div)
    return div
  }

  initTooltip() {
    this.sliderTooltip = document.getElementById('sliderTooltip')
    this.toolTipWidth = 0
    this.sliderTooltipInner = this.sliderTooltip.getElementsByClassName('slider-tooltip-inner')[0]
    this.playerSlider = document.getElementById('sliderPlayer')
    this.playerSliderWidth = this.playerSlider.clientWidth
    this.left = 0
    this.seconds = 0
    this.percent = 0
    this.playerSlider.onmousemove = (event) => {
      this.tooltipMove(event)
    }
    this.playerSlider.onmouseenter = (event) => {
      this.tooltipMove(event)
    }
    let playerSliderWrap = document.getElementById('playerSliderWrap')
    playerSliderWrap.onmouseenter = (event) => {
      this.sliderTooltip.style.display = 'block'
      this.tooltipMove(event)
    }
    playerSliderWrap.onmouseleave = () => {
      this.sliderTooltip.style.display = 'none'
    }
  }

  tooltipMove(event) {
    if (event.target.className == 'slider-handle min-slider-handle round') {
      return false
    }
    this.left = event.offsetX
    if (event.target.id == 'playerSliderWrap') {
      this.left = 0
    }
    let _left = this.left
    this.toolTipWidth = this.sliderTooltip.clientWidth
    if (this.left + 10 <= this.toolTipWidth / 2) {
      _left = this.toolTipWidth / 2 - 10
    }
    if (this.left >= this.playerSliderWidth - this.toolTipWidth / 2) {
      _left = this.playerSliderWidth - this.toolTipWidth / 2
    }
    this.sliderTooltip.style.left = _left + 10 - (this.toolTipWidth / 2) + 'px'

    this.percent = (this.left / this.playerSliderWidth)
    if (this.percent > 1) {
      this.percent = 1
    }
    if (this.percent < 0) {
      this.percent = 0
    }
    this.seconds = this.percent * this.durationTime
    this.sliderTooltipInner.innerText = Utils.formatSeconds(this.seconds)
  }

}

export default LoadBar