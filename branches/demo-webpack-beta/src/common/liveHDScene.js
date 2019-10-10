//所有对象的入口类
import 'babel-polyfill' //IE 9 兼容 ECMAScript 6
import LiveAdaptive from './liveAdaptive'
import Utils from 'common/utils' //公共方法库

let HD = function () {
  return (function () {

    let HDSceneMap = {}

    let modulesMap = {}

    class HDScene extends LiveAdaptive {

      constructor() {
        super()
        Utils.log({
          debug: Utils.debug,
          PATH: Utils.PATH,
          userAgent: Utils.userAgent,
          version: Utils.version,
          timestamp: Utils.timestamp,
          tag: Utils.tag,
          admin: Utils.admin,
        })
      }

      ready(callback, useCapture = false) {
        window.addEventListener('DOMContentLoaded', callback, useCapture)
      }

      onOrientationChange(callback, useCapture = false) {
        window.addEventListener('orientationchange', callback, useCapture)
      }

      onResize(callback, useCapture = false) {
        window.addEventListener('resize', callback, useCapture)
      }

      onRotateScreenChange(callback, useCapture = false) {
        let supportOrientation = (typeof window.orientation === 'number' &&
          typeof window.onorientationchange === 'object')
        Utils.log('supportOrientation', supportOrientation)
        if (supportOrientation) {
          this.onOrientationChange(() => {
            this.updateOrientation(supportOrientation, (orientation) => {
              callback(orientation)
            })
          }, useCapture)
        } else {
          this.onResize(() => {
            this.updateOrientation(supportOrientation, (orientation) => {
              callback(orientation)
            })
          }, useCapture)
        }
        this.updateOrientation(supportOrientation, (orientation) => {
          callback(orientation)
        })
      }

      updateOrientation = function (supportOrientation, callback) {
        let orientation = 0
        if (supportOrientation) {
          orientation = window.orientation
          switch (orientation) {
            case 90:
            case -90:
              orientation = 'landscape'
              break
            default:
              orientation = 'portrait'
              break
          }
        } else {
          orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
        }
        callback(orientation)
      }

      /**
       * 注册直播（data.modules->直播间组件，data.config->登录信息）
       * **/
      register(data) {
        if (!data) {
          throw new Error('Please fill in the valid data')
        }
        if (data.modules) {
          this.components(data.modules)
        }
        let params = data.config
        this.login({
          userId: params.userid || '40A53587B37573BD',
          roomId: params.roomid || '427DB068D5EAB1279C33DC5901307461',
          viewerName: params.viewername || '抖音BGM',
          viewerToken: params.viewertoken,
          groupId: '',
          viewerCustominfo: '',
          viewerCustomua: 'web',
          language: 'en',
          fastMode: (Utils.isMobile() ? true : params.fastMode),
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

      /**
       *
       * 组件注册
       * ***/
      components(modules = {}) {
        if (modules.length < 1) return
        for (let i in modules) {
          let classObj = modules[i]
          let m = new classObj()
          if (!m.name) {
            m.name = 'instance' + i
            Utils.log(module + ' can not find name property')
          } else {
            modulesMap[m.name] = m
          }
        }
      }

      static get instance() {
        if (!HDSceneMap.instance) {
          HDSceneMap.instance = new HDScene()
        }
        return HDSceneMap.instance
      }

      registerObject(name, mode) {
        if (!mode || !name) return
        let _mode = mode
        let key = name
        HDSceneMap[key] = _mode
        return _mode
      }

      getObjectForName(v) {
        return HDSceneMap[v] || {}
      }

    }

    window.HDScene = window.liveHDScene = window.HDScene = HDScene.instance

    HDScene.emit = HDScene.fire

  })()
}
let hd = new HD()
export default hd

















