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
          @click="handleBtnClick(0)"
          >登录公开课
        </van-button>
      </van-cell>
      <van-cell>
        <van-button
          class="btn"
          type="info"
          size="large"
          @click="handleBtnClick(1)"
          >登录专题课
        </van-button>
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
      viewername: "获得场景视频",
      viewertoken: ""
    };
  },
  computed: {
    ...mapState({
      currentUrl: "url"
    }),
    ...mapGetters(["getParamas"])
  },
  methods: {
    ...mapMutations(["changeUrl"]),
    handleBtnClick(type) {
      const name = this.viewername;
      const token = this.viewertoken;
      const _type = type;
      const params = `&viewername=${name}&viewertoken=${token}&type=${_type}`;
      const url = this.url + params;
      this.changeUrl(url);
      const query = this.getParamas;
      this.$router.push({ path: "live", query: query });
    }
  },
  mounted() {
    this.url =
      this.currentUrl ||
      "https://view.csslcloud.net/api/view/index?roomid=D4A2E14A89D372399C33DC5901307461&userid=2876043E67CBDC9D";
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
