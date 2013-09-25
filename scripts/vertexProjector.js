/*╔═════════════════════════════════════════════════════════════════════════════════════════════════════════╗
 *║                                                                                                         ║
 *║      Web worker                                                                                         ║
 *║                                                                                                         ║
 *╚═════════════════════════════════════════════════════════════════════════════════════════════════════════╝
 */
"use strict";

var state = 0;
var X, Y, Z, x, y, z, matrix;

function projectVertices(X, Y, Z, x ,y ,z) {
	var c0  = matrix[0],  c1  = matrix[1],  c2  = matrix[2],  c3  = matrix[3],
		c4  = matrix[4],  c5  = matrix[5],  c6  = matrix[6],  c7  = matrix[7],
		c8  = matrix[8],  c9  = matrix[9],  c10 = matrix[10], c11 = matrix[11],
		c12 = matrix[12], c13 = matrix[13], c14 = matrix[14], c15 = matrix[15];
	var nx, ny, nz, nw, vx, vy, vz;
	for(var i = 0, n = X.length; i < n; i++) {
		vx = X[i];
		vy = Y[i];
		vz = Z[i];
		nx =  c0*vx +  c1*vy +  c2*vz +  c3;
		ny =  c4*vx +  c5*vy +  c6*vz +  c7;
		nz =  c8*vx +  c9*vy + c10*vz + c11;
		nw = c12*vx + c13*vy + c14*vz + c15;
		x[i] = nx/nw;
		y[i] = ny/nw;
		z[i] = nz/nw;
	}
}


self.onmessage = function (event) {
	switch(state) {
		case 0 :
			X = new Float32Array(event.data);
			state = 1;
			break;
		case 1 : 
			Y = new Float32Array(event.data);
			state = 2;
			break;
		case 2 :
			Z = new Float32Array(event.data);
			state = 3;
			break;
		case 3 :
			matrix = event.data;
			state = 4;
			break;
		case 4 :
			x = new Float32Array(event.data);
			state = 5;
			break;
		case 5 : 
			y = new Float32Array(event.data);
			state = 6;
			break;
		case 6 :
			z = new Float32Array(event.data);
			state = 3;
			if(x.length && y.length && z.length) {
				projectVertices(X, Y, Z, x ,y ,z);
			}
			// Tranfer ownership back.
			if(x.length) postMessage(x.buffer, [x.buffer]);
			if(y.length) postMessage(y.buffer, [y.buffer]);
			if(z.length) postMessage(z.buffer, [z.buffer]);
			break;
	}
};
