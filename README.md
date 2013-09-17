vptree.js
=========

A JavaScript implementation of the [Vantage-Point Tree](https://en.wikipedia.org/wiki/Vantage-point_tree) [nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search) algorithm.

The VP tree is particularly useful in dividing data in a [non-standard metric space](https://en.wikipedia.org/wiki/Metric_space#Examples_of_metric_spaces) into a
[BSP tree](https://en.wikipedia.org/wiki/Binary_space_partitioning).
Tree construction executes in O(n&nbsp;log(n)) time, and search is under certain circumstances and in the limit, O(log(n))
expected time. This makes it suitable when distance computations are expensive.

## Simple Example
```js
// A whole lot of strings
var stringList = [
	'culture',
	'democracy',
	'metaphor',
	'irony',
	'hypothesis',
	'science',
	'fastuous',
	'integrity',
	'synonym',
	'empathy'     // and on and on...
];

// building the tree
var vptree = VPTreeFactory.build(stringList, levenshteinDistance);

var nearest = vptree.search('democratic');  // equals 1
alert( stringList[nearest] );               // alerts 'democracy'
```

## API

The API exposes the ```VPTreeFactory``` object.

### Building the tree

**VPTreeFactory.build(S, distance[, bucketSize])**

Builds a fresh VPTree instance.

* **S** (array) the set of elements
* **distance** a function that computes the distance between two elements of S
* **bucketSize** (optional) to save space, tree leaves can be collapsed into buckets. This parameter gives the maximum number of leaves to collapse in each bucket.


**VPTreeFactory.select(list, k, comp)**

An implementation of the [quick select algorithm](http://en.wikipedia.org/wiki/Quickselect) 
like the [nth_element](http://msdn.microsoft.com/en-us/library/7s2yb954%28v=vs.120%29.aspx) function of the Standard C++ Library.

You will probably never use this function. However, it is used internally, and exposed as a bonus. Could be useful. Who knows.

* **list** an array of objects or values
* **k** the index of the nth_element to select, between 0 and list.length-1
* **comp** comparator, a boolean function with two parameters a and b, and returning true if a < b and false if a ≥ b.

### Searching the tree

**vptree.search(element[, n])**

Searches the ```n``` nearest neighbors of ```element``` in S.

* **element** an object to search in S
* **n** the number of closest elements to retrieve. Defaults to 1.

This function returns a list of indexes in S, ordered from the closest to the furthest.

### Precomputing the tree

**vptree.stringify()**

Returns a stringified JavaScript object literal of the vp-tree structure. Like JSON.stringify but without nulls
and quotes to save space. It is valid JavaScript, but not valid JSON, so JSON.parse() will complain.

The stringified object is not the whole VPTree instance : it does not contain the initial dataset, nor the
distance function. Its only purpose is to be pasted in the code of your final app, where it will have to
be turned back into a searchable VPTree instance with the ```load()``` function.

**VPTreeFactory.load(S, distance, tree)**

Reuses a precomputed stringified vp-tree, and returns a searchable VPTree instance.

* **S** the array that was used to pre-build the vp-tree.
* **distance** the distance function that was used to pre-build the vp-tree.
* **tree** the vp-tree structure object. Must be a plain object.

