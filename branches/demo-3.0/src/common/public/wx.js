class WX {
  constructor() {

  }

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