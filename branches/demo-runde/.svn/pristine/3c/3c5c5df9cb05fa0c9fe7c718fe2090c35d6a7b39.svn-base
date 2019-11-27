<template>
  <div class="panel-wrapper">
    <div class="panel-left">
      <div class="panel-info">
        <p class="panel-name" :class="arrange">
          {{ name }}
        </p>
        <span class="panel-number">{{ number }}</span>
        <span class="panel-text">人在看</span>
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
    arrange: {
      type: String,
      default: "response"
    }
  },
  data() {
    return {
      name: "王波波老师王波波老师王波波老师王波波老师",
      number: 9999999999999
    };
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.panel-wrapper
  wrapper()
  padding-left 30px
  padding-right 30px
  box-sizing border-box
  .panel-left
    height 100%
    float left
    display table
    .panel-info
      display table-cell
      vertical-align middle
      line-height 40px
      .panel-name
        baseTextStyle(32px, $c333, $boldFontWeight, $baseFontFamily)
        max-width 221px
        ellipsis()
        margin-right 5px
      .line
        float left
      .response
        float none
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
    height 100%
    .gift-btn-wrap
      width 150px
      height 60px
      background rgba(255, 255, 255, 0)
      border 1px solid rgba(254, 153, 42, 1)
      border-radius 8px
      vertical(60px)
      .gift-icon
        bg-image('gift', 40)
        vertical-align middle
        margin-left 13px
      .gift-text
        baseTextStyle(28px, #FE992A, $boldFontWeight, $baseFontFamily)
        line-height 60px
        vertical-align middle
        margin-left 5px
</style>
