import 'assets/styles/header.scss'
import 'babel-polyfill' //IE 9 兼容 ECMAScript 6
import flexible from 'common/public/flexible'//引入rem布局配置文件
import Login from 'components/login/login'//引入登录组件
flexible.init(750, 750)//配置rem布局
new Login()//初始化登录组件

