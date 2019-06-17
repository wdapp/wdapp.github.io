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

  scrollIntoView() {
    if (this.input) {
      this.input.onfocus = this.onFocus.bind(this)
      this.input.onblur = this.onBlur.bind(this)
    }
  }

  scrollIntoViewIfNeeded() {
    this.innerHeight = window.innerHeight
    if (this.input) {
      this.input.onfocus = this.onFocus.bind(this)
      this.input.onblur = this.onBlur.bind(this)
    }
  }

  onFocus() {
    if (this.innerHeight && (this.innerHeight !== window.innerHeight)) {
      document.body.style.height = this.innerHeight + 'px'
    }
    this.upTimer && clearTimeout(this.upTimer)
    this.upTimer = setTimeout(() => {
      if (this.input.scrollIntoView) {
        this.input.scrollIntoView()
      } else {
        this.upInput()
      }
    }, 200)
  }

  onBlur() {
    if (this.innerHeight) {
      document.body.style.height = '100%'
    }
    this.putInput()
  }

  setInput(id) {
    if (!id || typeof id !== 'string') {
      return false
    }
    let input = document.getElementById(id)
    return input
  }

  upInput() {
    document.body.scrollTop = window.innerHeight
  }

  putInput() {
    document.body.scrollTop = 0
  }

}

export default Input