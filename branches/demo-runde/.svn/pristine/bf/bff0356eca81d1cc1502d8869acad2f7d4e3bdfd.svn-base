<template>
  <div class="swiper-wrapper">
    <div class="swiper-navigation" v-show="navigation">
      <van-tabs
        v-model="active"
        title-active-color="#FF454B"
        title-inactive-color="#666666"
        :ellipsis="true"
        @change="onTabsChange"
      >
        <van-tab
          :title="tab.title"
          v-for="(tab, key) of options"
          :key="key"
          :disabled="disabled"
        ></van-tab>
      </van-tabs>
    </div>
    <div class="swiper-wrap">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(option, key) of options" :key="key">
          <slot :name="option.name"></slot>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "Swiper",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    navigation: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: 0,
      swiperOption: {
        allowSlidePrev: !this.disabled,
        allowSlideNext: !this.disabled,
        on: {
          slideChangeTransitionStart: () => {
            this.active = this.swiper.activeIndex;
          }
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  methods: {
    onTabsChange(index) {
      this.swiper.slideTo(index, 300, false);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.swiper-wrapper
  width-height-full()
  display flex
  flex-direction column
  .swiper-navigation
    position relative
    z-index 2
    width 100%
    height 80px
    background-color $fff
    box-shadow 0px 1px 0px 0px $ddd
    >>> .van-tabs
      height 100%
      .van-tabs__wrap
        height 100%
        .van-tabs__nav
          height 100%
          .van-tab
            line-height 80px
            .van-ellipsis
              baseTextStyle(30px, $c666, $boldFontWeight, $baseFontFamily)
              color inherit
  .swiper-wrap
    flex 1
    >>> .swiper-container
      height 100%
      .swiper-wrapper
        height 100%
        .swiper-slide
          height 100%
          background-color $fff
</style>
