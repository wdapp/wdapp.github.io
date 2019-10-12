<template>
  <div class="wrapper">
    <el-container class="container">
      <el-header class="header" height="70px">
        <live-player-header></live-player-header>
      </el-header>
      <el-main class="main">

      </el-main>
      <el-footer class="footer" height="80px">

      </el-footer>
    </el-container>
  </div>
</template>

<script>
import LivePlayerHeader from './components/PlayerHeader'

export default {
  name: 'LivePlayer',
  components: {
    LivePlayerHeader
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    wrapper()
    min-width 886px
  .container
    width-height-full()
    .header
      padding 0
    .main
      padding 0
    .footer
      background-color #4bb1cf
</style>
