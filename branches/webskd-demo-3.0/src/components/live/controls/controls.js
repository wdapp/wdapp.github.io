import Component from "common/component";
import node from "./controls.html";
import "./controls.scss";

class Controls extends Component {
  constructor() {
    super();

    this.render("controls", node, () => {

    });
  }
};

export default Controls;