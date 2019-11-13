<template>
  <div class="lists-wrapper" ref="wrapper">
    <ol class="list-wrap">
      <li
        class="item"
        v-for="(list, index) of lists"
        :key="index"
        @click="handleClick(list.name, list.url)"
      >
        <span class="list-index">{{ index + 1 }}</span>
        <div class="list-desc">
          <div class="list-title">{{ list.title }}</div>
          <span class="list-subhead">{{ list.subhead }}</span>
          <span class="list-status" :class="{ live: list.status }">
            <span class="tip">{{ list.tip }}</span>
          </span>
        </div>
        <div class="list-control">
          <span class="list-control-btn" :class="list.control"></span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { mapState } from "vuex";
import { log } from "common/utils";
export default {
  name: "Lists",
  computed: {
    ...mapState(["lists"])
  },
  methods: {
    handleClick(name, url) {
      log(name, url);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      });
    });
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.lists-wrapper
  layout(0,0,0,0)
  background-color $fff
  .list-wrap
    padding-left 40px
    box-sizing border-box
    .item
      padding-right 26px
      box-sizing border-box
      height 150px
      border-bottom 1px solid $ddd
      display flex
      flex-direction row
      align-items center
      .list-index
        margin-right 43px
        baseTextStyle(30px, $c666, $boldFontWeight)
      .list-desc
        flex 1
        min-width 0
        .list-title
          ellipsis()
          baseTextStyle(30px, $c333, $boldFontWeight)
          margin-bottom 21px
        .list-subhead
          vertical-align middle
          display inline-block
          margin-right 14px
          ellipsis()
          baseTextStyle(24px, $c999)
        .list-status
          vertical-align middle
          display inline-block
          width 82px
          height 34px
          border 1px solid $c999
          border-radius 4px
          baseTextStyle(22px, $c999, 400, $boldFontWeight)
          text-align center
          line-height 34px
        .live
          border-color $red
          color $red
      .list-control
        width 50px
        height 50px
        .list-control-btn
          bg-image('lists/play',50)
        .playing
          active-image('lists/playing')
        .replay
          active-image('lists/replay')
        .replay_disabled
          active-image('lists/replay_disabled')
</style>
