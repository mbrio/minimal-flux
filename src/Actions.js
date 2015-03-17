import { EventEmitter } from 'eventemitter3';
import Constant from './Constant';

export default class Actions extends EventEmitter {
  /**
   * Dispatches a Flux action
   * @param  {Constant} action The action to dispatch
   * @param  {...mixed} args   The arguments being passed to the handler
   * @return {boolean}         true if event had listeners, false otherwise
   */
  dispatch(action, ...args) {
    if (!(action instanceof Constant)) {
      console.warn(
        `${this.constructor.name} tried emitting a non-constant. ` +
        `This action is not supported and can therefore not be dispatched.`
      );
      return;
    }

    if(typeof this[action.name] !== 'function') {
      console.warn(
        `${this.constructor.name} emitted \`${action.name}\`. ` +
        `This action is not implemented and can therefore not be dispatched.`
      );
    }

    return super.emit('dispatch', action, ...args);
  }

}