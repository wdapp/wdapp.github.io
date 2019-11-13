<template>
  <div class="login-wrapper">
    <van-cell-group>
      <van-cell>
        <van-field
          v-model="url"
          required
          clearable
          label="地址"
          placeholder="请输观看地址（必须）"
          size="large"
        />
      </van-cell>
      <van-cell>
        <van-field
          v-model="viewername"
          clearable
          label="用户名"
          placeholder="请输入用户昵称（可选）"
          size="large"
        />
      </van-cell>
      <van-cell>
        <van-field
          v-model="viewertoken"
          clearable
          type="password"
          label="密码"
          placeholder="请输入直播间密码（可选）"
          size="large"
        />
      </van-cell>
      <van-cell>
        <van-button
          class="btn"
          type="info"
          size="large"
          @click="handleBtnClick(1)"
        >登录公开课
        </van-button
        >
      </van-cell>
      <van-cell>
        <van-button
          class="btn"
          type="info"
          size="large"
          @click="handleBtnClick(2)"
        >登录专题课
        </van-button
        >
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "Index",
  data() {
    return {
      url: "",
      viewername: "",
      viewertoken: ""
    };
  },
  computed: {
    ...mapState({
      currentUrl: "url"
    }),
    ...mapGetters(["getOptions"])
  },
  methods: {
    ...mapMutations(["changeUrl"]),
    handleBtnClick(type) {
      const name = this.viewername;
      const token = this.viewertoken;
      const _type = type;
      const params = `&viewername=${name}&viewertoken=${token}`
      const url = this.url;
      this.changeUrl(url);
      const options = this.getOptions();
    }
  },
  mounted() {
    this.url = this.currentUrl;
  }
};
</script>

<style lang="stylus" scoped>
@import '~styles/mixins.styl'

.login-wrapper
  position absolute
  wrapper()
  background-color $ddd
</style>
