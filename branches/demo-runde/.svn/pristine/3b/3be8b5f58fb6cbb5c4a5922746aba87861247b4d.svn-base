<template>
  <div class="wrapper">
    <div class="top">
      <main-windows
        ref="document"
        :component="toggleMainSubComponent(windows.toggle)"
      >
        <live-controls
          :isSubShow="windows.show"
          :hideSwitchBtn="hideSwitchBtn"
          @switch="onControlsSwitch"
          @open="onControlsOpen"
          @show="onControlsShow"
          slot="controls"
        ></live-controls>
      </main-windows>
    </div>
    <div class="center">
      <live-panel
        :show="panel.show"
        :showSubWindows="panel.showSubWindows"
        @opengift="onOpenGift"
      ></live-panel>
    </div>
    <div class="bottom" :style="bottomStyle">
      <common-swiper
        :options="swiper.options"
        :disabled="swiper.disabled"
        :navigation="swiper.navigation"
      >
        <live-chats slot="chats"></live-chats>
        <live-lists slot="lists"></live-lists>
        <live-introduce slot="introduce"></live-introduce>
      </common-swiper>
    </div>
    <common-popup :show="popup.show" @closed="onClosed">
      <component :is="popup.component"></component>
    </common-popup>
    <common-questionnaire :questionnaire="questionnaire"></common-questionnaire>
    <common-attendance></common-attendance>
    <sub-windows
      ref="player"
      :type="windows.type"
      :show="windows.show"
      :closeable="windows.closeable"
      :component="toggleMainSubComponent(!windows.toggle)"
      @close="onSubClose"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @reset="onReset"
    ></sub-windows>
  </div>
</template>

<script>
import MainWindows from "./components/windows/MainWindows";
import SubWindows from "./components/windows/SubWindows";
import LivePanel from "./components/panel/Index";
import LiveChats from "./components/chats/Chats";
import CommonSwiper from "components/swiper/Swiper";
import HuodeScene from "common/websdk/live";
import { mapMutations } from "vuex";
import { log } from "common/utils";
import Mixins from "common/mixins";
const LiveControls = () => ({
  component: import("./components/controls/Controls")
});
const CommonPopup = () => ({
  component: import("components/popup/Popup")
});
const CommonCurriculum = () => ({
  component: import("components/curriculum/Curriculum")
});
const CommonGifts = () => ({
  component: import("components/gifts/Gifts")
});
const CommonReward = () => ({
  component: import("components/reward/Reward")
});
const CommonQuestionnaire = () => ({
  component: import("common/components/questionnaire/Questionnaire")
});
const CommonAttendance = () => ({
  component: import("common/components/attendance/Attendance")
});
const LiveLists = () => ({
  component: import("./components/lists/Lists")
});
const LiveIntroduce = () => ({
  component: import("./components/introduce/Introduce")
});

