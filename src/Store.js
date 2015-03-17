import { EventEmitter } from 'eventemitter3';
import assign from 'object-assign';
import Constant from './Constant';

export default class Store extends EventEmitter {

    /**
     * Register an action handler
     * @param  {Constant}   id      Id of the action (e.g. 'todos.create')
     * @param  {Function} handler Action handler
     * @return {void}
     */
    handleAction(id, handler) {
        if (typeof handler !== 'function') return;
        if (!(id instanceof Constant)) return;

        if(!this._handlers) this._handlers = {};
        this._handlers[id.toActionId()] = handler.bind(this);
    }

    /**
     * Unregister an action handler
     * @param  {Constant} id  Id of the action (e.g. 'todos.create')
     * @return {void}
     */
    stopHandleAction(id) {
        if (!(id instanceof Constant)) return;

        let actionId = id.toActionId();
        if(!this._handlers || !this._handlers[actionId]) return;
        this._handlers[actionId] = undefined;
    }

    /**
     * Set state
     * @param {Object} state State object
     */
    setState(state) {
        if(!state) return;
        if(!this.state) this.state = {};
        this.state = assign({}, this.state, state);
        this.emit('change', this.state);
    }

    /**
     * Returns the state
     * @return {Object} The state object
     */
    getState() {
        return this.state || {};
    }

}