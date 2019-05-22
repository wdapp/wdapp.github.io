//所有对象的入口类
import 'babel-polyfill'//IE 9 兼容 ECMAScript 6

let HD = function () {
  return (function () {
    let HDScienceMap = {}

    class HDScience {
      OnLoginSuccess = 'LoginSuccess'
      OnQuestion = 'OnQuestion'
      OnAnswer = 'OnAnswer'
      OnQAPublish = 'OnQAPublish'
      OnPublishChatMsg = 'OnPublishChatMsg'
      OnPrivateChatMsg = 'OnPrivateChatMsg'

      LiveInterface = 'LiveInterface'
      InitInfo = 'InitInfo'
      LoginInfo = 'LoginInfo'

      constructor() {
        this.node = document.getElementById('app')
        if (!this.node) {
          let app = document.createElement('div')
          app.id = 'app'
          document.body.appendChild(app)
          this.node = app
        }
      }

      static get instance() {
        if (!HDScienceMap.instance) {
          HDScienceMap.instance = new HDScience()
        }
        return HDScienceMap.instance
      }

      registerObject(name, mode) {
        if (!mode || !name) return
        let _mode = mode
        let key = name
        HDScienceMap[key] = _mode
        return _mode
      }

      getObjectForName(v) {
        return HDScienceMap[v] || {}
      }

      dispatch(type) {
        if (!type) return
        this.node.dispatchEvent(new Event(type))
      }

      addEvent(type, func) {
        if (!type) return
        this.node.addEventListener(type, func)
      }

    }

    window.hdScience = HDScience.instance
  })()
}
let hd = new HD()
export default hd








