import 'babel-polyfill'//IE 9 兼容 ECMAScript 6
import flexible from '@wdapp/flexible'//引入rem布局配置文件
import 'reset-css'//重置样式

import Login from 'components/login/login'

window.onload = function () {
  flexible.init(750, 750)
  new Login()
}

