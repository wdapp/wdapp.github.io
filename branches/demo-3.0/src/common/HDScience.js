//所有对象的入口类
import 'babel-polyfill' //IE 9 兼容 ECMAScript 6
import Tips from './userInterface'
import LiveAdaptive from './liveAdaptive'
import Utils from 'common/utils' //公共方法库
let HD = function () {
  return (function () {
    let tips = null
    let HDScienceMap = {}

    let modules = {}

    let eventMap = {}

    class HDScience extends LiveAdaptive {
      //////////////apievent///////////////////////
      OnLoginSuccess = 'LoginSuccess'
      OnQuestion = 'OnQuestion'
      OnAnswer = 'OnAnswer'
      OnQAPublish = 'OnQAPublish'
      OnPublishChatMsg = 'OnPublishChatMsg'
      OnPrivateChatMsg = 'OnPrivateChatMsg'
      OnLineTeachers = 'OnLineTeachers'
      OnPrivateChat = 'OnPrivateChat'
      OnANnounceShow = 'OnANnounceShow'
      OnLiveDesc = 'OnLiveDesc'
      OnUserCountMessage ="OnUserCountMessage"
      OnLiveStart="onLiveStart"
      OnLiveEnd = "OnLiveEnd"
//////////////////////////////Event///////////////

      ////////////////live///////
      LiveInterface = 'LiveInterface'
      InitInfo = 'InitInfo'
      LoginInfo = 'LoginInfo'

      constructor() {
        super()
        this.node = document.getElementById('app')
        if (!this.node) {
          let app = document.createElement('div')
          app.id = 'app'
          document.body.appendChild(app)
          this.node = app
        }
      }

      register(data) {
        if (!data) {
          throw new Error('Please fill in the valid data')
        }
        if (data.modules) {
          // console.log(typeof data.modules);
          if (data.modules instanceof Array) {
            this.regiserModule(data.modules)
          } else {
            this.regiserModule([data.modules])
          }
        }
        // let liveAdaptive = new LiveAdaptive()
        let params = data.config
        this.init({
          userId: params.userid || '40A53587B37573BD',
          roomId: params.roomid || '427DB068D5EAB1279C33DC5901307461',
          viewerName: params.viewername || '抖音BGM',
          viewerToken: params.viewertoken,
          groupId: '',
          viewerCustominfo: '',
          viewerCustomua: 'web',
          language: 'en',
          fastMode: params.fastMode,
          success: function (result) {
            if (typeof data.success === 'function') {
              data.success.apply(null, result)
            }
            Utils.log(result)
          },
          fail: function (error) {
            if (typeof data.fail === 'function') {
              data.fail.apply(null, error)
            }
            Utils.log(error)
          }
        })

      }

      regiserModule(modules = []) {
        if (modules.length < 1) return
        for (let i = 0; i < modules.length; i++) {
          let classObj = modules[i]
          let m = new classObj()
          if (!m.name) {
            throw new Error(module + ' can not find name property')
          } else {
            modules[m.name] = m
          }
        }
      }

      alert(content, type = '') {
        if (!tips) {
          tips = new Tips()
        }
        tips.alert({type: type, content: content})
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
        if (this.node.dispatchEvent) {
          this.node.dispatchEvent(new Event(type))
        } else {
          eventMap[type] = []
        }

      }

      addEvent(type, func) {
        if (!type) return
        if (!this.node.dispatchEvent) {
          if (eventMap[type]) {
            eventMap[type].push(func)
          } else {
            eventMap[type] = []
            eventMap[type].push(func)
          }
          let l = eventMap[type].length
          for (let i = 0; i < l; i++) {
            let f = eventMap[type][i]
            f.apply(null)
          }
          return
        }

        if (this.node.addEventListener) {
          this.node.addEventListener(type, func)
        } else {
          this.node.attachEvent(type, func)
        }

      }

    }

    window.hdScience = HDScience.instance
  })()
}
let hd = new HD()
export default hd








