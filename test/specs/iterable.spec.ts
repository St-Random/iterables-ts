import test from 'ava';
import * as sinon from 'sinon';
import AbstractIterable from '../../src/entities/iterable';

// Test iterable implementation; works with array iterator
class TestIterable extends AbstractIterable<number> {
    [Symbol.iterator]() {
        return this._array[Symbol.iterator]();
    }
    constructor(
        private _array: Array<number>
    ) {
        super();
    };
}

test('Iterable iterates & spreads correctly', t => {
    let iterable = new TestIterable([1, 2, 3]);
    let counter = 1;
    // Manual iteration works correctly
    let iterator = iterable[Symbol.iterator]();
    t.is(iterator.next().value, 1);
    t.is(iterator.next().value, 2);
    t.is(iterator.next().value, 3);
    // For-of iteration works correctly
    for (let value of iterable) {
        t.is(value, counter);
        counter++;
    }
    // spreading works correctly
    t.deepEqual([...iterable], [1, 2, 3]);
});

test('Iterable.length works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]);
    t.is(iterable.length, 3);
});

test('Iterable.indexOf works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]);
    t.is(iterable.indexOf(3), 2);
    t.is(iterable.indexOf(1), 0);
    t.is(iterable.indexOf(2), 1);
    t.is(iterable.indexOf(4), -1);
    // searches from specified index
    t.is(iterable.indexOf(3, 2), 2);
    t.is(iterable.indexOf(3, 3), -1);
    // negative index works correctly
    t.is(iterable.indexOf(3, -1), 2);
    t.is(iterable.indexOf(2, -1), -1);
    t.is(iterable.indexOf(2, -999), 1);
});

test('Iterable.includes works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]);
    t.true(iterable.includes(1));
    t.true(iterable.includes(2));
    t.true(iterable.includes(3));
    t.false(iterable.includes(4));
    // searches from specified index
    t.true(iterable.includes(3, 2));
    t.false(iterable.includes(3, 3));
    // negative index works correctly
    t.true(iterable.includes(3, -1));
    t.false(iterable.includes(2, -1));
    t.true(iterable.includes(1, -999));
});

test('Iterable.elementAt works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]);
    t.is(iterable.elementAt(0), 1);
    t.is(iterable.elementAt(1), 2);
    t.is(iterable.elementAt(2), 3);
    t.is(iterable.elementAt(-1), 3);
    t.is(iterable.elementAt(3), undefined);
    t.is(iterable.elementAt(-4), undefined);
});

test('Iterable.some works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        falsyStub = sinon.stub().returns(false),
        truthlyStub = sinon.stub().returns(true),
        obj = { val: 0 };
    t.false(iterable.some(falsyStub));
    t.true(iterable.some(truthlyStub));
    t.true(falsyStub.calledThrice);
    t.true(falsyStub.calledWith(1, 0, iterable));
    t.true(falsyStub.calledWith(2, 1, iterable));
    t.true(falsyStub.calledWith(3, 2, iterable));
    t.true(truthlyStub.calledOnce);
    t.true(truthlyStub.calledWith(1, 0, iterable));
    // passing thisArg test
    function test(el: number) {
        this.val += el;
        return el === 2;
    }
    t.true(iterable.some(test, obj));
    t.is(obj.val, 3);
});

test('Iterable.every works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        falsyStub = sinon.stub().returns(false),
        truthlyStub = sinon.stub().returns(true),
        obj = { val: 0 };
    t.false(iterable.every(falsyStub));
    t.true(iterable.every(truthlyStub));
    t.true(falsyStub.calledOnce);
    t.true(falsyStub.calledWith(1, 0, iterable));
    t.true(truthlyStub.calledThrice);
    t.true(truthlyStub.calledWith(1, 0, iterable));
    t.true(truthlyStub.calledWith(2, 1, iterable));
    t.true(truthlyStub.calledWith(3, 2, iterable));
    // passing this arg
    function test(el: number) {
        this.val += el;
        return el < 2;
    }
    t.false(iterable.every(test, obj));
    t.is(obj.val, 3);
});

test('Iterable.find works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        falsyStub = sinon.stub().returns(false),
        truthlyStub = sinon.stub().returns(true),
        obj = { val: 0 };
    t.is(iterable.find(falsyStub), undefined);
    t.is(iterable.find(truthlyStub), 1);
    t.true(falsyStub.calledThrice);
    t.true(falsyStub.calledWith(1, 0, iterable));
    t.true(falsyStub.calledWith(2, 1, iterable));
    t.true(falsyStub.calledWith(3, 2, iterable));
    t.true(truthlyStub.calledOnce);
    t.true(truthlyStub.calledWith(1, 0, iterable));
    // passing thisArg test
    function test(el: number) {
        this.val += el;
        return el === 2;
    }
    t.is(iterable.find(test, obj), 2);
    t.is(obj.val, 3);
});

