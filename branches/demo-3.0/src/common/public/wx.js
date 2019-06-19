class WX {
  constructor() {

  }

  //iOS 微信自动播放，安卓微信不支持自动播放
  WeiXinVideoAutoPlayer(id = '') {
    document.addEventListener('WeixinJSBridgeReady', () => {
      let player = document.getElementById(id)
      if (player && typeof player.play == 'function') {
        setTimeout(() => {
          player.play()
        }, 1000)
      }
    }, false)
  }
}

export default WX