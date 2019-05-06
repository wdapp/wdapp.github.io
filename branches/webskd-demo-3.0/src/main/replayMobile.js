import "../common/config.js";//全局配置文件
import "../../public/js/playbackSDK";//引入观看回放Web SDK
import fastClick from "fastclick";//解决移动端点击延迟问题
import flexible from "@wdapp/flexible";//引入flex布局配置
import "../../public/asset/style/reset.css";//重置样式
import "../../public/asset/style/border.css";//解决移动端1像素边框问题
import "./asset/style/replay-mobile.scss"
window.onload = function () {

  window.$ = window.jQuery = $;

  fastClick.attach(document.body);

  flexible.init(750, 750);

  $.DW.config({
    userId: "B27039502337407C",
    roomId: "3115C441D8B66A719C33DC5901307461",
    recordId: "96C0454B9E3CE464",
    groupId: "",
    viewername: "haha",
    viewertoken: "",
    isH5play: true,
    fastMode: true,
  });

};




