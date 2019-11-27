<template>
  <div class="footer-wrapper">
    <div class="button-group">
      <div class="curriculum-emoticon-keyboard-wrap" @click="onCurEmoKeyClick">
        <span
          class="curriculum-emoticon-keyboard-icon"
          :class="curEmoKeyClassName"
        ></span>
      </div>
      <div class="input-wrap">
        <chats-input
          ref="field"
          @focus="onFocus"
          @blur="onBlur"
          @change="onChange"
          :message="message"
        ></chats-input>
      </div>
      <div class="gifts-one-wrap" v-show="!message" @click="onGiftsOneClick">
        <span class="gifts-one-icon" :class="giftsOneClassName"></span>
      </div>
      <div
        class="plus-reduce-two-wrap"
        v-show="!message"
        @click="onPlusReduceTwoClick"
      >
        <span
          class="plus-reduce-two-icon"
          :class="plusReduceTwoClassName"
        ></span>
      </div>
      <div class="send-wrap" @click="sendMessage" v-show="message">发送</div>
    </div>
    <common-slide class="conmmon-slide" :option="tipOption"></common-slide>
  </div>
</template>

<script>
import ChatsInput from "./Input";
import STATE from "./state";
import Mixins from "common/mixins";
import HuodeScene from "common/websdk/live";
import { showEm, formatRewardAndGiftToTip, shieldEmAndQ12 } from "common/utils";
import { mapState } from "vuex";
import CommonSlide from "common/components/slide/Slide";

