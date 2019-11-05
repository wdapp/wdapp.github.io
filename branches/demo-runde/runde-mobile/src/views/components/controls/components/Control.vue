<template>
  <div class="control-wrapper">
    <div class="control-left">
      <div class="play-wrap">
        <span class="play-icon"></span>
      </div>
    </div>
    <div class="control-right">
      <ul class="btn-group">
        <li class="item full-screen-wrap">
          <span class="full-screen-icon"></span>
        </li>
        <li class="item barrage-wrap">
          <van-switch class="barrage-btn" v-model="checked" size="0.53333rem" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Control",
  data() {
    return {
      checked: false
    };
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.control-wrapper
  height 77px
  background rgba(5, 0, 1, 0.62)
  padding-left 26px
  padding-right 44px
  box-sizing border-box
  .control-left
    height 100%
    float left
    .play-wrap
      width-height-same(40px)
      vertical(40px)
      .play-icon
        bg-image('play', 40)
  .control-right
    height 100%
    float right
    .btn-group
      vertical(40px)
      .item
        float right
        margin-left 47px
      .item:last-child
        margin-left 0
      .item:last-child:after
        content ''
        clear both
      .barrage-wrap
        height 40px
        .barrage-btn
          border none
      .barrage-wrap:before
        content '123'
        color red
        position relative
        line-height 40px
      .full-screen-wrap
        width-height-same(40px)
        .full-screen-icon
          bg-image('full-screen', 40)
</style>
