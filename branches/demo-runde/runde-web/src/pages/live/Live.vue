<template>
  <div class="wrapper">
    <div class="container">
      <header class="header">
        <live-header :name="name"></live-header>
      </header>
      <div class="main">
        <div class="left" :class="{ 'bespread': isBespread }">
          <live-player @bespread="onBespread"></live-player>
        </div>
        <div class="right" v-show="!isBespread">
          <live-chat></live-chat>
        </div>
      </div>
    </div>
    <live-questionnaire :questionnaire="questionnaire"></live-questionnaire>
    <hd-attendance></hd-attendance>
  </div>
</template>

<script>
import LiveHeader from './components/header/Header'
import LivePlayer from './components/player/Player'
import LiveChat from './components/chat/Chat'
import LiveQuestionnaire from './components/questionnaire/Questionnaire'
import hdAttendance from 'common/components/attendance/Attendance'
import HuodeScene from 'common/websdk/live'
import {log} from 'common/utils'
import {mapMutations} from 'vuex'

export default {
  name: 'Live',
  components: {
    LiveHeader,
    LivePlayer,
    LiveChat,
    LiveQuestionnaire,
    hdAttendance
  },
  data () {
    return {
      name: '',
      isBespread: false,
      questionnaire: {}
    }
  },
  methods: {
    init () {
      const options = JSON.parse(decodeURIComponent(this.$route.params.options))

      log('options', options)

      this.setOptions(options)

      this.HD = new HuodeScene()

      this.login(options)

      this.addEvents()
    },
    addEvents () {
      this.HD.onQuestionnairePublish((data) => {
        log('onQuestionnairePublish', data)
        if (data.success) {
          this.formateQuestionnaire(data.datas)
        }
      })
    },
    formateQuestionnaire (data) {
      const questionnaire = data.questionnaire
      const subjects = questionnaire.subjects[0]
      const options = subjects.options
      const optionIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
      const _questionnaire = {}
      _questionnaire.type = subjects.type
      if (_questionnaire.type > 1) {
        return
      }
      _questionnaire.questionnaireId = questionnaire.id
      _questionnaire.forcibly = questionnaire.forcibly // 是否强制用户回答
      _questionnaire.submitedAction = questionnaire.submitedAction // 是否显示正确答案
      _questionnaire.subjectId = subjects.id
      _questionnaire.title = subjects.content
      _questionnaire.options = []
      _questionnaire.max = 0
      if (_questionnaire.type === 0) {
        _questionnaire.max = 1
      } else {
        _questionnaire.max = optionIndex.length
      }

      for (let i = 0; i < options.length; i++) {
        const option = options[i]
        option.key = optionIndex[i]
        _questionnaire.options.push(option)
      }

      this.questionnaire = _questionnaire
    },
    login (options) {
      this.HD.login({
        userId: options.userid,
        roomId: options.roomid,
        viewerName: options.name || '获得场景视频',
        viewerToken: options.token || '',
        success: (result) => {
          log('onLoginSuccess', result)

          this.setDatas(result)

          this.$message({
            showClose: true,
            message: '登录成功',
            type: 'success'
          })
        },
        fail: (error) => {
          log('onLoginError', error)

          this.$message({
            showClose: true,
            message: error.msg,
            type: 'error'
          })
        }
      })
    },
    setDatas (datas) {
      const viewer = datas.viewer
      this.setViewer(viewer)

      const template = datas.template
      this.setTemplate(template)

      this.name = viewer.name
    },
    onBespread (status) {
      this.isBespread = status
    },
    destroy () {
      this.HD && this.HD.destroy({
        success: () => {
          log('退出成功')
        },
        fail: () => {
          log('退出失败')
        }
      })
    },
    ...mapMutations(['setViewer', 'setOptions', 'setTemplate'])
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.destroy()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~styles/mixins.styl"

  .wrapper
    .container
      width-height-full()
      position absolute
      overflow hidden
      .header
        min-width 831px; /*no*/
        position absolute
        width 100%
        z-index 1
      .main
        min-width 1441px; /*no*/
        background rgba(238, 233, 239, 1)
        layout-full(80px, 0, 0, 0)
        box-sizing border-box
        padding 29px 95px 100px
        .left
          width 1230px
          height 100%
          float left
        .bespread
          width 1730px
        .right
          box-sizing border-box
          padding-left 20px
          width 500px
          height 100%
          float left
</style>
