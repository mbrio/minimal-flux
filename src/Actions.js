import { EventEmitter } from 'eventemitter3';
import Constant from './Constant';

export default class Actions extends EventEmitter {

	emit(event, ...args) {
		let ev = new Constant('test');
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

		// We become a single event emitting object to remove the necessity for the
		// dispatcher to be aware of all potential actions.
		return super.emit(Constant.fluxAction, event, ...args);
	}

	dispatch(...args) {
		return this.emit(...args);
	}

}