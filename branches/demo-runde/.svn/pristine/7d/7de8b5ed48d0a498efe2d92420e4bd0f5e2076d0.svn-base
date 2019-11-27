<template>
  <div class="wrapper">
    <div class="container">
      <header class="header">
        <replay-header :name="name"></replay-header>
      </header>
      <div class="main">
        <div class="left" :class="{ 'bespread': isBespread }">
          <replay-player @bespread="onBespread"></replay-player>
        </div>
        <div class="right" v-show="!isBespread">
          <replay-chat></replay-chat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReplayHeader from './components/header/Header'
import ReplayPlayer from './components/player/Player'
import ReplayChat from './components/chat/Chat'
import HuodeScene from 'common/websdk/replay'
import {log} from 'common/utils'
import {mapMutations} from 'vuex'

export default {
  name: 'Replay',
  components: {
    ReplayHeader,
    ReplayPlayer,
    ReplayChat
  },
  data () {
    return {
      name: '',
      isBespread: false
    }
  },
  methods: {
    init () {
      const options = JSON.parse(decodeURIComponent(this.$route.params.options))
      log('options', options)

      this.setOptions(options)

      this.HD = new HuodeScene()

      this.login(options)
    },
    login (options) {
      this.HD.login({
        userId: options.userid,
        roomId: options.roomid,
        recordId: options.recordid,
        viewerName: options.name || '获得场景视频',
        viewerToken: options.token || '',
        success: (result) => {
          log('onLoginSuccess', result)

          this.setDatas(result)

          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success'
          })
        },
        fail: (error) => {
          log('onLoginError', error)

          this.$message({
            showClose: true,
            message: '登录失败',
            type: 'error'
          })
        }
      })
    },
    setDatas (datas) {
      const viewer = datas.viewer
      this.setViewer(viewer)

      const template = datas.template
      this.setTemplate(template)

      this.name = viewer.name
    },
    onBespread (status) {
      this.isBespread = status
    },
    destroy () {
      this.HD && this.HD.destroy({
        success: () => {
          log('退出成功')
        },
        fail: () => {
          log('退出失败')
        }
      })
    },
    ...mapMutations(['setViewer', 'setOptions', 'setTemplate'])
  },
  mounted () {
    this.destroy()
    this.init()
  },
  destroyed () {
    this.destroy()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    .container
      width-height-full()
      position absolute
      overflow hidden
      .header
        min-width 831px; /*no*/
        position absolute
        width 100%
        z-index 1
      .main
        min-width 1441px; /*no*/
        background rgba(238, 233, 239, 1)
        layout-full(80px, 0, 0, 0)
        box-sizing border-box
        padding 29px 95px 100px
        .left
          width 1230px
          height 100%
          float left
        .bespread
          width 1730px
        .right
          box-sizing border-box
          padding-left 20px
          width 500px
          height 100%
          float left
</style>
