import "../common/config.js";//全局配置文件
import fastClick from "fastclick";//解决移动端点击延迟问题
import flexible from "@wdapp/flexible";//引入flex布局配置
import "../../public/asset/style/reset.css";//重置样式
import "../../public/asset/style/border.css";//解决移动端1像素边框问题
import Login from "../components/login/login";

window.onload = function () {
  fastClick.attach(document.body);

  flexible.init(750, 750);

  new Login();
};

