<template>
  <div class="wrapper">
    <el-container class="container">
      <el-header class="header" height="80px">
        Header
      </el-header>
      <el-main class="main">
        <el-row class="row">
          <el-col class="left" :span="18">

          </el-col>
          <el-col class="right" :span="6">

          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <remote-js @remoted="onRemoted" src="//view.csslcloud.net/js/liveSDK.js"></remote-js>
  </div>
</template>

<script>
import RemoteJs from 'common/remote-js/remote-js'

export default {
  name: 'LiveComputer',
  components: {
    RemoteJs
  },
  methods: {
    onRemoted () {

    }
  }
}
</script>

<style lang="stylus" scoped>
  .wrapper
    .container
      .header
        background pink
      .main
        background rgba(238, 233, 239, 1)
        position absolute
        top 80px
        left 0
        right 0
        bottom 0
        padding 29px 95px 100px
        .row
          background-color #0b97c4
          height 100%
          min-height 435px
          width 100%
          min-width 865px
          .left
            background-color #9c95ef
            height 100%
          .right
            background-color #b58900
            height 100%
            padding-left 20px
</style>
