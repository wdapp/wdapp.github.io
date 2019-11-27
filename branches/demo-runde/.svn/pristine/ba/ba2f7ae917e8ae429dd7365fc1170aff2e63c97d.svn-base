export default {
  data() {
    return {
      timer: 0,
      timeout: 6000
    };
  },
  methods: {
    emit(event, options) {
      this.bus.$emit(event, options);
    },
    on(event, callback) {
      this.bus.$on(event, params => {
        callback && callback(params);
      });
    },
    delay(callback, timeout) {
      let _timeout = timeout;
      if (_timeout === 0) {
        return false;
      }
      if (typeof _timeout === "undefined") {
        _timeout = this.timeout;
      }
      this.abort();
      this.timer = setTimeout(() => {
        callback && callback();
        this.timer = 0;
      }, _timeout);
    },
    abort() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = 0;
      }
    }
  }
};