<template>
  <div class="chat-chats-wrapper">
    <div class="top">
      <div class="chat-wrap" ref="wrapper">
        <div class="chat-group">
          <div class="chat-item" v-for="(message, index) of messages" :key="index">
            <img class="header" :src="message.avatar"/>
            <span class="name" :class="message.type">{{message.name}}</span>
            <span class="separator" :class="message.type">:</span>
            <span class="content" v-html="message.content"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <hd-praise class="praise"></hd-praise>
      <div class="btn-group">
        <div class="btn-wrap emoticon-btn-wrap">
          <span class="emoticon-btn-icon"></span>
        </div>
        <div class="btn-wrap one-btn-wrap">
          <span class="one-btn-text">扣1</span>
        </div>
        <div class="btn-wrap two-btn-wrap">
          <span class="two-btn-text">扣2</span>
        </div>
        <div class="only-ready-wrap">
          <el-checkbox v-model="checked"></el-checkbox>
          <span class="only-ready-text">只看老师</span>
        </div>
      </div>
      <div class="input-wrap">
        <el-input
          class="textarea"
          type="textarea"
          :rows="2"
          placeholder="在这里和老师互动哦"
          v-model="text">
        </el-input>
        <el-button class="send-btn" type="primary">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import hdPraise from 'common/components/praise/Praise'

export default {
  name: 'ChatChats',
  components: {
    hdPraise
  },
  data () {
    return {
      text: '',
      checked: false,
      messages: [
        {
          type: 'teacher',
          avatar: require('images/header2.png'),
          name: '讲师',
          content: '大家好啊！！！'
        }, {
          type: 'assistant',
          avatar: require('images/header2.png'),
          name: '助教',
          content: '123456789123456789<img src="//static.csslcloud.net/img/em2/02.png" border="0">123456789123456789123456789123456789123456789'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '获得场景视频',
          content: '<img src="//static.csslcloud.net/img/em2/02.png" border="0">'
        }, {
          type: 'self',
          avatar: require('images/header2.png'),
          name: 'vip hello world vip vip vip',
          content: '恭喜你中奖啦<img src="//static.csslcloud.net/img/em2/02.png" border="0">x100'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: 'abcdefghigklmnopqr stuvwxyzabcdefghigklmno pqrstuvwxyzabcdefgh igklmnopqrstuvwxyzigklmnopqrstuvwxyz'
        }, {
          type: 'student',
          avatar: require('images/header2.png'),
          name: '学员',
          content: '66666666爱妃撒范德萨发的撒'
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

  .chat-chats-wrapper
    wrapper()
    position relative
    .top
      layout-full(0, 0, 132px, 0)
      .chat-wrap
        overflow hidden
        width-height-full()
        box-sizing border-box
        padding 16px 20px 12px 20px
        .chat-group
          .chat-item
            margin-bottom 20px
            width 100%
            baseTextStyle()
            .header
              vertical-align middle
              display inline-block
              width-height-same(30px)
              border-radius 50%
              margin-right 10px
            .name
              vertical-align middle
              display inline-block
              max-width 120px
              ellipsis()
            .separator
              margin-right 10px
            .self
              color orange
            .teacher
              color $baseRedColor
            .assistant
              color blue
            .content
              vertical-align middle
              break-world()
              line-height 28px
              >>> img
                vertical-align middle
                margin 0 5px
                width-height-same(20px)
    .bottom
      layout-full(unset, 0, 0, 0)
      box-shadow: 0px -2px 0px 0px $dullGreyColor; /*no*/
      height 132px
      .btn-group
        margin 7px 21px 0px 22px
        overflow hidden
        .btn-wrap
          float left
          margin-right 12px
        .emoticon-btn-wrap
          width-height-same(30px)
          .emoticon-btn-icon
            display inline-block
            background url('~images/emoticon/emoticon-btn.png') no-repeat
            width-height-full()
            background-size 30px
        .one-btn-wrap, .two-btn-wrap
          width-height-same(30px)
          transform scale(0.8)
          background-color $baseGreenColor
          border-radius: 50%
          line-height 30px
          text-align center
          .one-btn-text, .two-btn-text
            font-size 12px
            font-family $genelFontFamily
            font-weight 400
            color $baseWhiteColor
        .two-btn-wrap
          background-color $baseRedColor
        .only-ready-wrap
          float right
          >>> .el-checkbox
            .el-checkbox__input
              .el-checkbox__inner
                border-color $baseRedColor
                width-height-same(20px)
                border-radius 50%
              .el-checkbox__inner::after
                width-height-same(5px)
                border-width 1px; /*no*/
                left 6px
                top 4px
          >>> .el-checkbox.is-checked
            .el-checkbox__input.is-checked
              .el-checkbox__inner
                background-color $baseRedColor
              .el-checkbox__inner::after
                width-height-same(5px)
                border-width 1px;/*no*/
                left 6px
                top 4px
            .el-checkbox__input.is-indeterminate
              .el-checkbox__inner
                background-color $baseRedColor
          .only-ready-text
            margin-left 5px
            line-height 30px
            baseTextStyle()
      .input-wrap
        margin-top 10px
        margin-left 20px
        overflow hidden
        .textarea
          float left
          baseTextStyle(14px, $betterGreyColor)
          width 383px
          height 70px
          >>> .el-textarea__inner
            width-height-full()
            background-color #F5F1F6
            border-radius 4px 0 0 4px
            border none
            resize none
        .send-btn
          float left
          background-color $baseRedColor
          border-radius 0px 4px 4px 0px; /*no*/
          width 57px
          height 70px
          text-align center
          line-height 70px
          border none
          padding 0
          baseTextStyle(18px, $baseWhiteColor)
      .praise
        position absolute
        right 10px
        top -52px
</style>
