<template>
  <div class="list-wrapper">
    <div class="list-group">
      <common-swiper :options="swiper.options" :navigation="swiper.navigation">
        <div :slot="key" :key="key" v-for="(arrays, key) of gifts">
          <van-grid square :border="false">
            <van-grid-item
              class="item"
              v-for="(gift, index) of arrays"
              :class="{ active: active === currentIndex(index, key) }"
              @click="handleGiftClick(index, key, gift)"
              :key="currentIndex(index, key)"
              :icon="gift.url"
              :text="gift.title"
            />
          </van-grid>
        </div>
      </common-swiper>
    </div>
  </div>
</template>

<script>
import CommonSwiper from "components/swiper/Swiper";

export default {
  name: "List",
  components: {
    CommonSwiper
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      gifts: [],
      total: 8,
      active: 0,
      swiper: {
        navigation: false,
        options: []
      }
    };
  },
  methods: {
    configSwiper() {
      let gifts = [];
      const options = this.options;
      const length = options.length;
      const total = this.total;
      const pages = Math.ceil(length / total);
      for (let i = 0; i < pages; i++) {
        const option = {
          name: i,
          title: ""
        };
        this.swiper.options.push(option);
        gifts[i] = [];
        for (let j = 0; j < total; j++) {
          const index = j + i * total;
          if (index > length - 1) {
            break;
          }
          gifts[i].push(options[index]);
        }
      }
      this.gifts = gifts;
    },
    handleGiftClick(index, key, gift) {
      this.active = this.currentIndex(index, key);
      this.$emit("gift", gift);
    },
    currentIndex(index, key) {
      const total = this.total;
      return index + total * key;
    }
  },
  mounted() {
    this.configSwiper();
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.list-wrapper
  overflow auto
  margin-bottom 30px
  margin-top 10px
  .list-group
    >>> .van-image
      width-height-same(150px)
  .item
    position relative
  .active:after
    content ''
    position absolute
    width-height-same(150px)
    border 1px $red solid
    top 0
    left 50%
    margin-left -75px
    border-radius 4px
</style>
