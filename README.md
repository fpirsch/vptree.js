vptree.js
=========

A JavaScript implementation of the [Vantage-Point Tree](https://en.wikipedia.org/wiki/Vantage-point_tree) [nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search) algorithm.

The VP tree is particularly useful in dividing data in a [non-standard metric space](https://en.wikipedia.org/wiki/Metric_space#Examples_of_metric_spaces) into a
[BSP tree](https://en.wikipedia.org/wiki/Binary_space_partitioning).
Tree construction executes in O(nlog(n) time, and search is under certain circumstances and in the limit, O(log(n)) expected time. This makes it suitable when distance computations are expensive.

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
