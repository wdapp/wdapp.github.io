<template>
  <div class="wrapper">
    <el-input class="input" v-model="url" placeholder="请输入观看地址"></el-input>
    <el-button
      class="button"
      type="primary"
      @click="handleClick('Live')"
    >
      PC端观看直播
    </el-button>
    <el-button
      class="button"
      type="primary"
      @click="handleClick('Replay')"
    >
      PC端观看回放
    </el-button>
    <el-button
      class="button"
      type="primary"
      @click="handleClick('LiveMobile')"
    >
      移动端观看直播
    </el-button>
  </div>
</template>

<script>
import {isAddress} from 'common/utils'
import {mapState, mapMutations, mapGetters} from 'vuex'

export default {
  name: 'Index',
  data () {
    return {
      // url: 'https://view.csslcloud.net/api/view/index?roomid=20E2BEC88BEF3EEB9C33DC5901307461&userid=B693062ABB8020E0'
      url: ''
    }
  },
  computed: {
    ...mapState({
      currentUrl: 'url'
    }),
    ...mapGetters(['getOptions'])
  },
  methods: {
    handleClick (name) {
      var as = isAddress(this.url)
      if (as) {
        this.changeUrl(this.url)
        this.$router.push({
          name: name,
          params: {
            options: encodeURIComponent(JSON.stringify(this.getOptions))
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: '请输入正确的观看地址',
          type: 'warning'
        })
      }
    },
    ...mapMutations(['changeUrl'])
  },
  mounted () {
    this.url = this.currentUrl
  }
}
</script>

<style lang="stylus" scoped>
  .wrapper
    padding 10px
    .input
      margin-bottom 10px
    .button
      width 100%
      margin-bottom 10px
      margin-left 0
</style>
