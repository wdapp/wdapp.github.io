<template>
  <div class="wrapper">
    <div class="container">
      <header class="header">
        <live-header></live-header>
      </header>
      <div class="main">
        <div class="left">
          <live-player></live-player>
        </div>
        <div class="right">
          <live-chat></live-chat>
        </div>
      </div>
    </div>
<!--    <remote-js src="//view.csslcloud.net/js/jquery-1.9.0.min.js"></remote-js>-->
<!--    <remote-js @onremoted="onRemoted" src="//view.csslcloud.net/js/liveSDK.js"></remote-js>-->
  </div>
</template>

<script>
import LiveHeader from './components/Header'
import LivePlayer from './components/player/Player'
import LiveChat from './components/Chat'
import RemoteJs from 'common/remote-js/remote-js'
import FlashTip from 'common/flashtip'
import HD from 'common/websdk/live'

export default {
  name: 'LiveComputer',
  components: {
    LiveHeader,
    LivePlayer,
    LiveChat,
    RemoteJs
  },
  methods: {
    // onRemoted () {
    //   HD.login()
    // }
  },
  mounted () {
    console.log(HD)
    HD.login()
    FlashTip.init('player')
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    .container
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
        .right
          box-sizing border-box
          padding-left 20px
          width 500px
          height 100%
          float left
</style>
