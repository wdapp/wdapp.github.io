<template>
  <animation-fade enterDuration="0s" leaveDuration=".3s">
    <div class="questionnaire-wrapper" v-if="isShowQuestionnaire">
      <div class="questionnaire-wrap">
        <div class="questionnaire-header-wrap">
          <div class="questionnaire-header-title-wrap">
            <p class="questionnaire-header-title-text">
              {{ title }}
            </p>
          </div>
          <div class="questionnaire-header-close-wrap" @click="onClose">
            <van-icon class="questionnaire-header-close-btn" name="cross" />
          </div>
        </div>
        <div class="questionnaire-body-questions-result" v-show="isShowResult">
          <p class="questionnaire-body-questions-result-text">
            正确答案：{{ questionnaire.correct }}
          </p>
        </div>
        <div class="questionnaire-body-wrap">
          <div class="questionnaire-body-title-wrap">
            <p class="questionnaire-body-title-text">
              {{ questionnaire.title }}
            </p>
          </div>
          <div
            class="questionnaire-body-questions-wrap"
            :class="{ 'question-active': isShowResult }"
          >
            <van-radio-group v-model="result" :disabled="disabled">
              <van-cell-group>
                <van-cell
                  class="question-item"
                  :class="{ active: result === key }"
                  :title="formatContent(option)"
                  v-for="(option, key) of questionnaire.options"
                  :key="key"
                  clickable
                  @click="onCellClick(key)"
                >
                  <van-radio
                    class="van-radio"
                    slot="right-icon"
                    :name="key"
                    v-show="false"
                  />
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </div>
          <div class="questionnaire-footer-wrap">
            <div
              class="questionnaire-footer-btn-wrap"
              @click="onSubmit"
              v-show="!isShowResult"
            >
              <div class="questionnaire-footer-btn">确定提交</div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="show" @closed="onClosed">
        <span class="popup-icon" :class="popup.type"></span>
        {{ popup.message }}
      </van-popup>
    </div>
  </animation-fade>
</template>

<script>
import AnimationFade from "common/components/animation/fade/Fade";
import HuodeScene from "common/websdk/live";
import { log } from "common/utils";

