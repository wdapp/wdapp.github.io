/**
 * 状态机
 * */
import JavasSriptStateMachine from 'javascript-state-machine'

class StateMachine extends JavasSriptStateMachine {
  constructor(options) {
    super(options)
    this.cacheGlobleState(options.name)
  }

  cacheGlobleState(name) {
    if (!window.globleState) {
      window.globleState = {}
    }
    window.globleState[name] = this
  }
}

export default StateMachine

