<template>
  <div class="chat-chats-wrapper">
    <div class="top">
      <div
        class="chat-wrap"
        ref="wrapper"
        @mouseenter="enterChatWrap"
        @mouseleave="levaeChatWrap"
      >
        <div class="chat-group" ref="chatGroup">
          <hd-chats
            :show="!checked"
            :message="message"
            v-for="(message, index) of limitMessages"
            :key="index"
            :type="message.type"
          ></hd-chats>
        </div>
      </div>
      <div class="hd-slide-tip-wrap">
        <hd-slide
          class="hd-slide-tip"
          :option="tipOption"
        ></hd-slide>
      </div>
    </div>
    <div class="bottom">
      <hd-praise class="praise-wrap"></hd-praise>
      <div class="btn-group">
        <div
          class="btn-wrap emoticon-btn-wrap"
        >
          <span
            class="emoticon-btn-icon"
            @click="handleEmoticonClick"
          ></span>
          <div
            class="emoticon-em2-wrap"
            v-show="isShowEmoticon"
          >
            <ul class="em2-group">
              <li
                class="item"
                v-for="(option, key) of em2Group"
                :key="key"
                @click="handleEmClick(option.mark)"
              >
                <img
                  class="em2-img"
                  :src="option.src"
                >
              </li>
            </ul>
          </div>
        </div>
        <div
          class="btn-wrap one-btn-wrap"
          @click="handleQClick(1)"
        >
          <span class="one-btn-text">扣1</span>
        </div>
        <div
          class="btn-wrap two-btn-wrap"
          @click="handleQClick(2)"
        >
          <span class="two-btn-text">扣2</span>
        </div>
        <div class="only-read-wrap">
          <el-checkbox v-model="checked" @change="onChange">
            <span class="only-read-text">只看老师</span>
          </el-checkbox>
        </div>
      </div>
      <div class="input-wrap">
        <el-input
          class="textarea"
          type="textarea"
          :rows="2"
          placeholder="在这里和老师互动哦"
          v-model="text"
          @keyup.enter.native="sendMessage"
        >
        </el-input>
        <el-button
          class="send-btn"
          type="primary"
          @click="sendMessage"
        >
          发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import hdPraise from 'common/components/praise/Praise'
import hdChats from 'common/components/chats/Chats'
import hdSlide from 'common/components/slide/Slide'
import HuodeScene from 'common/websdk/live'
import {showEm, formatRewardAndGiftToTip} from 'common/utils'
import {mapState} from 'vuex'

