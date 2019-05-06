import Request from "./request";
import "../../public/js/liveSDK";//引入观看直播Web SDK
//
// APIFUNCTIONLIS={
//   INIT:"init",
//   FILEPAge:"filepage",
//   ....
//
// }
//
//
// var apiFunc = {
//   init:DWLive.init,
//   filpage:DWLive.filpage,
//   ....
//   ..
//
//
// }
// live.callfunction(APIFUNCTIONLIS.INIT).call(this,);

class Live extends Request {
  constructor() {
    super();

  }
  // callfunction:function(t){
  //   return apiFunc.t
  // }

  init(params) {
    DWLive.init({
      userid: params.userid || "",
      roomid: params.roomid || "",
      viewername: params.viewername || "",
      groupid: params.groupid || "",
      viewertoken: params.viewertoken || "",
      viewercustomua: params.viewercustomua || "web",
      language: params.language || "en",
      viewercustominfo: params.viewercustominfo || "",
      fastMode: params.fastMode || true
    });

    DWLive.onLoginSuccess = function (result) {
      params.success && params.success(result);
    };

    DWLive.onLoginError = function (error) {
      params.fail && params.fail(error);
    };
  }

}

export default Live;