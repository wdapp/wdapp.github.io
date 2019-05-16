import 'common/config/config.js'//全局配置文件
import {fastClick, flexible} from 'common/config/mobile'//移动端配置文件

import Login from 'components/login/login'

window.onload = function () {
  fastClick.attach(document.body)
  flexible.init(750, 750)
  new Login()
}

