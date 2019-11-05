<template>
  <div class="control-wrapper">
    <div class="control-left">
      <div class="play-wrap">
        <span class="play-icon" :class="{ active: playStatus }"></span>
      </div>
    </div>
    <div class="control-right">
      <ul class="btn-group">
        <li class="item full-screen-wrap">
          <span
            class="full-screen-icon"
            :class="{ active: screenStatus }"
          ></span>
        </li>
        <li class="item barrage-wrap">
          <van-switch
            class="barrage-btn"
            v-model="checked"
            size="0.53333rem"
            active-color="#2196F3"
            inactive-color="#999999"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Control",
  props: {
    playStatus: {
      type: Boolean,
      default: false
    },
    screenStatus: {
      type: Boolean,
      default: false
    }
  },
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
      .active
        active-image('pause')
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
        content '弹幕'
        line-height 40px
        height 100%
        float left
        baseTextStyle(26px, #D8D8D8, normal, Adobe Heiti Std)
        margin-right 18px
      .full-screen-wrap
        width-height-same(40px)
        .full-screen-icon
          bg-image('full-screen', 40)
        .active
          active-image('small-screen')
</style>
