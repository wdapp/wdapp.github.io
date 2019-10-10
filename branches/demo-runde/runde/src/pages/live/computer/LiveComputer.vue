<template>
  <div class="wrapper">
    <el-container class="container">
      <el-header class="header" height="80px">
        Header
      </el-header>
      <el-main class="main">
        <el-row class="row">
          <el-col class="left" :span="16">

          </el-col>
          <el-col class="right" :span="8">

          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'live'
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
          height 100%
          width 100%
          background-color #0b97c4
          .left
            background-color #9c95ef
            height 100%
            width 1230px
          .right
            background-color #b58900
            height 100%
            width 480px
</style>
