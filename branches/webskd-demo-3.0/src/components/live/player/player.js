import Component from "common/component";
import FlashTip from "./flashTip";
import node from "./player.html";
import "./player.scss";

class Player extends Component {
  constructor() {
    super();

    this.render("player", node, () => {
      FlashTip.init();
    });
  }
};

export default Player;