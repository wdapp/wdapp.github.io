class Input {
  input = null
  upTimer = 0
  innerHeight = 0

  constructor(options) {
    this.init(options)
  }

  init(options) {
    this.input = this.setInput(options.id)
  }

  //解决iOS微信软键盘遮挡输入框问题
  scrollIntoView() {
    this.addEventListener({
      focus: this.onFocus,
      blur: this.onBlur
    })
  }

  //解决安卓软键盘无法顶起页面问题
  scrollIntoViewIfNeeded() {
    this.innerHeight = window.innerHeight
    this.addEventListener({
      focus: this.onFocus,
      blur: this.onBlur
    })
  }

  //解决安卓input选中状态下，切换swiper无法自动失去焦点问题
  static blurAll() {
    let inputs = document.querySelectorAll('input')
    for (let item of inputs) {
      item.blur()
    }
  }

  //解决iOS软键盘tab切换input，导致页面错乱问题
  tabIndex() {
    this.addEventListener({
      focus: () => {
        this.updateTabIndex()
      },
      blur: () => {
        this.removeTabIndex()
      }
    })
  }

  updateTabIndex() {
    let inputs = document.querySelectorAll('input')
    for (let item of inputs) {
      if (item && item.id != this.input.id) {
        item.setAttribute('tabIndex', '-1')
      } else if (item && item.id == this.input.id) {
        this.input.setAttribute('tabIndex', '1')
      }
    }
  }

  removeTabIndex() {
    let inputs = document.querySelectorAll('input')
    for (let item of inputs) {
      item.removeAttribute('tabIndex')
    }
  }

  addEventListener(options) {
    if (this.input) {
      this.input.addEventListener('focus', options.focus.bind(this))
      this.input.addEventListener('blur', options.blur.bind(this))
    }
  }

  onFocus() {
    this.extendHeight()

    this.upTimer && clearTimeout(this.upTimer)
    this.upTimer = setTimeout(() => {
      this.upInput()
    }, 200)
  }

  onBlur() {
    this.restoreHeight()
    this.putInput()
  }

  extendHeight() {
    if (this.innerHeight) {
      document.body.style.height = this.innerHeight + 'px'
    }
  }

  restoreHeight() {
    if (this.innerHeight) {
      document.body.style.height = '100%'
    }
  }

  setInput(id) {
    if (!id || typeof id !== 'string') {
      return false
    }
    let input = document.getElementById(id)
    return input
  }

  upInput() {
    if (this.input.scrollIntoView) {
      this.input.scrollIntoView()
    } else {
      document.body.scrollTop = window.innerHeight
    }
  }

  putInput() {
    document.body.scrollTop = 0
  }

}

export default Input