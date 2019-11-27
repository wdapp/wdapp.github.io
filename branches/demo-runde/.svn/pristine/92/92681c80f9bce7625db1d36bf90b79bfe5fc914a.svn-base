window.isLog = true

export function isAddress (address = '') {
  return /^http(s)?:\/\/view.csslcloud.net/.test(address) && /userid/.test(address) && /roomid/.test(address)
}

export function log (...info) {
  if (window.isLog && window.console && typeof console.log === 'function') {
    console.log(...info)
  }
}
