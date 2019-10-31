/* eslint-disable */
export default function Flexible (options) {
  this.maxWidth = options.maxWidth || 1920
  this.minWidth = options.minWidth || 1440
  this.win = window
  this.lib = window['lib'] || {}
  this.doc = this.win.document
  this.docEl = this.doc.documentElement
  this.metaEl = this.doc.querySelector('meta[name="viewport"]')
  this.flexibleEl = this.doc.querySelector('meta[name="flexible"]')
  this.dpr = 0
  this.scale = 0
  this.tid = 0
  this.flexible = this.lib.flexible || (this.lib.flexible = {})
  this.configMeta()
  this.configDpr()
  this.addEvents()
  this.config()
}

Flexible.prototype.configMeta = function () {
  if (this.metaEl) {
    // console.warn('将根据已有的meta标签来设置缩放比例')
    var match = this.metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/)
    if (match) {
      this.scale = parseFloat(match[1])
      this.dpr = parseInt(1 / this.scale)
    }
  } else if (this.flexibleEl) {
    var content = this.flexibleEl.getAttribute('content')
    if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/)
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/)
      if (initialDpr) {
        this.dpr = parseFloat(initialDpr[1])
        this.scale = parseFloat((1 / this.dpr).toFixed(2))
      }
      if (maximumDpr) {
        this.dpr = parseFloat(maximumDpr[1])
        this.scale = parseFloat((1 / this.dpr).toFixed(2))
      }
    }
  }
}

Flexible.prototype.configDpr = function () {
  if (!this.dpr && !this.scale) {
    var isAndroid = this.win.navigator.appVersion.match(/android/gi)
    var isIPhone = this.win.navigator.appVersion.match(/iphone/gi)
    var devicePixelRatio = this.win.devicePixelRatio
    if (isIPhone) {
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!this.dpr || this.dpr >= 3)) {
        this.dpr = 3
      } else if (devicePixelRatio >= 2 && (!this.dpr || this.dpr >= 2)) {
        this.dpr = 2
      } else {
        this.dpr = 1
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      this.dpr = 1
    }
    this.scale = 1 / this.dpr
  }

  this.docEl.setAttribute('data-dpr', this.dpr)
  if (!this.metaEl) {
    this.metaEl = this.doc.createElement('meta')
    this.metaEl.setAttribute('name', 'viewport')
    this.metaEl.setAttribute('content', 'initial-scale=' + this.scale + ', maximum-scale=' + this.scale + ', minimum-scale=' + this.scale + ', user-scalable=no')
    if (this.docEl.firstElementChild) {
      this.docEl.firstElementChild.appendChild(this.metaEl)
    } else {
      var wrap = this.doc.createElement('div')
      wrap.appendChild(this.metaEl)
      this.doc.write(wrap.innerHTML)
    }
  }
}

Flexible.prototype.refreshRem = function () {
  var width = this.docEl.getBoundingClientRect().width
  if (width > this.maxWidth) {
    width = this.maxWidth
  }
  if (width < this.minWidth) {
    width = this.minWidth
  }
  if (width / this.dpr > this.maxWidth) {
    width = this.maxWidth * this.dpr
  }
  var rem = width / 10
  this.docEl.style.fontSize = rem + 'px'
  this.flexible.rem = this.win.rem = rem
}

Flexible.prototype.addEvents = function () {
  var _this = this
  _this.win.addEventListener('resize', function () {
    clearTimeout(_this.tid)
    _this.tid = setTimeout(_this.refreshRem.bind(_this), 300)
  }, false)
  _this.win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      clearTimeout(_this.tid)
      _this.tid = setTimeout(_this.refreshRem.bind(_this), 300)
    }
  }, false)
  if (_this.doc.readyState === 'complete') {
    _this.doc.body.style.fontSize = 12 * _this.dpr + 'px'
  } else {
    _this.doc.addEventListener('DOMContentLoaded', function (e) {
      _this.doc.body.style.fontSize = 12 * _this.dpr + 'px'
    }, false)
  }
}

Flexible.prototype.config = function () {
  this.flexible.dpr = this.win.dpr = this.dpr
  this.flexible.refreshRem = this.refreshRem
  this.flexible.rem2px = function (d) {
    var val = parseFloat(d) * this.rem
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px'
    }
    return val
  }
  this.flexible.px2rem = function (d) {
    var val = parseFloat(d) / this.rem
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem'
    }
    return val
  }
}