export default {
  name: 'ChatChats',
  components: {
    hdPraise,
    hdChats,
    hdSlide
  },
  data () {
    return {
      text: '',
      checked: false,
      messages: [],
      messagesLength: 200,
      isScroll: true,
      isShowEmoticon: false,
      tipOption: {},
      firstTips: false
    }
  },
  computed: {
    ...mapState(['viewer']),
    em2Group () {
      const group = []
      for (let i = 201; i <= 300; i++) {
        const option = {
          src: require('images/emoticon/em2/em2_200/' + i + '.png'),
          mark: '[em2_' + i + ']'
        }
        group.push(option)
      }
      return group
    },
    limitMessages () {
      const messages = [...this.messages]
      return messages.splice(-this.messagesLength)
    },
    verify () {
      const text = this.text.trim()
      if (!text) {
        this.$message({
          message: '聊天内容不能为空',
          type: 'warning'
        })
        return false
      }
      if (text.length >= 300) {
        this.$message({
          message: '聊天内容不能超过300字',
          type: 'warning'
        })
        return false
      }
      return true
    }
  },
  methods: {
    init () {
      this.HD = new HuodeScene()
      this.createBetterScroll()
      this.addEvents()
    },
    handleEmoticonClick () {
      this.isShowEmoticon = !this.isShowEmoticon
    },
    createBetterScroll () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.wrapper, {
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          },
          scrollbar: {
            fade: true,
            interactive: false
          },
          preventDefault: false
        })
      })
    },
    handleEmClick (mark) {
      this.text += mark
    },
    handleQClick (type) {
      const msg = '[em2_q' + type + ']'
      this.HD.sendPublicChatMsg(msg)
    },
    sendMessage () {
      if (!this.verify) {
        return false
      }
      const text = this.text.trim()
      this.HD.sendPublicChatMsg(text)
      this.sendBarrage(text)
      this.text = ''
      this.isShowEmoticon = false
    },
    sendBarrage (text) {
      this.bus.$emit('danmaku', text)
    },
    addEvents () {
      this.HD.onPublicChatMessage((message) => {
        const _msg = JSON.parse(message)
        const type = (this.viewer.id === _msg.userid ? 'right' : 'left')
        const formatMsg = {
          userAvatar: _msg.useravatar || require('images/header2.png'),
          userName: _msg.username,
          content: showEm(_msg.msg),
          userId: _msg.userid,
          userRole: _msg.userrole,
          userCustomMark: _msg.usercustommark,
          groupId: _msg.groupId,
          time: _msg.time,
          status: _msg.status,
          chatId: _msg.chatId,
          type: type
        }
        this.messages.push(formatMsg)
        this.scrollTo()
        this.sendTip(_msg)
      })
    },
    sendTip (msg) {
      if (!this.firstTips) {
        this.$nextTick(() => {
          this.firstTips = true
        })
        return false
      }
      const tip = formatRewardAndGiftToTip(msg)
      if (!tip) {
        return false
      }
      this.tipOption = tip
    },
    scrollTo () {
      if (!this.isScroll) {
        return false
      }
      this.$nextTick(() => {
        this.scroll.refresh()
        this.scroll.scrollToElement(this.$refs.chatGroup.lastElementChild)
      })
    },
    enterChatWrap () {
      this.isScroll = false
    },
    levaeChatWrap () {
      this.isScroll = true
    },
    onChange () {
      this.scrollTo()
    }
  },
  mounted () {
    this.init()
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
      .hd-slide-tip-wrap
        position absolute
        top 100px
    .bottom
      layout-full(unset, 0, 0, 0)
      box-shadow: 0px -2px 0px 0px $dullGreyColor; /*no*/
      height 132px
      .btn-group
        margin 7px 21px 0px 22px
        .btn-wrap
          float left
          margin-right 12px
          cursor-pointer()
        .emoticon-btn-wrap
          position relative
          width-height-same(30px)
          .emoticon-btn-icon
            display inline-block
            background url('~images/emoticon/emoticon-btn.png') no-repeat
            width-height-full()
            background-size 30px
          .emoticon-em2-wrap
            position absolute
            background-color $baseWhiteColor
            border-radius 10px /*no*/
            width 477px
            height 250px
            bottom 46px
            left -20px
            box-shadow 0px 0px 3px 1px $dullGreyColor; /*no*/
            z-index 1
            padding-top 16px
            padding-left 16px
            box-sizing border-box
            .em2-group
              width-height-full()
              overflow-y auto
              .item
                float left
                width-height-same(35px)
                margin-right 16px
                margin-bottom 16px
                .em2-img
                  width-height-same(35px)
          .emoticon-em2-wrap:after
            content ''
            width-height-same(0)
            border 10px solid transparent; /*no*/
            border-top-color $baseWhiteColor
            position absolute
            bottom -25px
            left 26px
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
        .only-read-wrap
          float right
          cursor-pointer()
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
                border-width 1px; /*no*/
                left 6px
                top 4px
            .el-checkbox__input.is-indeterminate
              .el-checkbox__inner
                background-color $baseRedColor
          >>> .el-checkbox
            .el-checkbox__label
              padding 0
              .only-read-text
                margin-left 10px
                line-height 30px
                baseTextStyle()
      .input-wrap
        margin-top 10px
        margin-left 20px
        float left
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
      .praise-wrap
        position absolute
        right 10px
        top -52px
</style>
