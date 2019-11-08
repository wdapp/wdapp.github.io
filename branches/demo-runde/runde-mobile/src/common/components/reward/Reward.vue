<template>
  <div class="reward-wrapper">
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
import RewardList from "./List";

export default {
  name: "Reward",
  components: {
    RewardList
  },
  data() {
    return {
      tabOptions: {
        active: 0,
        tabs: [
          {
            title: "打赏老师",
            component: "RewardList",
            options: [
              {
                money: 0.88
              },
              {
                money: 1.68
              },
              {
                money: 3.88
              },
              {
                money: 8.88
              },
              {
                money: 18.8
              },
              {
                money: 66.8
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

.van-tabs
  >>> .van-tabs__wrap
    height 80px
    .van-tab
      line-height 80px
      baseTextStyle(32px, $c333, $boldFontWeight)
</style>
