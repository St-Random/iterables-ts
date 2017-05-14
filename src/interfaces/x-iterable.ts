import IIterable, {
    IPredicateCallback,
    IMapCallback
} from './iterable';

/** Supports iterable iterators and chaining */
interface IXIterable<T> extends IIterable<T> {
    [Symbol.iterator](): IXIterableIterator<T>;
    filter(callback: IPredicateCallback<T>, thisArg?: any): IXIterableIterator<T>;
    map<U>(callback: IMapCallback<T, U>, thisArg?: any): IXIterableIterator<U>;
}

export default IXIterable;

export interface IXIterableIterator<T>
    extends IXIterable<T>, IterableIterator<T> {

    [Symbol.iterator](): IXIterableIterator<T>;
}

/** Supports iteration in backwards direction */
export interface IXBidirectedIterable<T> extends IXIterable<T> {
    // I don't see much sense in implementing backwards chaining
    readonly backwards: IXIterable<T>;
}