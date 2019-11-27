<template>
  <div class="player-wrapper">
    <div class="live-player" id="livePlayer"></div>
  </div>
</template>

<script>
import HuodeScene from "common/websdk/live";
import Mixins from "common/mixins";
import { mapState, mapMutations } from "vuex";
import { log } from "common/utils";

export default {
  name: "Player",
  mixins: [Mixins],
  computed: {
    ...mapState(["playState"])
  },
  methods: {
    ...mapMutations(["changePlayState"]),
    addEvents() {
      this.hd.onPlayerLoad(video => {
        const player = video;

        this.on("toggleplay", () => {
          log("playState", this.playState);
          if (this.playState) {
            player.pause();
          } else {
            player.play();
          }
        });

        this.on("play", () => {
          log("play");
          player.play();
        });

        player.addEventListener("play", () => {
          this.changePlayState(true);
          log("play");
        });

        player.addEventListener("pause", () => {
          this.changePlayState(false);
          log("pause");
        });

        player.addEventListener("ended", () => {
          this.changePlayState(false);
          log("ended");
        });
      });
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

.player-wrapper
  width-height-full()
  background-color $c333
  .live-player
    width-height-full()
</style>
