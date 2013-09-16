
	/*───────────────────────────────────────────────────────────────────────────┐
	 │   vp-tree constructor                                                     │
	 └───────────────────────────────────────────────────────────────────────────*/

	/**
	 * @constructor
	 * @class VPTree manages a vp-tree.
	 *
	 * @param {Array} S the initial set of elements
	 * @param {Function} distance the distance function
	 * @param {Object} the vp-tree structure
	 */
	function VPTree(S, distance, tree) {
		this.S = S;
		this.distance = distance;
		this.tree = tree;

		this.search = searchVPTree;
		this.comparisons = 0;
		this.stringify = stringify;
	}


	exports.load = function(S, distance, tree) {
		return new VPTree(S, distance, tree);
	}
