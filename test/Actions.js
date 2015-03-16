import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Constant from './../src/Constant';
import Actions from './../src/Actions';

let warnings = [];
console.warn = function(msg) {
    warnings.push(msg);
};

let fooConstants = Constant.createConstants('foo', 'foo3', 'foo4');

class FooActions extends Actions {
    foo(a) {
        this.dispatch(fooConstants.foo, a);
    }
    foo2(a) {
        this.foo3(a);
    }
    foo3(a) {
        this.dispatch(fooConstants.foo3, a);
    }
    foo4(a, b, c) {
        this.dispatch(fooConstants.foo4, a, b, c);
    }
}

class BarActions extends Actions {
    bar(a) {
        this.actions.foo.foo(a);
    }
}

let bar2Constants = Constant.createConstants('bar2', 'notimplemented');
class Bar2Actions extends BarActions {
    bar2() {
        this.dispatch(bar2Constants.bar2);
    }
    bar3() {
        this.dispatch(bar2Constants.notimplemented);
    }
}

let dispatched = [];
class TestDispatcher extends Dispatcher {
    dispatch(...args) {
        dispatched.push([...args]);
    }
}

var flux = new TestDispatcher({
    actions: {
        foo: FooActions,
        bar: BarActions,
        bar2: Bar2Actions
    }
});

test('Actions: create actions', (t) => {

    t.ok(flux.actions.foo !== 'undefined',
        'should create actions');

    t.end();
});


test('Actions: decorators delegation', (t) => {
    dispatched = [];
    flux.actions.foo.foo('foo');

    t.deepEqual(dispatched, [[fooConstants.foo, 'foo']],
        'should invoke actual action');

    t.end();
});

test('Actions: call actions with multiple arguments', (t) => {
    dispatched = [];
    flux.actions.foo.foo4('one', 'two', 'three');

    t.deepEqual(dispatched, [[fooConstants.foo4, 'one', 'two', 'three']],
        'should invoke own actions');

    t.end();
});

test('Actions: call own actions', (t) => {
    dispatched = [];
    flux.actions.foo.foo2('foo2');

    t.deepEqual(dispatched, [[fooConstants.foo3, 'foo2']],
        'should invoke own actions');

    t.end();
});

test('Actions: call other actions', (t) => {
    dispatched = [];
    flux.actions.bar.bar('bar');

    t.deepEqual(dispatched, [[fooConstants.foo, 'bar']],
        'should invoke other actions');

    t.end();
});

test('Actions: decorators', (t) => {
    let actions = flux.actions.foo;

    t.notOk(actions instanceof FooActions,
        'should decorate actions');

    t.deepEqual(Object.keys(actions), ['foo', 'foo2', 'foo3', 'foo4'],
        'should decorate each action');

    t.notOk(typeof actions.addListener === 'function',
        'should not decorate eventemitter functions');

    t.end();
});

test('Actions: decorators multiple inheritance', (t) => {
    let actions = flux.actions.bar2;

    t.notOk(actions instanceof Bar2Actions,
        'should decorate actions');

    t.ok(typeof actions.bar === 'function',
        'should decorate inherited actions');

    t.ok(typeof actions.bar2 === 'function',
        'should decorate own actions');

    t.end();
});

test('Actions: warn when emitting not implemented actions', (t) => {
    warnings = [];
    flux.actions.bar2.bar3();
    t.deepEqual(warnings, ['Bar2Actions emitted `notimplemented`. This action is not implemented and can therefore not be dispatched.']);
    t.end();
});