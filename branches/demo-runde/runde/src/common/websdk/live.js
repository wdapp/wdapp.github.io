class HuodeScene {
  constructor () {

  }

  login () {
    DWLive.init({
      userid: 'B693062ABB8020E0',
      roomid: '20E2BEC88BEF3EEB9C33DC5901307461',
      viewername: '获得场景视频',
      viewertoken: ''
    })
  }
}

let HD = new HuodeScene()

window.HD = HD

export default HD
