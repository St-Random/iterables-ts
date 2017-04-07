import { IXBidirectedIterable } from './iterable';

/** Interface for manual nodes iteration */
export interface ILinkedListNode<T> {
    readonly parent: ILinkedList<T> | undefined;
    readonly prev?: ILinkedListNode<T>;
    readonly next?: ILinkedListNode<T>;
    value: T;
}

/** Interface for doing stuff inside the list */
export interface IInternalLinkedListNode<T> extends ILinkedListNode<T> {
    prev?: IInternalLinkedListNode<T>;
    next?: IInternalLinkedListNode<T>;

    invalidate(): void;
}

// No operations with indexes
/**
 * Linked list data structure, supprots iteration on nodes and values in both directions,
 * as well as iterable methods and map/filter chaining
 */
interface ILinkedList<T> extends IXBidirectedIterable<ILinkedListNode<T>> {
    readonly length: number;
    readonly first?: ILinkedListNode<T>;
    readonly last?: ILinkedListNode<T>;
    readonly values: IXBidirectedIterable<T>;

    /**
     * Inserts element before given node or in the beginning of the list, if before is not specified;
     * Returns reference to created node;
     */
    prepend(value: T, before?: ILinkedListNode<T>): ILinkedListNode<T>;
    // prepend(value: T, before: number): IReadonlyLinkedListNode<T>;

    /**
     * Inserts element after given node or in the end of the list, if after is not specified;
     * Returns reference to created node;
     */
    append(value: T, after?: ILinkedListNode<T>): ILinkedListNode<T>;
    // append(value: T, after: number): IReadonlyLinkedListNode<T>;

    /**
     * Inserts elements collection before given node or in the beginning of the list, if before is not specified;
     * Returns reference to the first node of collection or undefined if values are empty;
     */
    prependMany(values: Iterable<T>, before?: ILinkedListNode<T>): ILinkedListNode<T> | undefined;
    // prependRange(values: Iterable<T>, before: number): IReadonlyLinkedListNode<T>;

    /**
     * Inserts elements collection after given node or in the end of the list, if after is not specified;
     * Returns reference to the last node of collection or undefined if values are empty;
     */
    appendMany(values: Iterable<T>, after?: ILinkedListNode<T>): ILinkedListNode<T> | undefined;
    // appendRange(values: Iterable<T>, after: number): IReadonlyLinkedListNode<T>;

    reverse(): void;

    remove(value: T): void;
    removeNode(node: ILinkedListNode<T>): void;
    // remove(index: number): void;
    removeFirst(): void;
    removeLast(): void;
    removeAll(): void;
}

export default ILinkedList;
