<template>
  <div class="sub-wrapper" v-show="show">
    <div class="sub-windows" v-show="showSubWindows"></div>
    <div class="sub-panel">
      <panel :name="name" :number="number" @opengift="onOpenGift"></panel>
    </div>
  </div>
</template>

<script>
import Panel from "./components/Panel";
import HuodeScene from "common/websdk/live";

export default {
  name: "PanelIndex",
  components: {
    Panel
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    showSubWindows: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      name: "...",
      number: 0
    };
  },
  watch: {
    showSubWindows() {
      this.bus.$emit("scrollrefresh");
    }
  },
  methods: {
    addEvents() {
      this.hd.onUserCount(number => {
        this.number = parseInt(number);
      });
      this.hd.onOnlineTeachers(datas => {
        if (!datas || !datas.teachers || !datas.teachers.length) {
          return;
        }
        const teachers = datas.teachers;
        let teacher = {};
        const role = "publisher";
        for (let i = 0; i < teachers.length; i++) {
          const target = teachers[i];
          if (target.role === role && target.name) {
            teacher = target;
            break;
          }
        }
        const name = teacher.name;
        this.name = name;
      });
    },
    onOpenGift() {
      this.$emit("opengift");
    }
  },
  mounted() {
    this.hd = new HuodeScene();
    this.addEvents();
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/mixins.styl"

.sub-wrapper
  width 100%
  border-bottom 1px $ddd solid
  display flex
  flex-direction row
  .sub-windows
    width 300px
    height 168px
    position relative
  .sub-panel
    flex 1
</style>
