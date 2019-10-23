<template>
  <div class="player-header-wrapper">
    <div class="title-wrapper">
      <p class="text">{{title}}</p>
    </div>
    <div class="mobile-wrapper" v-show="isShowMobile" @click="handleMobileClick">
      <span class="mobile-icon"></span>
      <span class="mobile-text">移动端观看</span>
      <div
        class="qrcode-wrapper"
        v-show="isShowQrcode"
      >
        <el-image
          class="qrcode-image"
          :src="codeSrc"
          :fit="fit">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>
    <div class="online-users" v-show="isShowOnlineUsers">
      <span class="users-icon"></span>
      <span class="users-number">{{count}}</span>
      <span class="users-text">人正在观看</span>
    </div>
  </div>
</template>

<script>
import HuodeScene from 'common/websdk/live'

export default {
  name: 'PlayerHeader',
  data () {
    return {
      isShowMobile: false,
      isShowOnlineUsers: false,
      title: '【中】2019年终极保过班 | 中药学综合知识与技能',
      count: 0,
      codeSrc: require('images/qrcode.png'),
      fit: 'contain',
      isShowQrcode: false
    }
  },
  methods: {
    addEvents (hd) {
      hd.onUserCount((count) => {
        this.count = count
      })
    },
    handleMobileClick () {
      this.isShowQrcode = !this.isShowQrcode
    }
  },
  mounted () {
    const HD = new HuodeScene()

    this.addEvents(HD)
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .player-header-wrapper
    height 70px
    box-sizing border-box
    padding-left 37px
    padding-right 33px
    .title-wrapper
      baseTextStyle(20px, $primaryTextColor, $boldFontWeight, $genelFontFamily)
      line-height 70px
      max-width 750px
      float left
      .text
        ellipsis()
    .online-users
      user-select none
      margin-right 48px
      height 100%
      width 211px
      float right
      baseTextStyle()
      line-height 70px
      .users-icon
        display inline-block
        background-image url("~images/users.png")
        background-size 30px
        width-height-same(30px)
        margin-right 10px
        vertical-align middle
      .users-number
        vertical-align middle
        display inline-block
        max-width 80px
        ellipsis()
      .users-text
        vertical-align middle
    .mobile-wrapper
      position relative
      float right
      cursor-pointer()
      baseTextStyle()
      line-height 70px
      .mobile-icon
        margin-right 6px
        display inline-block
        background-size 30px
        width-height-same(30px)
        background-image url("~images/phone.png")
        vertical-align middle
      .mobile-text
        vertical-align middle
      .qrcode-wrapper
        position absolute
        z-index 1
        top 64px
        left -44px
        border 1px solid $dullGreyColor; /*no*/
        border-radius 8px; /*no*/
        background-color $baseWhiteColor
        width-height-same(150px)
        .qrcode-image
          width-height-full()
          border-radius 8px; /*no*/
          >>> .image-slot
            width-height-full()
            line-height 150px
            text-align center
            .el-icon-picture-outline
              width-height-same(24px)
      .qrcode-wrapper::before
        content ' '
        display inline-block
        position absolute
        width 10px; /*no*/
        height 10px; /*no*/
        border 1px solid $grayColor; /*no*/
        z-index 1
        border-bottom-color transparent
        border-right-color transparent
        transform rotate(45deg)
        top -6px; /*no*/
        right 31px; /*no*/
        background-color $baseWhiteColor
</style>
