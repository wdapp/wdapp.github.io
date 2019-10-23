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
          ></hd-chats>
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
import HuodeScene from 'common/websdk/live'
import {showEm} from 'common/utils'

export default {
  name: 'ChatChats',
  components: {
    hdPraise,
    hdChats
  },
  data () {
    return {
      text: '',
      checked: false,
      messages: [],
      messagesLength: 200,
      isScroll: true
    }
  },
  computed: {
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
    sendMessage () {
      if (!this.verify) {
        return false
      }
      const text = this.text.trim()
      this.HD.sendPublicChatMsg(text)
      this.HD.sendBarrage(text)
      this.text = ''
    },
    addEvents () {
      this.HD.onPublicChatMessage((message) => {
        const _message = JSON.parse(message)
        const _messages = {
          userAvatar: _message.useravatar || require('images/header2.png'),
          userName: _message.username,
          content: showEm(_message.msg),
          userId: _message.userid,
          userRole: _message.userrole,
          userCustomMark: _message.usercustommark,
          groupId: _message.groupId,
          time: _message.time,
          status: _message.status,
          chatId: _message.chatId
        }
        this.messages.push(_messages)
        this.scrollTo()
      })
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
          cursor-pointer()
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
