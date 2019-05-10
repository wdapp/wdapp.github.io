import 'common/public/liveSDK'//引入观看直播Web SDK
import {LiveSDKInterface} from 'common/interface'//引入接口适配器

class LiveAdaptive {

  constructor() {
    this.liveInterface = new LiveSDKInterface()
  }

  //初始化入口
  init(params) {
    this.liveInterface.call(this.liveInterface.INIT, {
      userid: params.userId || '',
      roomid: params.roomId || '',
      viewername: params.viewerName || '',
      groupid: params.groupId || '',
      viewertoken: params.viewerToken || '',
      viewercustomua: params.viewerCustomua || '',
      language: params.language || '',
      viewercustominfo: params.viewerCustominfo || '',
      fastMode: params.fastMode || true,
    })

    this.liveInterface.on(this.liveInterface.ONLOGINSUCCESS).then((result) => {
      params.success && params.success(result)
    })
    this.liveInterface.on(this.liveInterface.ONLOGINERROR).then((result) => {
      params.success && params.fail(result)
    })
  }

}

export default LiveAdaptive