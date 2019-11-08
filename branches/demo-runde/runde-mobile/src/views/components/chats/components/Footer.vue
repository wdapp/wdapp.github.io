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
        <chats-input ref="field" @focus="onFocus" @blur="onBlur"></chats-input>
      </div>
      <div class="plus-reduce-two-wrap" @click="onPlusReduceTwoClick">
        <span
          class="plus-reduce-two-icon"
          :class="plusReduceTwoClassName"
        ></span>
      </div>
      <div class="gifts-one-wrap" @click="onGiftsOneClick">
        <span class="gifts-one-icon" :class="giftsOneClassName"></span>
      </div>
    </div>
  </div>
</template>

<script>
import ChatsInput from "./Input";
import STATE from "./state";

export default {
  name: "Footer",
  components: {
    ChatsInput
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
      timer: 0
    };
  },
  computed: {
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
    emit(event, options) {
      this.bus.$emit(event, options);
    },
    on(event, callback) {
      this.bus.$on(event, params => {
        callback && callback(params);
      });
    },
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
      this.closePopup();
    },
    closePopup() {
      this.$emit("closepopup");
      this.onBlur();
    },
    onFocus() {
      this.curEmoKey.state = STATE.CUR_EMO_STATE.EMOTICON;
      this.giftsOne.state = STATE.GIFTS_ONE.ONE;
      this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.TWO;
      this.$emit("closepopup");
    },
    onBlur() {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (!this.popupup) {
          this.curEmoKey.state = STATE.CUR_EMO_STATE.CURRICULUM;
          this.giftsOne.state = STATE.GIFTS_ONE.GIFTS;
          this.plusReduceTwo.state = STATE.PLUS_REDUCE_TWO.PLUS;
        }
        this.timer = 0;
      }, 600);
    },
    addEvents() {
      this.on("popupup", () => {
        this.popupup = true;
      });
      this.on("popudown", () => {
        this.popupup = false;
      });
    }
  },
  mounted() {
    this.addEvents();
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
  .button-group
    height 70px
    width 100%
    .curriculum-emoticon-keyboard-wrap
      float left
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
      float left
      width 390px
      height 70px
      @media (min-width: 540px) and (max-width: 740px) {
        width 60%
      }
      @media (min-width: 740px) {
        width 70%
      }
    .gifts-one-wrap
      float right
      width-height-same(70px)
      .gifts-one-icon
        width-height-same(70px)
        bg-image('gifts')
      .gifts
        active-image('gifts')
      .one
        active-image('one')
    .plus-reduce-two-wrap
      float right
      margin-left 20px
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
</style>
