import "../common/config.js";//全局配置文件
import Live from "../common/liveAdaptive";
import Utils from "../common/utils";//引入公共方法库
import stateMachine from "../common/stateMachine";//引入状态机库
import "../../public/asset/style/reset.css";//重置样式
import "./asset/style/live.scss";
import Player from "../components/live/player/player";
import drawPanel from "../components/live/drawPanel/drawPanel";
import "../components/live/chat/chat";

window.onload = function () {
  window.$ = window.jQuery = $;

  new Player();

  new drawPanel();

  let params = Utils.parseUrl(localStorage.address);

  var live = new Live();

  live.init({
    userid: params.userid,
    roomid: params.roomid,
    viewername: params.viewername,
    groupid: "",
    viewertoken: "",
    viewercustomua: "web",
    language: "en",
    viewercustominfo: "",
    fastMode: "true",
    success: function (result) {
      Utils.log(result);
      stateMachine().login();
    },
    fail: function (error) {
      Utils.log(error);
      stateMachine().quit();
    }
  });


};





