export default {
  data () {
    return {
      cctimer: 0,
      cctimeout: 6000
    }
  },
  methods: {
    emit (event, options) {
      this.bus.$emit(event, options)
    },
    on (event, callback) {
      this.bus.$on(event, params => {
        callback && callback(params)
      })
    },
    delay (callback, timeout) {
      let _timeout = timeout
      if (_timeout === 0) {
        return false
      }
      if (typeof _timeout === 'undefined') {
        _timeout = this.cctimeout
      }
      this.abort()
      this.cctimer = setTimeout(() => {
        callback && callback()
        this.cctimer = 0
      }, _timeout)
    },
    abort () {
      if (this.cctimer) {
        clearTimeout(this.cctimer)
        this.cctimer = 0
      }
    }
  }
}
