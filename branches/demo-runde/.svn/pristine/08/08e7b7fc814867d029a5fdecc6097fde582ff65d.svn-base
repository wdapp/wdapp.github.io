<template>
  <div class="curriculum-wrapper">
    <van-tabs v-model="tabOptions.active">
      <van-tab
        :title="tab.title"
        v-for="(tab, key) of tabOptions.tabs"
        :key="key"
        :disabled="disabled(tab.title)"
      >
        <component :is="tab.component" :options="tab.options"></component>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import CurriculumList from "./List";

export default {
  name: "Curriculum",
  components: {
    CurriculumList
  },
  data() {
    return {
      tabOptions: {
        active: 0,
        tabs: [
          {
            title: "推荐课程",
            component: "CurriculumList",
            options: [
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签", "标签标签"]
              },
              {
                thumb: require("images/course.png"),
                title: "药店大学课程班型",
                tags: ["标签标签1", "标签2"]
              }
            ]
          },
          {
            title: "",
            component: ""
          },
          {
            title: "",
            component: ""
          },
          {
            title: "",
            component: ""
          }
        ]
      }
    };
  },
  methods: {
    disabled(title) {
      let disabled = false;
      if (!title) {
        disabled = true;
      }
      return disabled;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.curriculum-wrapper
  >>> .van-tabs
    .van-tabs__wrap
      height 80px
      .van-tabs__nav
        height 100%
        .van-tab
          height 100%
          line-height 80px
          .van-ellipsis
            baseTextStyle(32px, $c333, $boldFontWeight)
</style>
