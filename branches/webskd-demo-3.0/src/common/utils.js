class Utils {
  constructor() {

  }

  static getURL() {
    return {
      publicPath: 'http://localhost:8080/',
      LIVE: 'http://localhost:8080/live.html',
      REPLAY: 'http://localhost:8080/replay.html',
      MOBILELIVE: 'http://localhost:8080/live-mobile.html',
      MOBILEREPLAY: 'http://localhost:8080/replay-mobile.html',
    }
  }

  static stringToJSON(d) {
    if (!d) {
      return {}
    }
    d = JSON.parse(d)
    return d
  }

  static JSONTOString(d) {
    if (typeof d === 'object') {
      return JSON.stringify(d)
    }
    return d
  }

  static log(...info) {
    if (window.debug && console.log) {
      console.log(...info)
    }
  }

  static isEmptyObject(object = {}) {
    if (typeof object !== 'object') {
      return false
    }
    return Object.keys(object).length > 0 ? true : false
  }

  static isAddress(address = '') {
    return /^http(s)?:\/\/view.csslcloud.net/.test(address) && /userid/.test(address) && /roomid/.test(address)
  }

  static isMobile() {
    return /iPad|iPhone|Android|Windows Phone/ig.test(this.getUserAgent())
  }

  static isReaply(address = '') {
    return /recordid|liveid/.test(address) && /callback/.test(address)
  }

  static getUserAgent() {
    return navigator.userAgent
  }

  static parseUrl(url = '') {
    if (!url && typeof url !== 'string') {
      return false
    }

    let querys = url.split('?')
    if (!querys[1]) {
      return false
    }
    let query = url.split('?')[1]
    let queryArray = query.split('&')
    if (queryArray.length === 0) {
      return false
    }
    let params = {}
    queryArray.forEach(function (item) {
      let key = item.split('=')[0]
      let value = item.split('=')[1]
      params[key] = value
    })

    return params
  }

}

export default Utils