export default {
  name: "Footer",
  mixins: [Mixins],
  components: {
    ChatsInput,
    CommonSlide
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      curEmoKey: {
        state: STATE.CUR_EMO_STATE.CURRICULUM
      },
      giftsOne: {
        state: STATE.GIFTS_ONE.GIFTS
      },
      plusReduceTwo: {
        state: STATE.PLUS_REDUCE_TWO.PLUS
      },
      popupup: false,
      timer: 0,
      message: "",
      messages: [],
      tipOption: {},
      firstTips: false,
      isScroll: false,
      messagesLength: 100,
      focus: false
    };
  },
  watch: {
    messages() {
      this.$emit("messages", this.limitMessages);
    }
  },
  computed: {
    ...mapState(["viewer"]),
    limitMessages() {
      const messages = [...this.messages];
      return messages.splice(-this.messagesLength);
    },
    verify() {
      const msg = this.message.trim();
      if (!msg) {
        this.$notify({ type: "warning", message: "聊天内容不能为空" });
        return false;
      }
      if (msg.length >= 300) {
        this.$notify({ type: "warning", message: "聊天内容不能超过300字" });
        return false;
      }
      return true;
    },
    curEmoKeyClassName() {
      return this.curEmoKey.state;
    },
    giftsOneClassName() {
      return this.giftsOne.state;
    },
    plusReduceTwoClassName() {
      return this.plusReduceTwo.state;
    },
    field() {
      return this.$refs.field;
    }
  },
  methods: {
    initialToUpperCase(str) {
      return str.replace(/^\S/, s => s.toUpperCase());
    },
    onCurEmoKeyClick() {
      const state = this.curEmoKey.state;
      switch (state) {
        case STATE.CUR_EMO_STATE.CURRICULUM:
          this.onCurriculumClick();
          break;
        case STATE.CUR_EMO_STATE.EMOTICON:
          this.onEmoticonClick();
          this.curEmoKey.state = STATE.CUR_EMO_STATE.KEYBOARD;
          break;
        case STATE.CUR_EMO_STATE.KEYBOARD:
          this.onKeyboardClick();
          this.curEmoKey.state = STATE.CUR_EMO_STATE.EMOTICON;
          break;
      }
    },
    onCurriculumClick() {
      const options = {
        component: "Common" + this.initialToUpperCase(this.curEmoKey.state)
      };
      this.emit("curriculumclick", options);
    },
    onEmoticonClick() {
      const options = {
        component: "Common" + this.initialToUpperCase(this.curEmoKey.state)
      };
      this.$emit("emoticonclick", options);
    },
    onKeyboardClick() {
      this.field.focus();
    },
    onGiftsOneClick() {
      const state = this.giftsOne.state;
      switch (state) {
        case STATE.GIFTS_ONE.ONE:
          this.onOneClick();
          break;
        case STATE.GIFTS_ONE.GIFTS:
          this.onGiftsClick();
          break;
      }
    },
    onGiftsClick() {
      const options = {
        component: "Common" + this.initialToUpperCase(this.giftsOne.state)
      };
      this.emit("giftsclick", options);
    },
    onOneClick() {
      this.sendKou(1);
      this.$emit("closepopup");
      this.onBlur();
    },
    onPlusReduceTwoClick() {
      const state = this.plusReduceTwo.state;
      switch (state) {
        case STATE.PLUS_REDUCE_TWO.PLUS:
          this.onPlusClick();
          this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.REDUCE;
          break;
        case STATE.PLUS_REDUCE_TWO.REDUCE:
          this.onReduceClick();
          this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.PLUS;
          break;
        case STATE.PLUS_REDUCE_TWO.TWO:
          this.onTWOClick();
          break;
      }
    },
    onPlusClick() {
      const options = {
        component: "Common" + this.initialToUpperCase(this.plusReduceTwo.state)
      };
      this.$emit("plusclick", options);
    },
    onReduceClick() {
      this.closePopup();
    },
    onTWOClick() {
      this.sendKou(2);
      this.closePopup();
      this.onBlur();
    },
    closePopup() {
      this.$emit("closepopup");
      this.onBlur();
    },
    onFocus() {
      this.focus = true;
      this.curEmoKey.state = STATE.CUR_EMO_STATE.EMOTICON;
      this.giftsOne.state = STATE.GIFTS_ONE.ONE;
      this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.TWO;
      this.$emit("closepopup");
    },
    onBlur() {
      this.focus = false;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.popupup) {
          this.initButtonState();
        }
        this.timer = 0;
      }, 1000);
    },
    initButtonState() {
      this.curEmoKey.state = STATE.CUR_EMO_STATE.CURRICULUM;
      this.giftsOne.state = STATE.GIFTS_ONE.GIFTS;
      this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.PLUS;
    },
    addEvents() {
      this.on("popupup", () => {
        this.popupup = true;
      });
      this.on("popudown", () => {
        this.popupup = false;
        if (!this.focus) {
          this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.PLUS;
        }
      });
      this.on("emoticon", mark => {
        this.onEmoticon(mark);
      });
      this.hd.onPublicChatMessage(message => {
        const _msg = JSON.parse(message);
        const self = this.viewer.id === _msg.userid;
        const type = self ? "right" : "left";
        let active = true; // 是否可被（只看讲师）控制,true 可控，false 常显
        // 讲师 和 自己 不会被（只看讲师）控制
        if (self || _msg.userrole === "publisher") {
          active = false;
        } else {
          active = true;
        }
        let show = true; // 默认显示或隐藏，true显示，false 隐藏
        const checked = this.checked; //是否开启只看讲师，true开启，false不开启
        if (active && checked) {
          show = false;
        } else {
          show = true;
        }
        const formatMsg = {
          userAvatar: _msg.useravatar || require("images/header.png"),
          userName: _msg.username,
          content: showEm(_msg.msg),
          userId: _msg.userid,
          userRole: _msg.userrole,
          userCustomMark: _msg.usercustommark,
          groupId: _msg.groupId,
          time: _msg.time,
          status: _msg.status,
          chatId: _msg.chatId,
          type: type,
          show: show,
          active: active
        };
        this.messages.push(formatMsg);
        this.sendBarrage(_msg);
        if (this.isScroll) {
          this.emit("scrolltobottom");
        }
        this.sendTip(_msg);
      });
    },
    sendTip(msg) {
      if (!this.firstTips) {
        this.$nextTick(() => {
          this.firstTips = true;
        });
        return false;
      }
      const tip = formatRewardAndGiftToTip(msg);
      if (!tip) {
        return false;
      }
      this.tipOption = tip;
    },
    onChange(value) {
      this.message = value;
    },
    onEmoticon(mark) {
      this.message += "[em2_" + mark + "]";
    },
    sendKou(type) {
      const msg = "[em2_q" + type + "]";
      this.hd.sendPublicChatMsg(msg);
    },
    sendMessage() {
      if (!this.verify) {
        return false;
      }
      const message = this.message.trim();
      this.hd.sendPublicChatMsg(message);
      this.message = "";
      this.initButtonState();
    },
    sendBarrage(msg) {
      const isMessage = formatRewardAndGiftToTip(msg);
      if (isMessage) {
        return false;
      }
      // 过滤表情和扣1、2
      const text = shieldEmAndQ12(msg.msg);
      if (!text.trim()) {
        return false;
      }
      this.bus.$emit("danmaku", text);
    }
  },
  mounted() {
    this.hd = new HuodeScene();
    this.addEvents();
    this.delay(() => {
      this.emit("scrolltobottom");
      this.isScroll = true;
    }, 2000);
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.footer-wrapper
  wrapper()
  padding 14px 30px
  box-sizing border-box
  border-top 1px solid $eee
  .conmmon-slide
    position absolute
    bottom 450px
    left 0
  .button-group
    height 70px
    width 100%
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    .curriculum-emoticon-keyboard-wrap
      margin-right 20px
      width-height-same(70px)
      .curriculum-emoticon-keyboard-icon
        width-height-same(70px)
        bg-image('curriculum')
      .curriculum
        active-image('curriculum')
      .emoticon
        active-image('emoticon')
      .keyboard
        active-image('keyboard')
    .input-wrap
      flex 1
      margin-right 50px
    .gifts-one-wrap
      margin-right 20px
      width-height-same(70px)
      .gifts-one-icon
        width-height-same(70px)
        bg-image('gifts')
      .gifts
        active-image('gifts')
      .one
        active-image('one')
    .plus-reduce-two-wrap
      width-height-same(70px)
      .plus-reduce-two-icon
        width-height-same(70px)
        bg-image('plus')
      .plus
        active-image('plus')
      .reduce
        active-image('reduce')
      .two
        active-image('two')
    .send-wrap
      width 160px
      height 60px
      background $red
      border-radius 30px
      baseTextStyle(32px, $fff)
      line-height 60px
      text-align center
</style>
