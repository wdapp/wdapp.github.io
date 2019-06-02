(function (callback) {
  var supportOrientation = (typeof window.orientation === 'number' &&
    typeof window.onorientationchange === 'object')

  var init = function () {
    var htmlNode = document.body.parentNode, orientation
    var updateOrientation = function () {
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
      callback(orientation)
    }

    if (supportOrientation) {
      window.addEventListener('orientationchange', updateOrientation, false)
    } else {
      //监听resize事件
      window.addEventListener('resize', updateOrientation, false)
    }

    updateOrientation()
  }

  window.addEventListener('DOMContentLoaded', init, false)
})(updateOrientationCallback)

function updateOrientationCallback(orientation) {
  var top = document.getElementById('top')
  var bottom = document.getElementById('bottom')
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

