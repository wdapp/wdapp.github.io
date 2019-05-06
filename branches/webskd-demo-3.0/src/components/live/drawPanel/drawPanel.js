import "./drawPanel.scss";
import Render from "../../../common/render";
import node from "./drawPanel.html";

class drawPanel extends Render {
  constructor() {
    super();

    this.render("document", node, () => {

    });
  }
};

export default drawPanel;