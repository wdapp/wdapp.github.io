<template>
  <div class="live-lists-wrapper" ref="wrapper">
    <ol class="list-wrap">
      <li class="item" v-for="(list, index) of lists" :key="index">
        <span class="list-index">{{index + 1}}</span>
        <div class="list-desc">
          <div class="list-title">{{list.title}}</div>
          <span class="list-subhead">{{list.subhead}}</span>
          <span
            class="list-status"
            :class="{'live': list.status}"
          >
            <span class="tip">{{list.tip}}</span>
          </span>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: 'LiveLists',
  data () {
    return {
      lists: [
        {
          title: '中药一闭关刷题直播（第1期）',
          subhead: '8月14日  15:00 - 16:00 王波波',
          tip: '已结束',
          status: false
        }, {
          title: '中药一闭关刷题直播（第1期）',
          subhead: '8月14日  15:00 - 16:00 王波波',
          tip: '直播中',
          status: true
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .live-lists-wrapper
    wrapper()
    .list-wrap
      padding-left 20px
      box-sizing border-box
      .item
        height 90px
        border-bottom 1px solid $dullGreyColor
        .list-index
          float left
          line-height 90px
          margin-right 25px
          baseTextStyle(18px, $baseBlackColor, $boldFontWeight, $genelFontFamily)
        .list-desc
          float left
          .list-title
            width 300px
            ellipsis()
            baseTextStyle(18px, $baseBlackColor, $boldFontWeight, $genelFontFamily)
            margin-top 25px
            margin-bottom 8px
          .list-subhead
            vertical-align middle
            display inline-block
            max-width 300px
            margin-right 14px
            ellipsis()
            baseTextStyle(14px, $betterGreyColor, 400, $genelFontFamily)
          .list-status
            vertical-align middle
            display inline-block
            width 51px
            height 18px
            border 1px solid $darkGrayColor
            border-radius 4px
            baseTextStyle(12px, $betterGreyColor, 400, $genelFontFamily)
            text-align center
            line-height 18px
            .tip
              display inline-block
              transform scale(0.8)
          .live
            border-color $baseRedColor
            color $baseRedColor
</style>
