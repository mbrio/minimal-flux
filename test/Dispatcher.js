import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';
import Constant from './../src/Constant';

let flux;

let fooConstants = Constant.createConstants('foo', 'bar', 'baz');

class FooStore extends Store {

    constructor() {
        this.handleAction(fooConstants.foo, function() {
            flux.actions.foo.bar();
        });
    }

}

class FooActions extends Actions {
    foo() {
        this.dispatch(fooConstants.foo);
    }
    bar() {
        this.dispatch(fooConstants.bar);
    }
}

flux = new Dispatcher({
    stores: {foo: FooStore},
    actions: {foo: FooActions}
});

test('Dispatch while dispatching', (t) => {
    t.throws(() => flux.actions.foo.foo(), 'should throw error');
    t.end();
});