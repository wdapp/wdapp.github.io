<template>
  <div class="panel-wrapper">
    <div class="panel-left">
      <div class="panel-info">
        <p class="panel-name">
          {{ name }}
        </p>
        <p class="panel-number-wrap">
          <span class="panel-number">{{ number }}</span>
          <span class="panel-text">人在看</span>
        </p>
      </div>
    </div>
    <div class="panel-right">
      <div class="gift-btn-wrap">
        <span class="gift-icon"></span>
        <span class="gift-text">送礼物</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    name: {
      type: String,
      default: ""
    },
    number: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.panel-wrapper
  height 100%
  background-color $fff
  padding-left 30px
  padding-right 30px
  box-sizing border-box
  display flex
  flex-direction row
  justify-content space-between
  align-items center
  .panel-left
    .panel-info
      overflow hidden
      .panel-name
        float left
        baseTextStyle(32px, $c333, $boldFontWeight, $baseFontFamily)
        width 221px
        ellipsis()
        line-height 49px
      .panel-number-wrap
        float left
        line-height 49px
        .panel-number
          baseTextStyle(28px, #969494, $baseFontWeight, $baseFontFamily)
          display inline-block
          max-width 142px
          ellipsis()
          vertical-align middle
        .panel-text
          baseTextStyle(28px, #969494, $baseFontWeight, $baseFontFamily)
          vertical-align middle
  .panel-right
    float right
    .gift-btn-wrap
      margin 30px 0
      box-sizing border-box
      width 150px
      height 60px
      border 1px solid $FE992A
      border-radius 8px
      .gift-icon
        bg-image('gift', 40)
        vertical-align middle
        margin-left 13px
      .gift-text
        baseTextStyle(28px, $FE992A, $boldFontWeight, $baseFontFamily)
        line-height 60px
        vertical-align middle
        margin-left 5px
</style>
