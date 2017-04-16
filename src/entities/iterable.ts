import IIterable, {
    IPredicateCallback,
    IForEachCallback,
    IMapCallback,
    IReduceCallback
} from '../interfaces/iterable';

/**
 * Represents abstract enumerable collection
 * Descendants should provide own iterator implementation
 */
abstract class AbstractIterable<T> implements IIterable<T> {
    public abstract [Symbol.iterator](): Iterator<T>;

    public get length() {
        let length = 0;
        for (let value of this) {
            length++;
        }
        return length;
    }

    public indexOf(searchElement: T, fromIndex?: number) {
        let index = 0;
        fromIndex = fromIndex || 0;
        // negative index counts from the end
        if (fromIndex < 0) {
            fromIndex = this.length + fromIndex;
        }
        for (let current of this) {
            if (current === searchElement && index >= fromIndex) {
                return index;
            }
            index++;
        }
        return -1;
    }
    public includes(value: T, fromIndex?: number) {
        return this.indexOf(value, fromIndex) > -1;
    }
    public elementAt(position: number) {
        let index = 0;
        // negative position counts from the end
        if (position < 0) {
            position = this.length + position;
            if (position < 0) {
                return undefined;
            }
        }
        for (let value of this) {
            if (position === index++) {
                return value;
            }
        }
        return undefined;
    }

    public every(callback: IPredicateCallback<T>, thisArg?: any) {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            if (!callback.call(thisArg, value, index++, this)) {
                return false;
            }
        }
        return true;
    }
    public some(callback: IPredicateCallback<T>, thisArg?: any) {
        return this.find(callback, thisArg) !== undefined;
    }
    public find(callback: IPredicateCallback<T>, thisArg?: any) {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            if (callback.call(thisArg, value, index++, this)) {
                return value;
            }
        }
        return undefined;
    }
    public findIndex(callback: IPredicateCallback<T>, thisArg?: any) {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            if (callback.call(thisArg, value, index, this)) {
                return index;
            }
            index++;
        }
        return -1;
    }
    public forEach(callback: IForEachCallback<T>, thisArg?: any) {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            callback.call(thisArg, value, index++, this);
        }
    }

    /** Aggregates collection using specified callback function and accumulator */
    public reduce<TAccumulator>(callback: IReduceCallback<T, TAccumulator>,
        initialValue?: TAccumulator, thisArg?: any) {

        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            initialValue = callback.call(thisArg, initialValue!, value, index++, this);
        }
        return initialValue;
    }
    /** Filters iterable using specified callback function; Executes deferredly! */
    public *filter(callback: IPredicateCallback<T>, thisArg?: any): IterableIterator<T> {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            if (callback.call(thisArg, value, index++, this)) {
                yield value;
            }
        }
    }
    /** Maps iterable using specified callback function; Executes deferredly! */
    public *map<U>(callback: IMapCallback<T, U>, thisArg?: any): IterableIterator<U> {
        let index = 0;
        // thisArg = thisArg || callback.caller;
        for (let value of this) {
            yield callback.call(thisArg, value, index++, this);
        }
    }
}

export default AbstractIterable;
