import AbstractIterable from './iterable';
import {
    IXIterable,
    IXIterableIterator,
    IXBidirectedIterable,
    IMapCallback,
    IPredicateCallback
} from '../interfaces/iterable';

type IteratorExpression<T> = () => IterableIterator<T>;

/*
 * X from eXpression;
 * And it sounds cool anyway :3
 */

export class XIterableIterator<T> extends AbstractIterable<T>
    implements IXIterableIterator<T> {

    public [Symbol.iterator]() {
        return this;
    }

    public constructor(
        private readonly _iterator: IterableIterator<T>
    ) {
        super();
    }

    public next(value?: any) {
        return this._iterator.next(value);
    }

    filter(callback: IPredicateCallback<T>, thisArg?: any): XIterableIterator<T> {
         return new XIterableIterator(super.filter(callback, thisArg));
    }
    map<U>(callback: IMapCallback<T, U>, thisArg?: any): XIterableIterator<U> {
         return new XIterableIterator(super.map(callback, thisArg));
    }
}

export default class XIterable<T> extends AbstractIterable<T>
    implements IXIterable<T> {

    public [Symbol.iterator]() {
        return new XIterableIterator(
            this._iteratorExpression());
    }

    public constructor(
        protected _iteratorExpression: IteratorExpression<T>
    ) {
        super();
    }

    filter(callback: IPredicateCallback<T>, thisArg?: any): XIterableIterator<T> {
         return new XIterableIterator(super.filter(callback, thisArg));
    }
    map<U>(callback: IMapCallback<T, U>, thisArg?: any): XIterableIterator<U> {
         return new XIterableIterator(super.map(callback, thisArg));
    }
}

export class XBidirectedIterable<T> extends XIterable<T>
    implements IXBidirectedIterable<T> {

    public readonly backwards: XIterable<T>;

    public constructor(
        iteratorExpression: IteratorExpression<T>,
        backwardsIteratorExpression: IteratorExpression<T>
    ) {
        super(iteratorExpression);
        this.backwards = new XIterable(backwardsIteratorExpression);
    }
}