//移动端rem布局配置文件

//author:caibaojian
//website:http://caibaojian.com
//weibo:http:weibo.com/kujian
//兼容UC竖屏转横屏出现的BUG
//自定义设计稿的宽度：designWidth
//最大宽度:maxWidth
//这段js的最后面有两个参数记得要设置，一个为设计稿实际宽度，一个为制作稿最大宽度，例如设计稿为750，最大宽度为750，则为(750,750)

class Flexible {

  static init(designWidth, maxWidth) {
    var doc = document,
      win = window,
      docEl = doc.documentElement,
      remStyle = document.createElement('style')

    function refreshRem() {
      var width = docEl.getBoundingClientRect().width
      maxWidth = maxWidth || 540
      width > maxWidth && (width = maxWidth)
      var rem = width * 100 / designWidth
      remStyle.innerHTML = 'html{font-size:' + rem + 'px;}'
    }

    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(remStyle)
    } else {
      var wrap = doc.createElement('div')
      wrap.appendChild(remStyle)
      doc.write(wrap.innerHTML)
      wrap = null
    }
    //要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
    refreshRem()

    win.addEventListener('resize', function () {
      refreshRem()
    }, false)

    win.addEventListener('pageshow', function (e) {
      refreshRem()
    }, false)

    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = '16px'
    } else {
      doc.addEventListener('DOMContentLoaded', function (e) {
        doc.body.style.fontSize = '16px'
      }, false)
    }
  }
}

export default Flexible

