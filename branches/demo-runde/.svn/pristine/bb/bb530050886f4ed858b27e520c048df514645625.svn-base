<template>
  <div class="player-footer-wrapper">
    <div class="left">
      <div
        class="reward-wrap"
        @mouseenter="mouseEnterReward"
        @mouseleave="mouseLeaveReward"
        @click="handleRewardClick"
      >
        <span class="reward-image"></span>
        <span class="reward-text">打赏</span>
        <div
          class="reward-qrCode-wrap"
          v-show="isShowRewardQRCode"
        >
          <div class="reward-qrCode-title-wrap">
            <p class="reward-qrCode-title">
              扫描二维码支付打赏老师
            </p>
          </div>
          <div class="reward-qrCode-img-wrap">
            <img
              class="reward-qrCode-img"
              :src="qrCodeSrc"
            />
          </div>
        </div>
      </div>
      <div class="evaluation-wrap">
        <span class="evaluation-image"></span>
        <span class="evaluation-text">评价</span>
      </div>
    </div>
    <div class="right">
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
          @click.native="handleSwiperClick"
        >
          <swiper-slide
            class="item"
            v-for="(option, index) in giftOptions"
            :key="index"
            @click.native="handleClickGift(option.url, option.customName)"
            @mouseenter.native="mouseEnterGift"
          >
            <img
              class="image"
              :src="option.url"
            />
          </swiper-slide>
        </swiper>
        <span class="arrow-right"
              :class="{'disabled': disabledRight}"
              @click="handleSlidePrevClick"
        >
          <i class="el-icon-arrow-right"></i>
        </span>
        <div
          class="gift-panel-wrap"
          v-show="isShowGiftPanel"
          @mouseleave="mouseLeaveGift"
          ref="Panel"
        >
          <div class="gift-panel-left">
            <div class="gift-panel-img-wrap">
              <img
                class="gift-panel-img"
                :src="selectGift.giftUrl"
              />
            </div>
          </div>
          <div class="gift-panel-right">
            <div class="gift-panel-title-wrap">
              <p class="gift-panel-title">{{selectGift.giftCustomName}}</p>
              <span class="gift-panel-subhead">赠送数量</span>
            </div>
            <div class="gift-panel-number-wrap">
              <div class="item gift-panel-number"
                   v-for="(option, key) in giveOptions"
                   :key="key"
                   :class="{'gift-active': option.active}"
                   @click="giveGift(key, option.number)"
              >
                {{option.number}}
              </div>
            </div>
          </div>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {log} from 'common/utils'
import HuodeScene from 'common/websdk/live'
import {mapState} from 'vuex'

