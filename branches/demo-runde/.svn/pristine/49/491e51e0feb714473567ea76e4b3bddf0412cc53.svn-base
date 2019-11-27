<template>
  <div class="wrapper">
    <el-container class="container">
      <el-header class="header" height="80px">
        <live-header></live-header>
      </el-header>
      <el-main class="main">
        <el-row class="row">
          <el-col class="left" :span="17">
            <live-player></live-player>
          </el-col>
          <el-col class="right" :span="7">
            <live-chat></live-chat>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <remote-js @onremoted="onRemoted" src="//view.csslcloud.net/js/liveSDK.js"></remote-js>
  </div>
</template>

<script>
import LiveHeader from './components/Header'
import LivePlayer from './components/player/Player'
import LiveChat from './components/Chat'
import RemoteJs from 'common/remote-js/remote-js'

export default {
  name: 'LiveComputer',
  components: {
    LiveHeader,
    LivePlayer,
    LiveChat,
    RemoteJs
  },
  methods: {
    onRemoted () {

    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    .container
      .header
        padding 0
      .main
        background rgba(238, 233, 239, 1)
        layout-full(80px, 0, 0, 0)
        padding 29px 95px 100px
        .row
          width-height-full()
          min-width 869px
          max-width 1730px
          min-height 435px
          max-height 871px
          .left
            min-width 615px
            max-width 1230px
            height 100%
          .right
            min-width 240px
            max-width 500px
            height 100%
            padding-left 20px
</style>
