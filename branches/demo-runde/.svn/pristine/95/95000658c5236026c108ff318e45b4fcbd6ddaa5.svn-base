<template>
  <div class="chat-tabs-wrapper">
    <el-tabs class="tabs-wrap" v-model="activeTabs">
      <el-tab-pane label="聊天" name="chats">
        <slot name="chats"></slot>
      </el-tab-pane>
      <el-tab-pane label="直播目录" name="lists">
        <slot name="lists"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'ChatTabs',
  data () {
    return {
      activeTabs: 'chats'
    }
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .chat-tabs-wrapper
    position relative
    wrapper()
    >>> .tabs-wrap
      wrapper()
      .el-tabs__header
        margin-bottom 0
        .el-tabs__nav-wrap
          .el-tabs__nav-scroll
            height 70px
            line-height 70px
            .el-tabs__nav
              margin-left 56px
              .el-tabs__item
                baseTextStyle(18px, $primaryTextColor, $boldFontWeight, $genelFontFamily)
                padding-right 41px
              .el-tabs__item:last-child
                padding-left 41px
              .is-active
                color $baseRedColor
              .el-tabs__active-bar
                border-radius 3px; /*no*/
                height 5px
                background-color $baseRedColor
                bottom 10px
      .el-tabs__content
        layout-full(70px, 0, 0, 0)
        .el-tab-pane
          width-height-full()
</style>
