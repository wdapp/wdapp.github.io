/* eslint-disable */
window.DEBUG = true

export function isAddress (address = '') {
  return /^http(s)?:\/\/view.csslcloud.net/.test(address) && /userid/.test(address) && /roomid/.test(address)
}

export function log (...info) {
  if (window.DEBUG && window.console && typeof console.log === 'function') {
    console.log(...info)
  }
}

export function showEm (str) {
  if (!$.trim(str)) {
    return ''
  }
  str = str.replace(/\</g, '&lt;')
  str = str.replace(/\>/g, '&gt;')
  str = str.replace(/\n/g, '<br/>')
  str = str.replace(/\[em_([0-9]*)\]/g, '<img src="img/em/$1.png" border="0" />')
  str = str.replace(/\[em2_([0-9]*)\]/g, '<img src="img/em2/$1.png" border="0" />')

  var nmsg = ''
  var reg = new RegExp(/\[img_http(s)?:\/\/(.*?)\]/g)
  var isImage = reg.test(str)
  if (isImage) {
    var sIndex = str.indexOf('_') + 1
    nmsg = str.slice(sIndex, str.length - 1)
    var imgTag = '<div class="chatImage" style="width: 100%; cursor: pointer;" ><img src="' + nmsg + '"  style="width: 100%;" /></div>'
    return imgTag
  }

  $.each(str.split(' '), function (i, n) {
    n = $.trim(n)
    if (n.indexOf('[uri_') === 0 && n.indexOf(']') === n.length - 1 && n.length > 6) {
      var u = n.substring(5, n.length - 1) + ' '
      nmsg += '<a target="_blank" style="color: #2f53ff" href="' + u + '">' + u + '</a>' + ' '
    } else {
      nmsg += n + ' '
    }
  })
  return nmsg
}
