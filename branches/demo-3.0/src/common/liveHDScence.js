//所有对象的入口类
import 'babel-polyfill' //IE 9 兼容 ECMAScript 6
import LiveAdaptive from './liveAdaptive'
import Utils from 'common/utils' //公共方法库
let HD = function () {
  return (function () {

    let HDScenceMap = {}

    let modulesMap = {}

    class HDScence extends LiveAdaptive {

      constructor() {
        super()
        Utils.log({
          debug: Utils.debug,
          PATH: Utils.PATH,
          useragent: Utils.useragent,
          version: Utils.version,
          timestamp: Utils.timestamp,
          tag: Utils.tag,
        })
      }

      ready(callback, useCapture = false) {
        window.addEventListener('DOMContentLoaded', callback, useCapture)
      }

      onOrientationChange(callback, useCapture = false) {
        window.addEventListener('orientationchange', callback, useCapture)
      }

      onResize(callback, useCapture = false) {
        window.removeEventListener('resize', callback, useCapture)
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
          fastMode: (Utils.isMobile() ? true : params.fastMode) || true,
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
            modulesMap[m.name] = m
          }
        }
      }

      static get instance() {
        if (!HDScenceMap.instance) {
          HDScenceMap.instance = new HDScence()
        }
        return HDScenceMap.instance
      }

      registerObject(name, mode) {
        if (!mode || !name) return
        let _mode = mode
        let key = name
        HDScenceMap[key] = _mode
        return _mode
      }

      getObjectForName(v) {
        return HDScenceMap[v] || {}
      }

    }

    window.HDScence = window.liveHDScence = window.hdScence = HDScence.instance

    HDScence.emit = HDScence.fire

  })()
}
let hd = new HD()
export default hd

















