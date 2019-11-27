<template>
  <hd-fade
    enterDuration="0s"
    leaveDuration=".3s"
  >
    <div
      class="questionnaire-wrapper"
      v-if="isShowQuestionnaire"
    >
      <div class="questionnaire-wrap">
        <div class="questionnaire-header-wrap">
          <div class="questionnaire-header-title-wrap">
            <p class="questionnaire-header-title-text">
              {{title}}
            </p>
          </div>
          <div
            class="questionnaire-header-close-wrap"
            @click="onClose"
            v-show="isShowResult ? true : !questionnaire.forcibly"
          >
            <i class="el-icon-close questionnaire-header-close-btn"></i>
          </div>
        </div>
        <div
          class="questionnaire-body-questions-result"
          v-show="isShowResult"
        >
          <p class="questionnaire-body-questions-result-text">
            正确答案：{{correct}}
          </p>
        </div>
        <div class="questionnaire-body-wrap">
          <div class="questionnaire-body-title-wrap">
            <p class="questionnaire-body-title-text">
              {{questionnaire.title}}
            </p>
          </div>
          <div
            class="questionnaire-body-questions-wrap"
            :class="{'question-active': isShowResult}"
          >
            <el-checkbox-group
              v-model="result"
              :max="questionnaire.max"
              :disabled="disabled"
            >
              <el-checkbox
                class="question-item"
                :label="formatContent(option)"
                v-for="(option, key) of questionnaire.options"
                :key="key"
                :class="{
                  'error': isError(option.key),
                  'right': isRight(option.key)
                }"
              ></el-checkbox>
            </el-checkbox-group>
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
    </div>
  </hd-fade>
</template>

<script>
import hdFade from 'common/components/fade/Fade'
import HuodeScene from 'common/websdk/live'
import {log} from 'common/utils'

