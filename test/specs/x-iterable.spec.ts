import test from 'ava';
import * as sinon from 'sinon';
import XIterable, { XBidirectedIterable } from '../../src/entities/x-iterable';

test('Can create valid XIterable from expressions', t => {
    let array = [1, 2, 3],
        iterable = new XIterable(() => array[Symbol.iterator]());
    t.truthy(iterable);
    t.deepEqual([...iterable], array);
});

test('Can chain filters and maps', t => {
    let array = [1, 2, 3, 4, 5],
        iterable = new XIterable(() => array[Symbol.iterator]());
    let test = iterable.filter(x => x > 2)
        .map(x => x * 2)
        .filter(x => x < 9)
        .map(x => x - 1);
    t.deepEqual([...test], [5, 7]);
});

test('XIterableIterator iterates only one time over the elements', t => {
    let array = [1, 2, 3],
        iterable = new XIterable(() => array[Symbol.iterator]());
    let test = iterable[Symbol.iterator]();
    t.deepEqual([...test], [1, 2, 3]);
    t.deepEqual([...test], []);
});

test('XIterableIterator can be used both as an iterator and as an iterable', t => {
    let array = [1, 2, 3],
        iterable = new XIterable(() => array[Symbol.iterator]());
    let test = iterable[Symbol.iterator]();
    t.is(test.next().value, 1);
    t.deepEqual([...test], [2, 3]);
});

test('XIterables, maps and filters executes deferredly', t => {
    let array = [1, 2, 3, 4, 5],
        iteratorStub = sinon.stub().returns(array[Symbol.iterator]()),
        iterable = new XIterable(iteratorStub),
        filterStub = sinon.stub().returns(true)
            .onFirstCall().returns(false)
            .onSecondCall().returns(false),
        mapStub = sinon.stub().returns(42);
    let test = iterable.filter(filterStub)
        .map(mapStub);
    // Nothing is called... yet :3
    t.true(iteratorStub.notCalled);
    t.true(filterStub.notCalled);
    t.true(mapStub.notCalled);
    // And here comes some action
    t.is(test.next().value, 42);
    t.true(iteratorStub.calledOnce);
    t.true(filterStub.calledThrice);
    t.true(mapStub.calledOnce);
    // And some more
    t.deepEqual([...test], [42, 42]);
    t.true(iteratorStub.calledOnce);
    t.true(mapStub.calledThrice);
});

test('Can create valid XBidirectedIterable from expressions', t => {
    let array = [1, 2, 3],
        array2 = [3, 2, 1],
        iterable = new XBidirectedIterable(
            () => array[Symbol.iterator](),
            () => array2[Symbol.iterator]());
    t.truthy(iterable);
    t.deepEqual([...iterable], array);
    t.deepEqual([...iterable.backwards], array2);
});