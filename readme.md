# Iterables.ts
Custom generic Iterable and IterableIterator implementation in TypeScript (compiled to ES6) that supports:
* length property
* indexOf(searchElement, fromIndex?)
* includes(value, fromIndex?)
* elementAt(position)
* some(callback, thisArg?)
* every(callback, thisArg?)
* find(callback, thisArg?)
* findIndex(callback, thisArg?)
* forEach(callback, thisArg?)
* reduce(callback, initialValue?, thisArg?)
* filter(callback, thisArg?)
* map(callback, thisArg?)

as well as BidirectedIterable that supports iteration in backwards direction.
filter and map methods executes deferredly (they are implemented using generator functions) and return custom iterators, that allow chain calls (like iterable.filter(...).map(...).forEach(...)).

Also includes LinkedList implementation that supports backwards/forwards iteration on nodes and values (with all the above methods) as the proof of concept.

Covered with unit tests using AVA. Use `npm run test` and `npm run test-report` to run the tests and build coverage report respectively.

Code review would be welcome.