export default {
  name: 'Questionnaire',
  components: {
    hdFade
  },
  props: {
    questionnaire: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      title: '问卷',
      messageBoxTimer: 0,
      messageBoxTimerInterval: 2000,
      isShowQuestionnaire: false,
      isShowResult: false,
      result: [],
      cacheResult: [],
      disabled: false
    }
  },
  computed: {
    formatResult () {
      const result = []
      for (let item of this.result) {
        const character = (item.trim())[0]
        result.push(character)
      }
      return result
    },
    correct () {
      let corrects = ''
      for (let i = 0; i < this.questionnaire.options.length; i++) {
        const option = this.questionnaire.options[i]
        if (option.correct) {
          corrects += option.key + '、'
        }
      }
      return corrects.substring(0, corrects.length - 1)
    }
  },
  watch: {
    questionnaire () {
      log('questionnaire', this.questionnaire)
      this.isShowQuestionnaire = true
      this.disabled = false
    }
  },
  methods: {
    formatContent (option) {
      return option.key + '.' + option.content
    },
    showMessageBox (type, message, callback) {
      this.$msgbox({
        customClass: `msgbox ${type}`, // type = success、fail
        message: message,
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickModal: true,
        beforeClose: (action, instance, done) => {
          done()
          this.messageBoxTimer && clearTimeout(this.messageBoxTimer)
          this.messageBoxTimer = 0
        },
        callback: (action, instance) => {
          callback()
        }
      }).then(() => {
      }).catch(() => {
      })
      this.messageBoxTimer && clearTimeout(this.messageBoxTimer)
      this.messageBoxTimer = setTimeout(() => {
        this.$msgbox.close()
        this.messageBoxTimer = 0
        callback()
      }, this.messageBoxTimerInterval)
    },
    onClose () {
      this.isShowQuestionnaire = false
    },
    onSubmit () {
      let selects = this.formatResult
      if (!selects.length) {
        return
      }

      this.isShowQuestionnaire = false
      log('select', selects)

      let selectedOptionId = []
      const options = this.questionnaire.options
      for (var i = 0; i < selects.length; i++) {
        const select = selects[i]
        for (var j = 0; j < options.length; j++) {
          const option = options[j]
          if (select === option.key) {
            selectedOptionId += option.id + ','
          }
        }
      }
      selectedOptionId = selectedOptionId.substring(0, selectedOptionId.length - 1)
      let _options = {
        questionnaireId: this.questionnaire.questionnaireId,
        subjectsAnswer: [
          {
            subjectId: this.questionnaire.subjectId
          }
        ]
      }
      if (this.questionnaire.max > 1) {
        _options.subjectsAnswer[0].selectedOptionIds = selectedOptionId
      } else {
        _options.subjectsAnswer[0].selectedOptionId = selectedOptionId
      }
      this.HD.submitQuestionnaire(_options, (data) => {
        log('submitQuestionnaire', data)
        if (data.success) {
          this.showMessageBox('success', '提交成功', () => {
            if (this.questionnaire.submitedAction) {
              this.configShowResult()
            } else {
              this.configStop()
            }
          })
        } else {
          this.showMessageBox('fail', '提交失败', () => {
            this.configStop()
          })
        }
      })
    },
    configShowResult () {
      this.disabled = true
      this.isShowQuestionnaire = true
      this.isShowResult = true
      this.cacheResult = [...this.result]
      this.result = []
    },
    configStop () {
      this.isShowQuestionnaire = false
      this.isShowResult = false
      this.disabled = false
      this.result = []
    },
    isError (key) {
      let error = false
      const results = this.cacheResult
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const character = (result.trim())[0]
        if (character === key) {
          error = true
        }
      }
      return error
    },
    isRight (key) {
      let right = false
      for (let i = 0; i < this.questionnaire.options.length; i++) {
        const option = this.questionnaire.options[i]
        if (option.key === key && option.correct) {
          right = true
          break
        }
      }
      return right
    },
    stopQuestionnaire () {
      this.isShowQuestionnaire = false
      this.isShowResult = false
      this.disabled = false
      this.messageBoxTimer && clearTimeout(this.messageBoxTimer)
      this.messageBoxTimer = 0
      this.$msgbox.close && this.$msgbox.close()
    }
  },
  mounted () {
    this.HD = new HuodeScene()
    this.HD.onQuestionnairePublishStop((data) => {
      log('onQuestionnairePublishStop', data)
      this.stopQuestionnaire()
    })
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .questionnaire-wrapper
    position absolute
    width-height-full()
    position fixed
    background-color rgba(0, 0, 0, 0.7)
    z-index 3
    .questionnaire-wrap
      position absolute
      top 50%
      left 50%
      margin-top -194px
      margin-left -250px
      z-index 99
      width 500px
      background $baseWhiteColor
      border 1px solid $dullGreyColor; /* no */
      border-radius 8px
      overflow hidden
      .questionnaire-header-wrap
        width 500px
        height 56px
        box-shadow 0px 1px 0px 0px $dullGreyColor; /* no */
        background $baseWhiteColor
        padding-left 32px
        padding-right 15px
        box-sizing border-box
        .questionnaire-header-title-wrap
          float left
          height 100%
          line-height 56px
          .questionnaire-header-title-text
            baseTextStyle(18px, $lightBlackColor, $boldFontWeight, $genelFontFamily)
        .questionnaire-header-close-wrap
          float right
          height 100%
          line-height 56px
          .questionnaire-header-close-btn
            font-size 14px
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
          baseTextStyle(14px, $baseRedColor, 400, $baseFontFamily)
      .questionnaire-body-wrap
        min-height 215px
        padding 30px
        box-sizing border-box
        .questionnaire-body-title-wrap
          margin-bottom 35px
          .questionnaire-body-title-text
            baseTextStyle(16px, $lightBlackColor, 400, $genelFontFamily)
            break-world()
            line-height 24px
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
        max-height 315px
        overflow auto
        .question-item
          display block
          margin-bottom 28px
          break-world()
          baseTextStyle()
          >>> .el-checkbox__input
            .el-checkbox__inner
              margin-right 17px
              top -1px
        >>> .is-checked
          .el-checkbox__label
            color $baseRedColor
        .question-item:last-child
          margin-bottom 0
      .questionnaire-footer-wrap
        width 100%
        .questionnaire-footer-btn-wrap
          margin 0 auto
          width 150px
          height 46px
          background $baseRedColor
          border-radius 4px
          margin-top 33px
          text-align center
          line-height 46px
          cursor-pointer()
          .questionnaire-footer-btn
            baseTextStyle(18px, $baseWhiteColor)
</style>
<style lang="stylus">
  @import "~styles/mixins.styl"

  .msgbox
    width 230px
    height 140px
    background $baseWhiteColor
    border 1px solid $dullGreyColor; /* no */
    border-radius 8px
    overflow visible !important
    position relative
    .el-message-box__content
      padding 0
      margin-top 81px
      .el-message-box__message
        text-align center
        baseTextStyle(20px, $lightBlackColor, $boldFontWeight, $genelFontFamily)
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
