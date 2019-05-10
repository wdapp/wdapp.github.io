import Component from "common/component";
import node from "./questionAnswer.html";
import "./questionAnswer.scss";

class QuestionAnswer extends Component {
  constructor() {
    super();

    this.render("questionAnswer", node, () => {

    });
  }
};

export default QuestionAnswer;