test('Iterable.findIndex works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        falsyStub = sinon.stub().returns(false),
        truthlyStub = sinon.stub().returns(true),
        obj = { val: 0 };
    t.is(iterable.findIndex(falsyStub), -1);
    t.is(iterable.findIndex(truthlyStub), 0);
    t.true(falsyStub.calledThrice);
    t.true(falsyStub.calledWith(1, 0, iterable));
    t.true(falsyStub.calledWith(2, 1, iterable));
    t.true(falsyStub.calledWith(3, 2, iterable));
    t.true(truthlyStub.calledOnce);
    t.true(truthlyStub.calledWith(1, 0, iterable));
    // passing thisArg test
    function test(el: number) {
        this.val += el;
        return el === 2;
    }
    t.is(iterable.findIndex(test, obj), 1);
    t.is(obj.val, 3);
});

test('Iterable.forEach works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        forEachStub = sinon.stub(),
        obj = { val: 0 };
    iterable.forEach(forEachStub);
    t.true(forEachStub.calledThrice);
    t.true(forEachStub.calledWith(1, 0, iterable));
    t.true(forEachStub.calledWith(2, 1, iterable));
    t.true(forEachStub.calledWith(3, 2, iterable));
    // passing thisArg test
    function test(el: number) {
        this.val += el;
    }
    iterable.forEach(test, obj);
    t.is(obj.val, 6);
});

test('Iterable.reduce works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        reduceStub = sinon.stub().returns(42),
        obj = { val: 0 };
    t.is(iterable.reduce(reduceStub), 42);
    t.true(reduceStub.calledThrice);
    t.true(reduceStub.calledWith(undefined, 1, 0, iterable)); // cause didn't specified accumulator
    t.true(reduceStub.calledWith(42, 2, 1, iterable));
    t.true(reduceStub.calledWith(42, 3, 2, iterable));
    // passing thisArg & seed test
    function test(accumulator: number, el: number) {
        accumulator += el;
        this.val += el;
        return accumulator;
    }
    t.is(iterable.reduce(test, 42, obj), 48);
    t.is(obj.val, 6);
});

test('Iterable.filter works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        falsyStub = sinon.stub().returns(false),
        truthlyStub = sinon.stub().returns(true),
        obj = { val: 0 };
    let filtered = iterable.filter(falsyStub);
    // Executes deferredly
    t.true(falsyStub.notCalled);
    t.true(filtered.next().done);
    t.true(falsyStub.calledThrice);
    t.true(falsyStub.calledWith(1, 0, iterable));
    t.true(falsyStub.calledWith(2, 1, iterable));
    t.true(falsyStub.calledWith(3, 2, iterable));

    t.deepEqual([...iterable.filter(truthlyStub)], [1, 2, 3]);
    t.true(truthlyStub.calledThrice);
    // passing thisArg test
    function test(el: number) {
        this.val += el;
        return el >= 2;
    }
    t.deepEqual([...iterable.filter(test, obj)], [2, 3]);
    t.is(obj.val, 6);
});

test('Iterable.map works correctly', t => {
    let iterable = new TestIterable([1, 2, 3]),
        mapStub = sinon.stub().returns(true),
        obj = { val: 0 };
    let map = iterable.map(mapStub);
    // Executes deferredly
    t.true(mapStub.notCalled);
    for (let val of map) {
        t.true(val);
    }
    t.true(mapStub.calledThrice);
    t.true(mapStub.calledWith(1, 0, iterable));
    t.true(mapStub.calledWith(2, 1, iterable));
    t.true(mapStub.calledWith(3, 2, iterable));
    // passing thisArg test
    function test(el: number) {
        this.val += el;
        return el * 2;
    }
    t.deepEqual([...iterable.map(test, obj)], [2, 4, 6]);
    t.is(obj.val, 6);
});

test('Empty iterables behave correctly', t => {
    let iterable = new TestIterable([]);
    let stub = sinon.stub().returns(true);

    // Spreading & iteration works correctly
    t.deepEqual([...iterable], []);
    for (let val of iterable) {
        stub();
    }
    t.true(stub.notCalled);
    // length calculates correctly
    t.is(iterable.length, 0);
    // indexOf work correctly
    t.is(iterable.indexOf(0), -1);
    // includes work correctly
    t.false(iterable.includes(1));
    // elementAt works correctly
    t.is(iterable.elementAt(0), undefined);
    // some works correctly
    t.false(iterable.some(stub));
    t.true(stub.notCalled);
    // every works correctly
    t.true(iterable.every(stub));
    t.true(stub.notCalled);
    // find works correctly
    t.is(iterable.find(stub), undefined);
    t.true(stub.notCalled);
    // find index works correctly
    t.is(iterable.findIndex(stub), -1);
    t.true(stub.notCalled);
    // foreach works correctly
    iterable.forEach(stub);
    t.true(stub.notCalled);
    // reduce works correctly
    t.is(iterable.reduce(stub), undefined);
    t.true(stub.notCalled);
    // reduce works correctly
    t.true(iterable.filter(stub).next().done);
    t.true(stub.notCalled);
    // map works correctly
    t.true(iterable.map(stub).next().done);
    t.true(stub.notCalled);
});