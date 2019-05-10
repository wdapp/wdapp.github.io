import 'common/config/config'//全局配置文件
import ReplayAdaptive from 'common/replayAdaptive'
import {fastClick, flexible} from 'common/config/mobile'//移动端配置文件
import './styles/replay-mobile.scss'//引入移动端观看回放私有样式

window.onload = function () {

  fastClick.attach(document.body)

  flexible.init(750, 750)

  $.DW.config({
    userId: 'B27039502337407C',
    roomId: '3115C441D8B66A719C33DC5901307461',
    recordId: '96C0454B9E3CE464',
    groupId: '',
    viewername: 'haha',
    viewertoken: '',
    isH5play: true,
    fastMode: true,
  })

}




