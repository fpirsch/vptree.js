
	/*───────────────────────────────────────────────────────────────────────────┐
	 │   Priority Queue, used to store search results.                           │
	 └───────────────────────────────────────────────────────────────────────────*/

	/**
	 * @constructor
	 * @class PriorityQueue manages a queue of elements with priorities.
	 *
	 * @param {number} size maximum size of the queue (default = 5). Only lowest priority items will be retained.
	 */
	function PriorityQueue(size) {
		size = size || 5;
		var contents = [];

		function binaryIndexOf(priority) {
			var minIndex = 0,
				maxIndex = contents.length - 1,
				currentIndex,
				currentElement;

			while (minIndex <= maxIndex) {
				currentIndex = (minIndex + maxIndex) >> 1;
				currentElement = contents[currentIndex].priority;
				 
				if (currentElement < priority) {
					minIndex = currentIndex + 1;
				}
				else if (currentElement > priority) {
					maxIndex = currentIndex - 1;
				}
				else {
					return currentIndex;
				}
			}

			return -1 - minIndex;
		}

		var api = {
			// This breaks IE8 compatibility. Who cares ?
			get length() {
				return contents.length;
			},

			insert: function(data, priority) {
				var index = binaryIndexOf(priority);
				if (index < 0) index = -1 - index;
				if (index < size) {
					contents.splice(index, 0, {data: data, priority: priority});
					if (contents.length > size) {
						contents.length--;
					}
				}
				return contents.length === size ? contents[contents.length-1].priority : undefined;
			},

			list: function() {
				return contents.map(function(item){ return {i: item.data, d: item.priority}; });
			}
		};

		return api;
	}


	/*───────────────────────────────────────────────────────────────────────────┐
	 │   vp-tree search                                                          │
	 └───────────────────────────────────────────────────────────────────────────*/

	/**
	 * @param {object} q - query : any object the distance function can be applied to.
	 * @param {number} [n=1] - number of nearest neighbors to find
	 * @param {number} [τ=∞] - maximum distance from element q
	 *
	 * @return {object[]} list of search results, ordered by increasing distance to the query object.
	 *                    Each result has a property i which is the index of the element in S, and d which
	 *                    is its distance to the query object.
	 */
	function searchVPTree(q, n, τ) {
		τ = τ || Infinity;
		var W = new PriorityQueue(n || 1),
			S = this.S,
			distance = this.distance,
			comparisons = 0;

		function doSearch(node) {
			if (node === null) return;

			// Leaf node : test each element in this node's bucket.
			if (node.length) {
				for (var i = 0, n = node.length; i < n; i++) {
					comparisons++;
					var elementID = node[i],
						element = S[elementID],
						elementDist = distance(q, element);
					if (elementDist < τ) {
						τ = W.insert(elementID, elementDist) || τ;
					}
				}
				return;
			}

			// Non-leaf node
			var id = node.i,
				p = S[id],
				dist = distance(q, p);

			comparisons++;

			// This vantage-point is close enough to q.
			if (dist < τ) {
				τ = W.insert(id, dist) || τ;
			}

			// The order of exploration is determined by comparison with μ.
			// The sooner we find elements close to q, the smaller τ and the more nodes we skip.
			// P. Yianilos uses the middle of left/right bounds instead of μ.
			// We search L if dist is in (m - τ, μ + τ), and R if dist is in (μ - τ, M + τ)
			var μ = node.μ, L = node.L, R = node.R;
			if (μ === undefined) return;
			if (dist < μ) {
				if (L && node.m - τ < dist) doSearch(L);
				if (R && μ - τ < dist) doSearch(R);
			}
			else {
				if (R && dist < node.M + τ) doSearch(R);
				if (L && dist < μ + τ) doSearch(L);
			}
		}

		doSearch(this.tree);
		this.comparisons = comparisons;
		return W.list();
	}


