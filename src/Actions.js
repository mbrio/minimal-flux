import { EventEmitter } from 'eventemitter3';
import Constant from './Constant';

export default class Actions extends EventEmitter {

  dispatch(event, ...args) {
    if (!(event instanceof Constant)) {
      console.warn(
        `${this.constructor.name} tried emitting a non-constant. ` +
        `This action is not supported and can therefore not be dispatched.`
      );
      return;
    }

    if(typeof this[event.name] !== 'function') {
      console.warn(
        `${this.constructor.name} emitted \`${event.name}\`. ` +
        `This action is not implemented and can therefore not be dispatched.`
      );
    }

    return super.emit('dispatch', event, ...args);
  }

}