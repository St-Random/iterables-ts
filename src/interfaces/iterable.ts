// Describing callbacks interfaces for convenience
export interface IPredicateCallback<T> {
    (currentValue: T, index?: number, collection?: IIterable<T>): boolean;
    call(thisArg: any, currentValue: T, index: number, collection: IIterable<T>): boolean;
}

export interface IForEachCallback<T> {
    (currentValue: T, index?: number, collection?: IIterable<T>): void;
    call(thisArg: any, currentValue: T, index: number, collection: IIterable<T>): void;
}

export interface IMapCallback<T, U> {
    (currentValue: T, index?: number, collection?: IIterable<T>): U;
    call(thisArg: any, currentValue: T, index: number, collection: IIterable<T>): U;
}

export interface IReduceCallback<T, TAccumulator> {
    (accumulator: TAccumulator, currentValue: T, currentIndex?: number,
        collection?: IIterable<T>): TAccumulator;

    call(thisArg: any, accumulator: TAccumulator, currentValue: T,
        currentIndex: number, collection: IIterable<T>): TAccumulator;
}

/*
 * I don't have talent about naming things, sorry.
 * P.S. I miss extension methods for this stuff.
 */

/** Represents iterable collection interface */
interface IIterable<T> extends Iterable<T> {
    readonly length: number;
    indexOf(searchElement: T, fromIndex?: number): number;
    includes(value: T, fromIndex?: number): boolean;
    elementAt(position: number): T | undefined;

    some(callback: IPredicateCallback<T>, thisArg?: any): boolean;
    every(callback: IPredicateCallback<T>, thisArg?: any): boolean;
    find(callback: IPredicateCallback<T>, thisArg?: any): T | undefined;
    findIndex(callback: IPredicateCallback<T>, thisArg?: any): number;
    forEach(callback: IForEachCallback<T>, thisArg?: any): void;
    reduce<TAccumulator>(callback: IReduceCallback<T, TAccumulator>,
        initialValue?: TAccumulator, thisArg?: any): TAccumulator;

    filter(callback: IPredicateCallback<T>, thisArg?: any): IterableIterator<T>;
    map<U>(callback: IMapCallback<T, U>, thisArg?: any): IterableIterator<U>;
}

// Here comes killer feature:

/** Allows iteration in backwards direction */
export interface IBidirectedIterable<T> extends IIterable<T> {
    readonly backwards: IIterable<T>;
}

// And another killer feature:

/** Supports iterable iterators and chaining */
export interface IXIterable<T> extends IIterable<T> {
    [Symbol.iterator](): IXIterableIterator<T>;
    filter(callback: IPredicateCallback<T>, thisArg?: any): IXIterableIterator<T>;
    map<U>(callback: IMapCallback<T, U>, thisArg?: any): IXIterableIterator<U>;
}

export interface IXIterableIterator<T>
    extends IXIterable<T>, IterableIterator<T> {

    [Symbol.iterator](): IXIterableIterator<T>;
}

/** Supports iteration in backwards direction */
export interface IXBidirectedIterable<T> extends IXIterable<T> {
    // I don't see much sense in implementing backwards chaining
    readonly backwards: IXIterable<T>;
}

export default IIterable;
