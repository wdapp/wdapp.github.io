class Orientation {
  constructor() {

  }

  init() {
    let supportOrientation = (typeof window.orientation === 'number' &&
      typeof window.onorientationchange === 'object')
    if (supportOrientation) {
      window.addEventListener('orientationchange', this.updateOrientation.bind(this, supportOrientation), false)
    } else {
      //监听resize事件
      window.addEventListener('resize', this.updateOrientation.bind(this, supportOrientation), false)
    }
    this.updateOrientation()
  }

  updateOrientation = function (supportOrientation) {
    let orientation = 0
    if (supportOrientation) {
      orientation = window.orientation
      switch (orientation) {
        case 90:
        case -90:
          orientation = 'landscape'
          break
        default:
          orientation = 'portrait'
          break
      }
    } else {
      orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
    }
    this.updateOrientationCallback(orientation)
  }


  updateOrientationCallback(orientation) {
    let top = document.getElementById('top')
    let bottom = document.getElementById('bottom')
    if (!top || !bottom) {
      return false
    }
    if (orientation == 'portrait') {
      top.style.height = '4.22rem'
      bottom.style.bottom = '0'
      bottom.style.overflow = 'unset'
    } else {
      top.style.height = '100%'
      bottom.style.bottom = 'unset'
      bottom.style.overflow = 'hidden'
    }
  }
}

export default Orientation

