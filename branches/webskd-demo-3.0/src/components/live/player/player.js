import "./common";
import "./player.scss";
import Render from "../../../common/render";
import node from "./player.html";

class Player extends Render {
  constructor() {
    super();

    this.render("player", node, () => {

    });
  }
};

export default Player;