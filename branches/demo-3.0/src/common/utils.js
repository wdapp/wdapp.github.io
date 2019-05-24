/**
 * 公共方法
 * */
class Utils {

  constructor() {

  }

  static get PATH() {
    // let host = '192.168.200.33:8080'
    // let path = '192.168.200.33:8080'
    let path = '//github.wdapp.top/branches/demo-3.0/dist'
    return {
      // HOST: `${host}`,
      INDEX: `//${path}/index.html`,
      LIVE: `//${path}/live.html`,
      REPLAY: `//${path}/replay.html`,
      MOBILELIVE: `//${path}/live-mobile.html`,
      MOBILEREPLAY: `//${path}/replay-mobile.html`,
    }
  }

  static get version() {
    let _version = '1.0.0'
    return _version
  }

  static get tag() {
    let _tag = '1.0.0'
    return _tag
  }

  static get timestamp() {
    let _timestamp = '1.0.0'
    return _timestamp
  }

  static get useragent() {
    return navigator.userAgent
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
    if (window.debug && window.console && typeof console.log === 'function') {
      console.log(...info)
    }
  }

  static isEmptyObject(object = {}) {
    if (!object || typeof object !== 'object') {
      return false
    }
    return Object.keys(object).length > 0 ? true : false
  }

  static isEmptyString(string = '') {
    if (typeof string != 'string' || !string) {
      return false
    }
    return true
  }

  static isAddress(address = '') {
    return /^http(s)?:\/\/view.csslcloud.net/.test(address) && /userid/.test(address) && /roomid/.test(address)
  }

  static isMobile() {
    return /iPad|iPhone|Android|Windows Phone/ig.test(this.useragent())
  }

  static isReaply(address = '') {
    return /recordid|liveid/.test(address) && /callback/.test(address)
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

  static showEm(str) {
    if (!$.trim(str)) {
      return ''
    }
    str = str.replace(/\</g, '&lt;')
    str = str.replace(/\>/g, '&gt;')
    str = str.replace(/\n/g, '<br/>')
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="//view.csslcloud.net/img/em/$1.gif" border="0" />')
    str = str.replace(/\[em2_([0-9]*)\]/g, '<img src="//view.csslcloud.net/img/em2/$1.png" border="0" />')

    let nmsg = ''    //解析表情
    $.each(str.split(' '), function (i, n) {
      n = $.trim(n)
      if (n.indexOf('[uri_') == 0 && n.indexOf(']') == n.length - 1 && n.length > 6) {
        let u = n.substring(5, n.length - 1) + ' '
        nmsg += '<a target="_blank" style="color: #2f53ff" href="' + u + '">' + u + '</a>' + ' '
      } else {
        nmsg += n + ' '
      }
    })

    let reg = new RegExp(/\[img_http(s)?:\/\/(.*?)\]/g)
    let isImage = reg.test(str)
    if (isImage) {
      let sIndex = str.indexOf('_') + 1
      nmsg = str.slice(sIndex, str.length - 1)
      let imgTag = '<div class="chatImage" style="width: 100%" ><img src="' + nmsg + '"  style="width: 100%;cursor:pointer;" onclick="showMsgImage(event)"/></div>'
      return imgTag
    }

    return nmsg
  }

  static formatSeconds(value) {
    let secondTime = parseInt(value)// 秒
    let minuteTime = 0// 分
    let hourTime = 0// 小时
    if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    let result = '' + secondTime
    result = result < 10 ? '0' + result : result
    secondTime = secondTime < 10 ? '0' + secondTime : secondTime

    if (minuteTime > 0) {
      minuteTime = minuteTime < 10 ? '0' + minuteTime : minuteTime
      result = '' + minuteTime + ':' + result
    } else {
      minuteTime = '00'
      result = '' + minuteTime + ':' + result
    }

    if (hourTime > 0) {
      hourTime = hourTime < 10 ? '0' + hourTime : hourTime
      result = '' + hourTime + ':' + result
    }
    return result
  }

}

export default Utils