import test from 'ava';
import * as sinon from 'sinon';
import LinkedList from '../../src/entities/linked-list';

test('Linked list is created correctly', t => {
    let emptyList = new LinkedList<number>();
    t.is(emptyList.first, undefined);
    t.is(emptyList.last, undefined);
    t.is(emptyList.length, 0);
    let list = new LinkedList([1, 2, 3]);
    t.is(list.first!.value, 1);
    t.is(list.last!.value, 3);
    t.is(list.length, 3);
});

test('Linked list iterates correctly', t => {
    let list = new LinkedList([1, 2, 3]),
        counter = 0;
    for (let node of list) {
        t.is(node.value, ++counter);
    }
    for (let node of list.backwards) {
        t.is(node.value, counter--);
    }
    // Testing values with spreading (since iterables implementation is already tested)
    t.deepEqual([...list.values], [1, 2, 3]);
    t.deepEqual([...list.values.backwards], [3, 2, 1]);
});

test('Linked list prepends values correctly', t => {
    let list = new LinkedList<number>();
    list.prepend(5);
    list.prepend(1);
    let el = list.prepend(3, list.last);
    list.prepend(2, el);
    list.prepend(4, list.last);
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
});

test('Linked list appends values correctly', t => {
    let list = new LinkedList<number>();
    list.append(1);
    list.append(5);
    let el = list.append(3, list.first);
    list.append(4, el);
    list.append(2, list.first);
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
});

test('Linked list prepends many values correctly', t => {
    let list = new LinkedList<number>();
    list.prependMany([1, 5]);
    list.prependMany([2, 3, 4], list.last);
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
});

test('Linked list appends many values correctly', t => {
    let list = new LinkedList<number>();
    list.appendMany([1, 5]);
    list.appendMany([2, 3, 4], list.first);
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
});

test('Linked list reverses correctly', t => {
    let list1 = new LinkedList<number>(),
        list2 = new LinkedList([1]),
        list3 = new LinkedList([1, 2]),
        list4 = new LinkedList([1, 2, 3, 4, 5]);
    list1.reverse();
    list2.reverse();
    list3.reverse();
    list4.reverse();
    t.deepEqual([...list1.values], []);
    t.deepEqual([...list2.values], [1]);
    t.deepEqual([...list3.values], [2, 1]);
    t.deepEqual([...list4.values], [5, 4, 3, 2, 1]);
});

test('Linked list removes nodes correctly', t => {
    let list = new LinkedList([1, 2, 3]),
        truthyStub = sinon.stub().returns(true),
        falsyStub = sinon.stub().returns(false);
    // removes all functions called correctly
    list.removeAll(falsyStub);
    t.true(falsyStub.calledThrice);
    t.deepEqual([...list.values], [1, 2, 3]);
    list.removeAll(truthyStub);
    t.true(truthyStub.calledThrice);
    t.deepEqual([...list.values], []);
    // removes duplicate values
    list = new LinkedList([7, 1, 2, 3, 6, 4, 5, 6, 7, 7]);
    list.remove(6);
    t.deepEqual([...list.values], [7, 1, 2, 3, 4, 5, 7, 7]);
    list.removeAll(x => x.value === 7);
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
    // removal methods testing
    list.removeFirst();
    t.deepEqual([...list.values], [2, 3, 4, 5]);
    list.removeLast();
    t.deepEqual([...list.values], [2, 3, 4]);
    list.remove(list.first!.next!);
    t.deepEqual([...list.values], [2, 4]);
    list.remove(4);
    t.deepEqual([...list.values], [2]);
    list.removeLast();
    t.deepEqual([...list.values], []);
    // removal of deleted nodes does nothing
    list.appendMany([1, 2, 3, 4]);
    let node = list.last!.prev!;
    list.remove(node);
    list.remove(node);
    t.deepEqual([...list.values], [1, 2, 4]);
    // removal from empty list work correctly
    list.removeAll();
    t.deepEqual([...list.values], []);
    list.removeFirst();
    list.removeLast();
    list.remove(42);
    list.removeAll();
    list.removeAll(truthyStub);
    t.deepEqual([...list.values], []);
});

test('Linked list allows mutations during iteration', t => {
    let list = new LinkedList([1, 2, 3, 4, 5]);
    list.forEach((x, i) => {
        if (i! > 2) {
            list.remove(x);
        }
    });
    t.deepEqual([...list.values], [1, 2, 3]);
    list.first!.next!.value = 3;
    list.last!.value = 5;
    list.forEach((x, i) => {
        if (i! > 0) {
            list.prepend(x.value - 1, x);
        }
    });
    t.deepEqual([...list.values], [1, 2, 3, 4, 5]);
});

test('Linked list doesn\'t allow append/prepend operations on deleted nodes', t => {
    let list = new LinkedList([1, 2, 3, 4, 5]),
        node = list.first!.next!;
    list.remove(node);
    t.truthy(node);
    t.is(node.prev, list.first);
    t.is(node.next, list.first!.next);
    t.throws(() => list.append(1, node));
    t.throws(() => list.appendMany([1, 2], node));
    t.throws(() => list.prepend(1, node));
    t.throws(() => list.prependMany([1, 2], node));
});

test('Linked list doesn\'t allow append/prepend operations on nodes\
 from other lists, removal does nothing', t => {

    let list1 = new LinkedList([1, 2, 3, 4, 5]),
        list2 = new LinkedList([1, 2, 3, 4, 5]),
        node = list2.first!;
    list1.remove(node);
    t.deepEqual([...list1.values], [1, 2, 3, 4, 5]);

    t.throws(() => list1.append(1, node));
    t.throws(() => list1.appendMany([1, 2], node));
    t.throws(() => list1.prepend(1, node));
    t.throws(() => list1.prependMany([1, 2], node));
});
