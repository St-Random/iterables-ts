import {
    IXBidirectedIterable,
    IPredicateCallback
} from '../interfaces/iterable';
import { XBidirectedIterable } from './x-iterable';
import ILinkedList, {
    IInternalLinkedListNode,
    ILinkedListNode
} from '../interfaces/linked-list';

/*
 * My very own linked list implementation.
 * Fuck the bicycles! Fuck YAGNI! YOLO! YAY!
 */

class InvalidNodeOperationError extends Error {
    constructor(message?: string) {
        message = message || 'This is not my child!';
        super(message);
    }
}

class LinkedListNode<T> implements IInternalLinkedListNode<T> {
    private _parent?: ILinkedList<T>;

    public get parent() {
        return this._parent;
    }

    public constructor(
        parent: ILinkedList<T>, // Hail to circular references!
        public value: T,
        public prev?: IInternalLinkedListNode<T>,
        public next?: IInternalLinkedListNode<T>
    ) {
        this._parent = parent;
    }

    /** Forbids append/prepend operations using this node */
    public invalidate() {
        // Oh, no, now he is an orphan. How sad ~sob-sob.
        this._parent = undefined;
    }
}

export default class LinkedList<T> extends XBidirectedIterable<ILinkedListNode<T>>
    implements ILinkedList<T> {

    private _length: number = 0;
    private _first?: LinkedListNode<T>;
    private _last?: LinkedListNode<T>;
    // Nodes and values generators implementation
    private *_forwardsNodesIterator() {
        let current = this._first;
        while (current) {
            let reset = yield current;
            current = !reset ? current.next : this._first;
        }
    }
    private *_backwardsNodesIterator() {
        let current = this._last;
        while (current) {
            let reset = yield current;
            current = !reset ? current.prev : this._last;
        }
    }
    private *_forwardsValuesIterator() {
        let current = this._first;
        while (current) {
            let reset = yield current.value;
            current = !reset ? current.next : this._first;
        }
    }
    private *_backwardsValuesIterator() {
        let current = this._last;
        while (current) {
            let reset = yield current.value;
            current = !reset ? current.prev : this._last;
        }
    }

    public readonly values: IXBidirectedIterable<T>;

    public get length() {
        return this._length;
    }
    public get first(): ILinkedListNode<T> | undefined {
        return this._first;
    }
    public get last(): ILinkedListNode<T> | undefined {
        return this._last;
    }

    public constructor(initValues?: Iterable<T>) {
        super(() => this._forwardsNodesIterator(),
              () => this._backwardsNodesIterator());
        this.values = new XBidirectedIterable(
            () => this._forwardsValuesIterator(),
            () => this._backwardsValuesIterator());
        if (initValues) {
            this.appendMany(initValues);
        }
    }

    /**
     * Inserts element before given node or in the beginning of the list, if before is not specified;
     * Returns reference to created node;
     */
    public prepend(value: T, before?: ILinkedListNode<T>): ILinkedListNode<T> {
        if (before && !this._isThisNode(before)) {
            throw new InvalidNodeOperationError();
        }
        return this._prepend(new LinkedListNode<T>(this, value), before);
    }
    /**
     * Inserts element after given node or in the end of the list, if after is not specified;
     * Returns reference to created node;
     */
    public append(value: T, after?: ILinkedListNode<T>): ILinkedListNode<T> {
        if (after && !this._isThisNode(after)) {
            throw new InvalidNodeOperationError();
        }
        return this._append(new LinkedListNode<T>(this, value), after);
    }
    /**
     * Inserts elements collection before given node or in the beginning of the list, if before is not specified;
     * Returns reference to the first node of collection or undefined if values are empty;
     */
    public prependMany(values: Iterable<T>, before?: ILinkedListNode<T>): ILinkedListNode<T> | undefined {
        if (before && !this._isThisNode(before)) {
            throw new InvalidNodeOperationError();
        }
        let iterator = values[Symbol.iterator](),
            current = iterator.next(),
            firstNode: IInternalLinkedListNode<T> | undefined = undefined,
            currentNode: IInternalLinkedListNode<T> | undefined = undefined;
        if (!current.done) {
            currentNode = firstNode = new LinkedListNode<T>(this, current.value);
            this._prepend(firstNode, before);
        }
        current = iterator.next();
        while (!current.done) {
            currentNode = this._append(new LinkedListNode<T>(this, current.value), currentNode);
            current = iterator.next();
        }
        return firstNode;
    }
    /**
     * Inserts elements collection after given node or in the end of the list, if after is not specified;
     * Returns reference to the last node of collection or undefined if values are empty;
     */
    public appendMany(values: Iterable<T>, after?: ILinkedListNode<T>): ILinkedListNode<T> | undefined {
        if (after && !this._isThisNode(after)) {
            throw new InvalidNodeOperationError();
        }
        let currentNode = after;
        for (let value of values) {
            currentNode = this._append(new LinkedListNode<T>(this, value), currentNode);
        }
        return currentNode !== after ? currentNode : undefined;
    }

    public reverse() {
        let prev = this._first,
            current = prev ? prev.next : undefined,
            next: IInternalLinkedListNode<T> | undefined;
        while (current) {
            next = current.next;

            current.next = prev;
            prev!.prev = current;

            prev = current;
            current = next;
        }
        [this._first, this._last] = [this._last, this._first];
        if (this._first) {
            this._first.prev = undefined;
            this._last!.next = undefined;
        }
    }

    public removeFirst() {
        if (this._first) {
            this._remove(this._first);
        }
        return this;
    }
    public removeLast() {
        if (this._last) {
            this._remove(this._last);
        }
        return this;
    }

    public remove(obj: T | ILinkedListNode<T>) {
        if (this._isThisNode(obj)) {
            this._remove(obj);
        }
        else {
            this.filter(x => x.value === obj)
                .forEach(x => this._remove(x as IInternalLinkedListNode<T>));
        }
        return this;
    }

    public removeMany(values: Iterable<T>): ILinkedList<T>;
    public removeMany(nodes: Iterable<ILinkedListNode<T>>): ILinkedList<T>;
    public removeMany(objects: Iterable<T | ILinkedListNode<T>>) {
        for (let obj of objects) {
            this.remove(obj);
        }
        return this;
    }

    /** Clears list entirely */
    public removeAll(): ILinkedList<T>;
    /** Removes all nodes that satisfy condition */
    public removeAll(callback: IPredicateCallback<ILinkedListNode<T>>, thisArg?: any): ILinkedList<T>;
    public removeAll(callback?: IPredicateCallback<ILinkedListNode<T>>, thisArg?: any) {
        let nodesToRemove = callback ? this.filter(callback, thisArg) : this;
        for (let node of nodesToRemove) {
            this._remove(node as IInternalLinkedListNode<T>);
        }
        return this;
    }

    // Internal node typeguard; Mummy knows her children. Don't shit with her!
    protected _isThisNode(node: any): node is IInternalLinkedListNode<T> {
        return (node instanceof LinkedListNode) && node.parent === this;
    }
    private _remove(node: IInternalLinkedListNode<T>) {
        let prev = node.prev,
            next = node.next;
        if (prev) {
            prev.next = next;
        }
        else {
            this._first = next;
        }
        if (next) {
            next.prev = prev;
        }
        else {
            this._last = prev;
        }
        node.invalidate();
        this._length--;
    }
    private _prepend(node: IInternalLinkedListNode<T>, before?: IInternalLinkedListNode<T>): IInternalLinkedListNode<T> {
        let current = before || this._first;
        if (current) {
            let prev = current.prev;
            current.prev = node;
            node.next = current;
            if (prev) {
                node.prev = prev;
                prev.next = node;
            }
            else {
                this._first = node;
            }
        }
        else {
            this._first = this._last = node;
        }
        this._length++;
        return node;
    }
    private _append(node: IInternalLinkedListNode<T>, after?: IInternalLinkedListNode<T>): IInternalLinkedListNode<T> {
        let current = after || this._last;
        if (current) {
            let next = current.next;
            current.next = node;
            node.prev = current;
            if (next) {
                node.next = next;
                next.prev = node;
            }
            else {
                this._last = node;
            }
        }
        else {
            this._last = this._first = node;
        }
        this._length++;
        return node;
    }
}
