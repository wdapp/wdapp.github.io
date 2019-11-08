<template>
  <div class="emoticon-wrapper">
    <div class="emoticon-group">
      <common-swiper :options="swiper.options" :navigation="swiper.navigation">
        <div :slot="key" v-for="(tags, key) of arrays" :key="key">
          <van-grid :border="false" :column-num="columnNum" square>
            <van-grid-item
              v-for="(tag, index) of tags"
              :key="index"
              @click="onEmoticonClick(tag)"
            >
              <van-image
                width="28"
                hegiht="28"
                :src="
                  require('assets/images/emoticon/em2/em2_200/' + tag + '.png')
                "
              />
            </van-grid-item>
          </van-grid>
        </div>
      </common-swiper>
    </div>
    <div class="emoticon-footer">
      <div class="btn-group">
        <div class="smile-wrap">
          <span class="smile-icon"></span>
        </div>
        <div class="send-wrap">
          <span class="send-text">发送</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonSwiper from "components/swiper/Swiper";
import { log } from "common/utils";

export default {
  name: "Emoticon",
  components: {
    CommonSwiper
  },
  data() {
    return {
      total: 100,
      arrays: [],
      columnNum: 8,
      singleNum: 24,
      swiper: {
        navigation: false,
        options: []
      }
    };
  },
  computed: {
    pagination() {
      return this.swiper.options.length;
    }
  },
  methods: {
    onEmoticonClick(tag) {
      log(tag);
    },
    createTwoDimensionalArray() {
      const total = this.total;
      const singleNum = this.singleNum;
      const totalNum = Math.ceil(total / singleNum);
      let arrays = [];
      for (let i = 0; i < totalNum; i++) {
        const option = {
          name: i,
          title: ""
        };
        this.swiper.options.push(option);
        arrays[i] = [];
        for (let j = 0; j < singleNum; j++) {
          const index = j + i * singleNum + 201;
          if (index > 300) {
            break;
          }
          arrays[i].push(index);
        }
      }
      this.arrays = arrays;
    }
  },
  mounted() {
    this.createTwoDimensionalArray();
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.emoticon-wrapper
  .emoticon-group
    width 100%
    height 300px
    padding 10px
    box-sizing border-box
  .emoticon-footer
    height 100px
    width 100%
    border-top 1px solid $ddd
    .btn-group
      width-height-full()
      .smile-wrap
        width-height-same(99px)
        float left
        background-color $eee
        .smile-icon
          bg-image('smile', 50)
          vertical-horizontally(50, 50)
      .send-wrap
        width 130px
        height 99px
        background-color $red
        float right
        line-height 99px
        text-align center
        .send-text
          baseTextStyle(32px, $fff)
</style>
