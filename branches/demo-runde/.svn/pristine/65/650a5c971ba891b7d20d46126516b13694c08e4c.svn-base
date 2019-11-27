<template>
  <div class="header-wrapper">
    <div class="navigation-wrap">
      <div class="title-wrapper">
        <el-image
          class="title-image"
          :src="title"
          :fit="fit"
        ></el-image>
      </div>
      <div class="breadcrumb">
        <el-breadcrumb separator="">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">技能大赛</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">所有课程</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">直播课程</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }">继续教育</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-wrap">
        <el-avatar class="header-avatar" :size="40" :src="header">
          <i class="el-icon-user-solid"></i>
        </el-avatar>
        <span class="header-name">
          {{this.name}}
        </span>
        <i class="el-icon-caret-bottom"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    name: ''
  },
  data () {
    return {
      title: require('images/title.png'),
      header: require('images/header.png'),
      fit: 'contain'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .header-wrapper
    height 80px
    background-color $baseWhiteColor
    box-shadow: 0px 2px 3px 0px rgba(221, 221, 221, 1); /*no*/
    .navigation-wrap
      height 100%
      padding-left 44px
      padding-right 43px
      .title-wrapper
        float left
        width 216px
        height 51px
        margin-right 84px
        position relative
        top 50%
        margin-top -25.5px
        .title-image
          width-height-full()
      .breadcrumb
        float left
        margin-top 39px
        >>> .el-breadcrumb
          .el-breadcrumb__item
            .el-breadcrumb__inner
              baseTextStyle(18px)
              cursor-pointer()
            .el-breadcrumb__separator
              margin 0 18px
      .header-wrap
        float right
        line-height 80px
        .header-avatar
          margin-right 12px
          vertical-align middle
        .header-name
          display inline-block
          max-width 145px
          margin-right 14px
          baseTextStyle()
          ellipsis()
          vertical-align middle
        .el-icon-caret-bottom
          color #BCBCBC
          vertical-align middle
</style>