export default {
  name: 'PlayerFooter',
  data () {
    return {
      disabledLeft: false,
      disabledRight: true,
      swiperLength: 0,
      swiperOption: {
        slidesPerView: 6,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
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
      giftUrl: 'https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/',
      giftNames: [{
        name: 'gift1',
        customName: '礼物1'
      }, {
        name: 'gift2',
        customName: '礼物2'
      }, {
        name: 'gift3',
        customName: '礼物3'
      }, {
        name: 'gift1',
        customName: '礼物4'
      }, {
        name: 'gift2',
        customName: '礼物5'
      }, {
        name: 'gift3',
        customName: '礼物6'
      }, {
        name: 'gift1',
        customName: '礼物7'
      }, {
        name: 'gift2',
        customName: '礼物8'
      }],
      isShowGiftPanel: false,
      giveOptions: [{
        number: 1,
        active: false
      }, {
        number: 5,
        active: false
      }, {
        number: 10,
        active: false
      }],
      selectGift: {
        giftMsg: '',
        giftUrl: '',
        giftCustomName: ''
      },
      qrCodeSrc: require('images/qrcode.png'),
      isShowRewardQRCode: false
    }
  },
  computed: {
    ...mapState(['viewer']),
    giftOptions () {
      const options = []
      const postfix = '.png'
      const giftUrl = this.giftUrl
      const giftNames = this.giftNames
      giftNames.forEach(function (item, index) {
        const option = {
          url: giftUrl + item.name + postfix,
          name: item.name,
          customName: item.customName
        }
        options.push(option)
      })
      return options
    },
    Panel () {
      return this.$refs.Panel
    },
    Swiper () {
      return this.$refs.Swiper
    },
    fontSize () {
      const fontSize = document.getElementsByTagName('html')[0].style.fontSize
      return parseFloat(fontSize)
    }
  },
  methods: {
    init () {
      this.HD = new HuodeScene()

      this.swiper = this.Swiper.swiper
      this.swiperLength = this.giftOptions.length - this.swiperOption.slidesPerView
      if (this.swiperLength <= 0) {
        this.disabledLeft = true
        this.disabledRight = true
      }
    },
    mouseEnterReward () {
      this.isShowRewardQRCode = true
    },
    mouseLeaveReward () {
      this.isShowRewardQRCode = false
    },
    handleRewardClick () {
      const url = this.giftUrl + 'gift2.png'
      const msg = '打赏给老师[cem_' + url + ']￥100'
      this.HD.sendPublicChatMsg(msg)
    },
    handleClickGift (url, customName) {
      const msg = '赠送给老师[cem_' + url + ']x'
      this.selectGift = {
        giftMsg: msg,
        giftUrl: url,
        giftCustomName: customName
      }
      this.isShowGiftPanel = !this.isShowGiftPanel
    },
    handleSwiperClick (event) {
      const offsetLeft = this.offset(this.Swiper.$el).left
      const clientX = event.clientX
      const targetX = clientX - offsetLeft
      const swiperWidth = this.Swiper.$el.clientWidth
      const space = swiperWidth / 6
      const index = Math.floor(targetX / space)
      const panelWidth = this.Panel.clientWidth
      const offsetX = (78 + 30) / 192 * this.fontSize
      const panelLeft = (index * space) - (panelWidth - offsetX) + 'px'
      this.Panel.style.left = panelLeft
    },
    offset (curEle) {
      let totalLeft = null
      let totalTop = null
      let par = curEle.offsetParent
      // 首先把自己本身的进行累加
      totalLeft += curEle.offsetLeft
      totalTop += curEle.offsetTop

      // 只要没有找到body，我们就把父级参照物的边框和偏移量累加
      while (par) {
        if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
          // 不是标准的ie8浏览器，才进行边框累加
          // 累加父级参照物边框
          totalLeft += par.clientLeft
          totalTop += par.clientTop
        }
        // 累加父级参照物本身的偏移
        totalLeft += par.offsetLeft
        totalTop += par.offsetTop
        par = par.offsetParent
      }
      return {
        left: totalLeft,
        top: totalTop
      }
    },
    mouseEnterGift () {
      this.isShowGiftPanel = false
    },
    mouseLeaveGift () {
      this.isShowGiftPanel = false
    },
    giveGift (key, number) {
      for (let i = 0; i < this.giveOptions.length; i++) {
        this.giveOptions[i].active = false
      }
      this.giveOptions[key].active = true
      const msg = this.selectGift.giftMsg + number
      this.HD.sendPublicChatMsg(msg)
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
        position relative
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
        .reward-qrCode-wrap
          position absolute
          bottom 85px
          left -20px
          width 273px
          height 259px
          background linear-gradient(0deg, rgba(255, 88, 107, 1) 0%, rgba(255, 106, 89, 1) 100%)
          border-radius 10px; /*no*/
          .reward-qrCode-title-wrap
            width 100%
            text-align center
            margin-top 32px
            line-height 24px
            .reward-qrCode-title
              baseTextStyle(18px, $baseWhiteColor, bold)
          .reward-qrCode-img-wrap
            margin 14px auto 0
            width 150px
            height 149px
            .reward-qrCode-img
              width 150px
              height 149px
        .reward-qrCode-wrap:after
          content ''
          width-height-same(0)
          border 10px solid transparent; /*no*/
          border-top-color rgba(255, 88, 107, 1)
          position absolute
          bottom -19px
          left 73px
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
        .gift-panel-wrap
          position absolute
          bottom 80px
          left 0
          z-index 1
          width 378px
          min-height 136px
          border 1px solid $dullGreyColor; /*no*/
          border-radius 10px; /*no*/
          background $baseWhiteColor
          box-sizing border-box
          padding-left 21px
          padding-top 19px
          .gift-panel-left
            float left
            height 100%
            .gift-panel-img-wrap
              width-height-same(88px)
              .gift-panel-img
                width-height-same(88px)
          .gift-panel-right
            float left
            margin-left 21px
            .gift-panel-title-wrap
              .gift-panel-title
                baseTextStyle(18px, $primaryTextColor, bold)
              .gift-panel-subhead
                display inline-block
                margin-top 12px
                baseTextStyle(12px, $betterGreyColor)
            .gift-panel-number-wrap
              margin-top 13px
              .item
                float left
                width 60px
                height 33px
                border 1px solid $dullGreyColor; /*no*/
                border-radius 4px; /*no*/
                line-height 33px
                text-align center
                baseTextStyle(18px, $primaryTextColor)
                margin-right 20px
                cursor-pointer()
              .item:last-child
                margin-right 0
              .gift-active
                background-color $baseRedColor
                color $baseWhiteColor
          .el-icon-caret-bottom
            color $baseWhiteColor
            position absolute
            bottom -15px
            right 78px
            font-size 25px
</style>
