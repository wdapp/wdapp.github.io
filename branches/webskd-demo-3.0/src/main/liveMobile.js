import 'common/config/config.js'//全局配置文件
import LiveAdaptive from 'common/liveAdaptive'
import {fastClick, flexible} from 'common/config/mobile'//移动端配置文件
import './styles/live-mobile.scss'//移动端观看直播私有样式

window.onload = function () {
  fastClick.attach(document.body)
  flexible.init(750, 750)
}