export default {
  name: "Live",
  mixins: [Mixins],
  components: {
    MainWindows,
    SubWindows,
    LivePanel,
    LiveControls,
    LiveChats,
    LiveLists,
    LiveIntroduce,
    CommonSwiper,
    CommonPopup,
    CommonCurriculum,
    CommonGifts,
    CommonReward,
    CommonQuestionnaire,
    CommonAttendance
  },
  data() {
    return {
      bottomStyle: {
        flex: 1
      },
      windows: {
        mainComponent: "LivePlayer",
        subComponent: "LiveDocument",
        type: "public", // 公开课 public 专题课 special
        toggle: true,
        show: true,
        closeable: true
      },
      panel: {
        show: true,
        showSubWindows: true
      },
      swiper: {
        disabled: true,
        navigation: false,
        options: [
          {
            name: "chats",
            title: "聊天"
          },
          {
            name: "lists",
            title: "直播目录"
          },
          {
            name: "introduce",
            title: "讲师介绍"
          }
        ]
      },
      popup: {
        show: false,
        component: ""
      },
      questionnaire: {},
      hideSwitchBtn: true
    };
  },
  computed: {
    windowsShow() {
      return this.windows.show;
    }
  },
  watch: {
    windowsShow(newValue) {
      this.panel.showSubWindows = newValue;
    }
  },
  methods: {
    ...mapMutations(["setViewer", "setTemplate"]),
    init() {
      this.hd = new HuodeScene();
      this.login();
      this.onEvents();
    },
    onEvents() {
      this.on("curriculumclick", options => {
        this.showPopup(options);
      });
      this.on("giftsclick", options => {
        this.showPopup(options);
      });
      this.on("rewardclick", options => {
        this.showPopup(options);
      });
      this.on("closePopup", () => {
        this.closePopup();
      });
      this.hd.onQuestionnairePublish(data => {
        log("onQuestionnairePublish", data);
        if (data.success) {
          this.formateQuestionnaire(data.datas);
        }
      });
    },
    showPopup(options) {
      this.popup.show = true;
      this.popup.component = options.component;
    },
    closePopup() {
      this.popup.show = false;
    },
    onClosed() {
      this.closePopup();
    },
    toggleMainSubComponent(toggle) {
      const _toggle = toggle;
      const main = this.windows.mainComponent;
      const sub = this.windows.subComponent;
      const is = _toggle ? main : sub;
      return is;
    },
    configMold(type = "0") {
      // "0" 公开课，"1" 专题课
      if (type === "0") {
        log("公开课");
        this.windows.type = "public"; // 更新公开课小窗位置
        this.panel.show = true; // 显示panel
        this.swiper.disabled = true; // 禁用swiper
        this.swiper.navigation = false; // 隐藏tabs
      } else if (type === "1") {
        log("专题课");
        this.windows.type = "special"; // 更新专题课小窗位置
        this.panel.show = false; // 隐藏panel
        this.swiper.disabled = false; // 激活swiper
        this.swiper.navigation = true; // 显示tabs
      }
    },
    login() {
      const options = this.$route.query;
      log(options);

      const type = options.type;
      this.configMold(type);

      this.hd.login({
        userId: options.userid,
        roomId: options.roomid,
        viewerName: options.viewername,
        viewerToken: options.viewertoken,
        success: result => {
          this.configPlayerAndDocument();
          this.setViewer(result.viewer);
          const template = result.template;
          this.setTemplate(result.template);
          this.configTemplate(template);
          log("onLoginSuccess", result);
          this.$notify({ type: "success", message: "登录成功" });
        },
        fail: error => {
          log("onLoginError", error);
          this.$notify({ type: "danger", message: "登录失败" });
        }
      });
    },
    configTemplate(tem) {
      /*
       * 模板 1 ：视频
       * 模板 2 ：视频、聊天、问答
       * 模板 3 ：视频、聊天
       * 模板 4 ：视频、文档、聊天
       * 模板 5 ：视频、文档、聊天、问答
       * 模板 6 ：视频、问答
       * */

      if (tem.type !== 4 && tem.type !== 5) {
        this.hideSwitchBtn = false; // 隐藏切换按钮
        this.onControlsSwitch(false); // 切换视频为主
        this.windows.show = false; // 关闭小窗
        this.panel.showSubWindows = false; //隐藏小窗时候，panel收缩
      }
    },
    configPlayerAndDocument() {
      this.hd.showControl(false);
      this.hd.docAdapt(true);
    },
    onControlsSwitch(toggle) {
      let player = this.$refs.player.$refs.player.$el;
      let panel = this.$refs.document.$refs.document.$el;
      let mainParent = this.$refs.document.$refs.mainParent;
      let subParent = this.$refs.player.$refs.subParent;
      this.windows.toggle = toggle;
      if (toggle) {
        mainParent.appendChild(panel);
        subParent.appendChild(player);
      } else {
        mainParent.appendChild(player);
        subParent.appendChild(panel);
      }
      this.emit("play");
    },
    onControlsOpen() {
      this.windows.show = true;
    },
    onControlsShow(show) {
      this.windows.closeable = show;
    },
    onSubClose() {
      this.windows.show = false;
    },
    onDragEnter() {
      this.panel.showSubWindows = true;
    },
    onDragLeave() {
      this.panel.showSubWindows = false;
    },
    onReset() {
      this.bottomStyle.flex = "auto";
      this.$nextTick(() => {
        this.bottomStyle.flex = "1";
      });
    },
    // 打开礼物面板

    onOpenGift() {
      const options = {
        component: "CommonGifts"
      };
      this.showPopup(options);
    },

    // 问卷问答

    formateQuestionnaire(data) {
      const questionnaire = data.questionnaire;
      const subjects = questionnaire.subjects[0];
      const options = subjects.options;

      const optionIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      const _questionnaire = {};

      _questionnaire.questionnaireId = questionnaire.id;
      _questionnaire.forcibly = questionnaire.forcibly; // 是否强制用户回答
      _questionnaire.submitedAction = questionnaire.submitedAction; // 是否显示正确答案
      _questionnaire.subjectId = subjects.id;
      _questionnaire.title = subjects.content;
      _questionnaire.options = [];

      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        option.key = optionIndex[i];
        if (option.correct) {
          _questionnaire.correct = option.index;
        }
        _questionnaire.options.push(option);
      }

      this.questionnaire = _questionnaire;
    },
    destroy() {
      this.hd &&
        this.hd.destroy({
          success: () => {
            log("退出成功");
          },
          fail: () => {
            log("退出失败");
          }
        });
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.destroy();
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.wrapper
  wrapper()
  position absolute
  display flex
  flex-direction column
  .top
    height 462px
  .center
    height auto
  .bottom
    position relative
    flex 1
</style>