export default {
  name: "Questionnaire",
  components: {
    AnimationFade
  },
  props: {
    questionnaire: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      title: "问卷",
      messageBoxTimer: 0,
      messageBoxTimerInterval: 2000,
      isShowQuestionnaire: false,
      isShowResult: false,
      result: -1,
      max: 1,
      disabled: false,
      show: false,
      success: true,
      popup: {
        type: "success",
        message: "提交成功"
      }
    };
  },
  computed: {
    formatResult() {
      const result = [];
      const optionIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      result.push(optionIndex[this.result]);
      return result;
    }
  },
  watch: {
    questionnaire() {
      this.isShowQuestionnaire = true;
      this.disabled = false;
      this.result = -1;
    }
  },
  methods: {
    onCellClick(key) {
      if (this.disabled) {
        return;
      }
      this.result = key;
    },
    formatContent(option) {
      return option.key + "." + option.content;
    },
    showMessageBox(type, message) {
      this.show = true;
      this.popup = {
        type,
        message
      };
      this.messageBoxTimer && clearTimeout(this.messageBoxTimer);
      this.messageBoxTimer = setTimeout(() => {
        this.show = false;
        this.messageBoxTimer = 0;
      }, this.messageBoxTimerInterval);
    },
    onClose() {
      this.isShowQuestionnaire = false;
    },
    onSubmit() {
      const select = this.formatResult[0];
      log("select", select);
      let selectedOptionId = "";
      for (let option of this.questionnaire.options) {
        if (select === option.key) {
          selectedOptionId = option.id;
          break;
        }
      }
      const options = {
        questionnaireId: this.questionnaire.questionnaireId,
        subjectsAnswer: [
          {
            selectedOptionId: selectedOptionId,
            subjectId: this.questionnaire.subjectId
          }
        ]
      };
      this.HD.submitQuestionnaire(options, data => {
        log("submitQuestionnaire", data);
        if (data.success) {
          this.success = true;
          this.showMessageBox("success", "提交成功");
        } else {
          this.success = false;
          this.showMessageBox("fail", "提交失败");
        }
      });
    },
    onClosed() {
      this.messageBoxTimer && clearTimeout(this.messageBoxTimer);
      this.messageBoxTimer = 0;
      if (this.success) {
        this.isShowQuestionnaire = true;
        this.isShowResult = true;
        this.disabled = true;
      } else {
        this.stopQuestionnaire();
      }
    },
    isError(key) {
      if (this.formatResult.indexOf(key) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    isRight(key) {
      if (this.questionnaire.correct === key) {
        return true;
      } else {
        return false;
      }
    },
    stopQuestionnaire() {
      this.isShowQuestionnaire = false;
      this.isShowResult = false;
      this.disabled = false;
      this.messageBoxTimer && clearTimeout(this.messageBoxTimer);
      this.messageBoxTimer = 0;
      this.show = false;
    }
  },
  mounted() {
    this.HD = new HuodeScene();
    this.HD.onQuestionnairePublishStop(data => {
      log("onQuestionnairePublishStop", data);
      this.stopQuestionnaire();
    });
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.questionnaire-wrapper
  position absolute
  width-height-full()
  position fixed
  background-color rgba(0, 0, 0, 0.7)
  z-index 2
  .questionnaire-wrap
    position absolute
    top 50%
    left 50%
    margin-top -194px
    margin-left -310px
    z-index 99
    width 620px
    background-color $fff
    border 1px solid $ddd
    border-radius 8px
    overflow hidden
    .questionnaire-header-wrap
      position relative
      width 100%
      height 100px
      background $fff
      padding-left 32px
      padding-right 15px
      box-sizing border-box
      .questionnaire-header-title-wrap
        width-height-full()
        line-height 100px
        text-align center
        .questionnaire-header-title-text
          baseTextStyle(36px, $red, $boldFontWeight)
      .questionnaire-header-close-wrap
        position absolute
        height 100%
        top 20px
        right 20px
        .questionnaire-header-close-btn
          font-size 40px
          color #BBBBBB
    .questionnaire-body-questions-result
      width 100%
      height 40px
      background-color #FFFBC9
      line-height 40px
      padding-left 27px
      box-sizing border-box
      margin-top 1px; /*no*/
      .questionnaire-body-questions-result-text
        baseTextStyle(14px, $red, 400)
    .questionnaire-body-wrap
      min-height 215px
      padding 30px
      box-sizing border-box
      .questionnaire-body-title-wrap
        margin-bottom 35px
        .questionnaire-body-title-text
          baseTextStyle(30px, $c333, $boldFontWeight)
          break-world()
          line-height 42px
    .question-active
      >>> .el-checkbox__input
        display inline-block
        opacity 0
        width-height-same(30px)
        background url("~images/select/right.png") no-repeat
        background-size 30px
        margin-top -7px
        margin-right 6px
        .el-checkbox__inner
          margin-right 17px
          top -1px
          display none
      .error
        >>> .el-checkbox__input
          background-image url('~images/select/error.png')
          opacity 1
      .right
        >>> .el-checkbox__input
          background-image url('~images/select/right.png')
          opacity 1
    .questionnaire-body-questions-wrap
      width 100%
      max-height 515px
      overflow auto
      .question-item
        position relative
        width 540px
        background rgba(245, 241, 246, 1)
        border-radius 8px
        display block
        margin-bottom 21px
        break-world()
        baseTextStyle(28px, $c333)
        line-height 40px
        >>> .el-checkbox__label
          line-height 40px
        >>> .el-checkbox__input
          .el-checkbox__inner
            margin-right 17px
            top -1px
      .active
        color red
      >>> .is-checked
        .el-checkbox__label
          color $red
      .question-item:last-child
        margin-bottom 0
    .questionnaire-footer-wrap
      width 100%
      .questionnaire-footer-btn-wrap
        margin 0 auto
        width 400px
        height 88px
        background $red
        border-radius 44px
        margin-top 33px
        text-align center
        line-height 88px
        cursor-pointer()
        .questionnaire-footer-btn
          baseTextStyle(36px, $fff)
.van-popup
  width 480px
  height 330px
  background rgba(255, 255, 255, 1)
  border-radius 8px
  baseTextStyle(36px, $c333, $boldFontWeight)
  text-align center
  line-height 400px
  overflow visible
  .popup-icon
    bg-image("pop/success", 280)
    horizontally(280, absolute)
    top -120px
  .success
    active-image("pop/success")
  .fail
    active-image("pop/fail")
</style>
<style lang="stylus">
@import "~styles/mixins.styl"

.msgbox
  width 230px
  height 140px
  background $fff
  border 1px solid $ddd; /* no */
  border-radius 8px
  overflow visible
  position relative
  .el-message-box__content
    padding 0
    margin-top 81px
    .el-message-box__message
      text-align center
      baseTextStyle(20px, $c333, $boldFontWeight)
  .el-message-box__btns
    width-height-same(140px)
    background url("~images/pop/success.png") no-repeat
    background-size 140px
    padding 0
    position absolute
    top -74px
    left 50%
    margin-left -70px
.success
  .el-message-box__btns
    background-image url("~images/pop/success.png")
.fail
  .el-message-box__btns
    background-image url("~images/pop/fail.png")
</style>
