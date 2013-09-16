/*╔═════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 *║                                                                                                         ║
 *║      VPTreeFactory.select test-suite.                                                                   ║
 *║      Mostly from GCC libstdc++-v3 nth_element test suite                                                ║
 *║                                                                                                         ║
 *╚═════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */


/*───────────────────────────────────────────────────────────────────────────┐
 │   libstdc++-v3 test suite                                                 │
 └───────────────────────────────────────────────────────────────────────────*/
// testsuite/25_algorithms/nth_element/1.cc
function test3() {
	var array = [ 6, 5, 4, 3, 2, 1, 0 ];
	// nth_element(con.begin(), con.it(3), con.end());
	VPTreeFactory.select(array, 3, infComparator);
	equal(array[3], 3);
	for(var i = 0; i < 3; ++i) ok(array[i] < array[3], 'Left elements must be < 3');
	for(var i = 4; i < 7; ++i) ok(array[3] < array[i], 'Left elements must be > 3');
}

function test4() {
	var array = [ 0, 6, 1, 5, 2, 4, 3 ];
	// nth_element(con.begin(), con.it(3), con.end());
	VPTreeFactory.select(array, 3, infComparator);
	equal(array[3], 3);
	for(var i = 0; i < 3; ++i) ok(array[i] < array[3], 'Left elements must be < 3');
	for(var i = 4; i < 7; ++i) ok(array[3] < array[i], 'Left elements must be > 3');
}


// testsuite/25_algorithms/nth_element/2.cc
// This test is really expensive.
// Each iteration makes size²+size assertions.
// The initial stdlib test suite uses MAX_SIZE = 1024, which means 1.4 million assertions.
// With MAX_SIZE = 256 we are testing "only" 88,000 assertions.
function test01() {
	function test_set(size) {
		var v = [];
		for (var i = 0; i < size; i += 4) {
			v.push(i / 2);
			v.push((size - 2) - (i / 2));
		}
		for (var i = 1; i < size; i += 2)
			v.push(i);
		return v;
	}

	// This test contains size selections and size²+size assertions.
	function do_test01(size) {
		var set = test_set(size);
		var s = set.slice().sort(function(a, b) { return a-b; });
		for (var j = 0; j < size; ++j) {
			var v = set.slice();
			//std::nth_element(v.begin(), v.begin() + j, v.end());
			VPTreeFactory.select(v, j, infComparator);

			equal( v[j], s[j] );

			for (var i = 0; i < j; ++i)
				ok( !(v[j] < v[i]) );

			for (var i = j; i < v.length; ++i)
				ok( !(v[i] < v[j]) );
		}
	}

	var MAX_SIZE = (1 << 10);
	var MAX_SIZE = 256;
	for (var size = 4; size <= MAX_SIZE; size <<= 1)
		do_test01(size);
}


// testsuite/25_algorithms/nth_element/3.cc
// 25.3.2 nth_element()
function test05() {
	var A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	var B = [10, 20, 1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9, 19];
	var C = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	var N = A.length;	// = 20
	var logN = 3;		// ln(N) rounded up
	var P = 7;

	// comparison predicate for stable_sort: order by rightmost digit
	function CompLast(x, y) { return x % 10 < y % 10; }

	var s1 = B.slice();

	var pn = (N / 2) - 1;	// =9
    // nth_element(s1, pn, s1 + N);
	VPTreeFactory.select(s1, pn, infComparator);
	for(var i = pn; i < N; ++i) ok( !(s1[i] < s1[pn]) );

    // nth_element(s1, pn, s1 + N, pred);
	VPTreeFactory.select(s1, pn, CompLast);
	for(var i = pn; i < N; ++i) ok( !CompLast(s1[i], s1[pn]) );
}



/*───────────────────────────────────────────────────────────────────────────┐
 │   MSDN example                                                            │
 │   http://msdn.microsoft.com/en-us/library/fyf8f0w7.aspx                   │
 └───────────────────────────────────────────────────────────────────────────*/

function MSDNTest() {
	// Numbers { 4 10 10 30 69 70 96 100  }
	var list = [4, 10, 70, 30, 10, 69, 96, 100];
	var pivot = VPTreeFactory.select(list, 3, infComparator);
	equal(pivot, 30);
	for(var i = 0; i < 3; ++i) ok( list[i] < 30 );
	equal(list[3], 30);
	for(var i = 4; i < 8; ++i) ok( 30 < list[i] );	
}



/*───────────────────────────────────────────────────────────────────────────┐
 │   Other                                                                   │
 └───────────────────────────────────────────────────────────────────────────*/

function singleElementTest() {
	var list = [5];
	var pivot = VPTreeFactory.select(list, 0, infComparator);
	equal(pivot, 5);
	deepEqual(list, [5]);
}
