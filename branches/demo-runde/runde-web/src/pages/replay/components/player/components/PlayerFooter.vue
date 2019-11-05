<template>
  <div class="player-footer-wrapper">
    <div class="left">
      <div class="reward-wrap" v-show="isShowReward">
        <span class="reward-image"></span>
        <span class="reward-text">打赏</span>
      </div>
      <div class="evaluation-wrap">
        <span class="evaluation-image"></span>
        <span class="evaluation-text">评价</span>
      </div>
    </div>
    <div class="right" v-show="isShowRight">
      <div class="swiper-wrap">
        <span class="arrow-left"
              :class="{'disabled': disabledLeft}"
              @click="handleSlideNextClick"
        >
          <i class="el-icon-arrow-left"></i>
        </span>
        <swiper
          :options="swiperOption"
          ref="Swiper"
        >
          <swiper-slide
            class="item"
            v-for="(url, index) in imageUrls"
            :key="index"
          >
            <img
              class="image"
              :src="url"
            />
          </swiper-slide>
        </swiper>
        <span class="arrow-right"
              :class="{'disabled': disabledRight}"
              @click="handleSlidePrevClick"
        >
          <i class="el-icon-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {log} from 'common/utils'

export default {
  name: 'PlayerFooter',
  data () {
    return {
      isShowReward: false,
      isShowRight: false,
      disabledLeft: false,
      disabledRight: true,
      swiperLength: 0,
      swiperOption: {
        slidesPerView: 6,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 14,
        on: {
          slideChange: () => {
            if (this.swiperLength <= 0) {
              return false
            }
            log('activeIndex', this.swiper.activeIndex)
            if (this.swiper.activeIndex <= 0) {
              this.disabledRight = true
            } else {
              this.disabledRight = false
            }
            if (this.swiper.activeIndex >= this.swiperLength) {
              this.disabledLeft = true
            } else {
              this.disabledLeft = false
            }
          }
        }
      },
      imageUrls: [
        require('images/gifts/gift1.png'),
        require('images/gifts/gift2.png'),
        require('images/gifts/gift3.png'),
        require('images/gifts/gift1.png'),
        require('images/gifts/gift2.png'),
        require('images/gifts/gift3.png'),
        require('images/gifts/gift1.png'),
        require('images/gifts/gift2.png'),
        require('images/gifts/gift3.png'),
        require('images/gifts/gift1.png'),
        require('images/gifts/gift2.png'),
        require('images/gifts/gift3.png')
      ]
    }
  },
  methods: {
    init () {
      this.swiper = this.$refs.Swiper.swiper
      this.swiperLength = this.imageUrls.length - this.swiperOption.slidesPerView
      if (this.swiperLength <= 0) {
        this.disabledLeft = true
        this.disabledRight = true
      }
    },
    handleSlideNextClick () {
      if (this.swiperLength <= 0) {
        return false
      }
      this.swiper.slideNext()
    },
    handleSlidePrevClick () {
      if (this.swiperLength <= 0) {
        return false
      }
      this.swiper.slidePrev()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-footer-wrapper
    wrapper()
    padding-left 31px
    padding-right 20px
    box-sizing border-box
    .left
      float left
      height 100%
      .reward-wrap
        float left
        height 100%
        line-height 80px
        margin-right 44px
        cursor-pointer()
        .reward-image
          width-height-same(50px)
          display inline-block
          background url("~images/reward.png") no-repeat
          background-size 50px
          vertical-align middle
          margin-right 9px
        .reward-text
          baseTextStyle(18px)
          vertical-align middle
      .evaluation-wrap
        float left
        height 100%
        line-height 80px
        cursor-pointer()
        .evaluation-image
          width-height-same(50px)
          display inline-block
          background url("~images/evaluation.png") no-repeat
          background-size 50px
          vertical-align middle
          margin-right 7px
        .evaluation-text
          baseTextStyle(18px)
          vertical-align middle
    .right
      float right
      height 100%
      .swiper-wrap
        width 448px
        position relative
        top 50%
        left -30px
        margin-top -30px
        >>> .swiper-container
          .swiper-wrapper
            .item
              width 60px !important
              height 60px !important
              background $baseWhiteColor
              border 1px solid $dullGreyColor
              margin-right 15px
              .image
                cursor-pointer()
                width-height-same(55px)
                position relative
                top 50%
                left 50%
                margin-left -27.5px
                margin-top -27.5px
        .arrow-left
          border-radius 10px 0px 0px 10px; /*no*/
          left -30px
        .arrow-right
          border-radius 0px 10px 10px 0px; /*no*/
          right -30px
        .arrow-left, .arrow-right
          position absolute
          top 50%
          margin-top -30px
          width 15px
          height 60px
          display inline-block
          text-align center
          line-height 60px
          cursor-pointer()
          background-color $baseRedColor
          .el-icon-arrow-left, .el-icon-arrow-right
            font-size 15px
            color $baseWhiteColor
            font-weight 1000
        .disabled
          background-color $darkGrayColor
</style>
