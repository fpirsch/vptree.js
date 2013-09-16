/*╔═════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 *║                                                                                                         ║
 *║      vptree.js                                                                                          ║
 *║      A javascript implementation of the Vantage-Point Tree algorithm                                    ║
 *║      https://github.com/fpirsch/vptree.js                                                               ║
 *║      ISC license (http://opensource.org/licenses/ISC). François Pirsch. 2013.                           ║
 *║                                                                                                         ║
 *╚═════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */

"use strict";

//https://github.com/umdjs/umd/blob/master/commonjsStrictGlobal.js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], function (exports) {
            factory(root.VPTreeFactory = exports);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(root.VPTreeFactory = {});
    }
}(this, function (exports) {
