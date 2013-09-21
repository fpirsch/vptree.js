
	/*───────────────────────────────────────────────────────────────────────────┐
	 │   Selection/partition algorithm                                           │
	 └───────────────────────────────────────────────────────────────────────────*/

	function partition(list, left, right, pivotIndex, comp) {
		var pivotValue = list[pivotIndex];
		var swap = list[pivotIndex];	// Move pivot to end
		list[pivotIndex] = list[right];
		list[right] = swap;
		var storeIndex = left;
		for(var i = left; i < right; i++) {
			if(comp(list[i], pivotValue)) {
				swap = list[storeIndex];
				list[storeIndex] = list[i];
				list[i] = swap;
				storeIndex++;
			}
		}
		swap = list[right];				// Move pivot to its final place
		list[right] = list[storeIndex];
		list[storeIndex] = swap;
		return storeIndex;
	}

	// Pivot selection : computes the median of elements a, b and c of the list,
	// according to comparator comp.
	function medianOf3(list, a, b, c, comp) {
		var A = list[a], B = list[b], C = list[c];
		return comp (A, B)
			? comp (B, C) ? b : comp (A, C) ? c : a
			: comp (A, C) ? a : comp (B, C) ? c : b;
	}

	/**
	 * Quickselect : Finds the nth smallest number in a list according to comparator comp.
	 * All elements smaller than the nth element are moved to its left (in no particular order),
	 * and all elements greater thant the nth are moved to its right.
	 *
	 * The funny mix of 0-based and 1-based indexes comes from the C++
	 * Standard Library function nth_element.
	 *
	 * @param {Array} list the list to partition
	 * @param {int} left index in the list of the first element of the sublist.
	 * @param {int} right index in the list of the last element of the sublist (inclusive)
	 * @param {int} nth index, in the range [1, sublist.length] of the elemnt to find.
	 * @param {function} comp a comparator, i.e. a boolean function accepting two parameters a and b,
	 *        and returning true if a < b and false if a >= b.
	 *
	 * See http://en.wikipedia.org/wiki/Quickselect
	 * And /include/bits/stl_algo.h in the GCC Standard Library ( http://gcc.gnu.org/libstdc++/ )
	 */
	function nth_element(list, left, nth, right, comp) {
		if(nth <= 0 || nth > (right-left+1)) throw "VPTree.nth_element: nth must be in range [1, right-left+1] (nth="+nth+")";
		var pivotIndex, pivotNewIndex, pivotDist;
		for(;;) {
			// select pivotIndex between left and right
			pivotIndex = medianOf3(list, left, right, (left + right) >> 1, comp);
			pivotNewIndex = partition(list, left, right, pivotIndex, comp);
			pivotDist = pivotNewIndex - left + 1;
			if(pivotDist === nth) {
				return list[pivotNewIndex];
			}
			else if(nth < pivotDist) {
				right = pivotNewIndex - 1;
			}
			else {
				nth -= pivotDist;
				left = pivotNewIndex + 1;
			}
		}
	}


	/**
	 * Wrapper around nth_element with a 0-based index.
	 */
	function select(list, k, comp) {
		if(k < 0 || k >= list.length) throw "VPTree.select: k must be in range [0, list.length-1] (k="+k+")";
		return nth_element(list, 0, k+1, list.length-1, comp);
	}


	/*───────────────────────────────────────────────────────────────────────────┐
	 │   vp-tree creation                                                        │
	 └───────────────────────────────────────────────────────────────────────────*/
	/** Selects a vantage point in a set.
	 *  We trivially pick one at random.
	 *  TODO this could be improved by random sampling to maximize spread.
	 */
	function selectVPIndex(list) {
		return Math.floor(Math.random() * list.length);
	}

	var distanceComparator = function(a, b) { return a.dist < b.dist; }

	/**
	 * Builds and returns a vp-tree from the list S.
	 * @param {Array} S array of objects to structure into a vp-tree.
	 * @param {function} distance a function returning the distance between 2 ojects from the list S.
	 * @param {number} nb (maximum) bucket size. 0 or undefined = no buckets used.
	 * @return {object} vp-tree.
	 */
	function buildVPTree(S, distance, nb) {
		var list = [];
		for(var i = 0, n = S.length; i < n; i++) {
			list[i] = {
				i: i
				//hist: []		// unused (yet)
			};
		};

		var tree = recurseVPTree(S, list, distance, nb);
		return new VPTree(S, distance, tree);
	}

	function recurseVPTree(S, list, distance, nb) {
		if(list.length === 0) return null;

		// Is this a leaf node ?
		var listLength = list.length;
		if(nb > 0 && listLength <= nb) {
			var bucket = [];
			for(var i = 0; i < listLength; i++) {
				bucket[i] = list[i].i;
			}
			return bucket;
		}

		// Non-leaf node.
		// Constructs a node with the selected vantage point extracted from the set.
		var vpIndex = selectVPIndex(list),
			node = list[vpIndex];
		list.splice(vpIndex, 1);
		listLength--;
		// We can't use this information yet, so don't show it in the vp-tree output.
		delete node.dist;
		if(listLength === 0) return node;

		// Adds to each item its distance to the vantage point.
		// This ensures each distance is computed only once.
		var vp = S[node.i],
			dmin = Infinity,
			dmax = 0,
			item,
			dist;
		for(var i = 0, n = listLength; i < n; i++) {
			item = list[i];
			dist = distance(vp, S[item.i]);
			item.dist = dist;
			//item.hist.push(dist);	// unused (yet)
			if(dmin > dist) dmin = dist;
			if(dmax < dist) dmax = dist;
		}
		node.m = dmin;
		node.M = dmax;

		// Partitions the set around the median distance.
		var medianIndex = listLength >> 1,
			median = select(list, medianIndex, distanceComparator);

		// Recursively builds vp-trees with the 2 resulting subsets.
		var leftItems = list.splice(0, medianIndex),
			rightItems = list;
		node.μ = median.dist;
		node.L = recurseVPTree(S, leftItems, distance, nb);
		node.R = recurseVPTree(S, rightItems, distance, nb);
		return node;
	}


	/** Stringifies a vp-tree data structure.
	 *  JSON without the null nodes and the quotes around object keys, to save space.
	 */
	function stringify(root) {
		var stack = [root || this.tree], s = '';
		while(stack.length) {
			var node = stack.pop();

			// Happens if the bucket size is greater thant the dataset.
			if(node.length) return '['+node.join(',')+']';

			s += '{i:' + node.i;
			if(node.hasOwnProperty('m')) {
				s += ',m:' + node.m + ',M:' + node.M + ',μ:' + node.μ;
			}
			if(node.hasOwnProperty('b')) {
				s += ',b:[' + node.b + ']';
			}
			if(node.hasOwnProperty('L')) {
				var L = node.L;
				if(L) {
					s += ',L:';
					if(L.length) s += '[' + L + ']';
					else s += stringify(L);
				}
			}
			if(node.hasOwnProperty('R')) {
				var R = node.R;
				if(R) {
					s += ',R:';
					if(R.length) s += '[' + R + ']';
					else s += stringify(R);
				}
			}
			s += '}';
		}
		return s;
	}

	/*───────────────────────────────────────────────────────────────────────────┐
	 │   Build Public API                                                        │
	 └───────────────────────────────────────────────────────────────────────────*/

	exports.select = select;
	exports.build = buildVPTree;

