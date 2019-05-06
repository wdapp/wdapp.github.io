import StateMachine from "javascript-state-machine";
import Utils from "./utils";

const stateMachine = (function (options) {
  let _instance;
  return function () {
    if (!_instance) {
      _instance = new StateMachine(options);
    }
    return _instance;
  };
})({
  init: "quiting",
  transitions: [
    {name: "login", from: "quiting", to: "loging"},
    {name: "quit", from: "loging", to: "quiting"},
  ],
  methods: {
    onLogin: function () {
      Utils.log("login");
    },
    onQuit: function () {
      Utils.log("quit");
    }
  }
});

export default stateMachine;

