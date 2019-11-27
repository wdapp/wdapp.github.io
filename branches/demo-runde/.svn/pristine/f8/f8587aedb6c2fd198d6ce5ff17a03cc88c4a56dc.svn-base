<template>
  <div class="live-lists-wrapper" ref="wrapper">
    <ol class="list-wrap">
      <li
        class="item"
        v-for="(list, index) of lists"
        :key="index"
        @click="handleClick(list.name, list.url)"
      >
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
import {mapState, mapMutations, mapGetters} from 'vuex'
import {isAddress, log} from 'common/utils'
import BScroll from 'better-scroll'

export default {
  name: 'LiveLists',
  data () {
    return {
      lists: []
    }
  },
  computed: {
    ...mapState({
      stateLists: 'lists'
    }),
    ...mapGetters(['getOptions'])
  },
  methods: {
    ...mapMutations(['changeUrl']),
    handleClick (name, url) {
      var as = isAddress(url)
      if (as) {
        this.changeUrl(url)
        const options = encodeURIComponent(JSON.stringify(this.getOptions))
        const oldName = this.$route.name
        if (oldName === name) {
          this.routerToTransfer(name, options)
          log('routerToTransfer')
        } else {
          this.routerTo(name, options)
          log('routerTo')
        }
        // this.$router.go(0)
      } else {
        this.$message({
          showClose: true,
          message: '观看地址不正确',
          type: 'warning'
        })
      }
    },
    routerToTransfer (name, options) {
      this.$router.push({
        name: 'Transfer',
        params: {
          name: name,
          options: options
        }
      })
    },
    routerTo (name, options) {
      this.$router.push({
        name: name,
        params: {
          options: options
        }
      })
    }
  },
  mounted () {
    this.lists = this.stateLists

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
