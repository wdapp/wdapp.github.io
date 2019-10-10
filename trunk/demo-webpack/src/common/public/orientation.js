import Utils from 'common/utils'

class Orientation {
  constructor() {

  }

  init() {
    HDScene.onRotateScreenChange((orientation) => {
      this.updateOrientation(orientation)
    })
  }

  updateOrientation(orientation) {
    let top = document.getElementById('top')
    let main = document.getElementById('main')
    let bottom = document.getElementById('bottom')
    let controlsWrapper = document.getElementById('controlsWrapper')
    if (!top || !bottom) {
      return false
    }
    if (orientation == 'portrait') {
      top && (top.style.height = '4.22rem')
      main && (main.style.height = '4.22rem')
      bottom && (bottom.style.bottom = '0')
      bottom && (bottom.style.overflow = 'unset')
      controlsWrapper && (controlsWrapper.style.display = 'block')
    } else {
      top && (top.style.height = '100%')
      main && (main.style.height = '100%')
      bottom && (bottom.style.bottom = 'unset')
      bottom && (bottom.style.overflow = 'hidden')
      controlsWrapper && (controlsWrapper.style.display = 'none')
    }
    Utils.log('orientation', orientation)
  }
}

export default Orientation

