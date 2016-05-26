//all funtion in this file need the original matrix on the left
//reference https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html

//Model Matrix
var model = {
	//translation
	makeTranslation : function(tx, ty, tz){
		return [1,  0,  0,  0,
				0,  1,  0,  0,
				0,  0,  1,  0,
				tx, ty, tz, 1];
	},

	//rotation parameter is angle
	makeXRotation : function(angleInRadians){
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);
	 
		return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
		];
	},

	makeYRotation : function(angleInRadians) {
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);
	 
	    return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
		];
	},
	 
	makeZRotation : function(angleInRadians) {
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);
	 
		return [
		 c, s, 0, 0,
		 -s, c, 0, 0,
		 0, 0, 1, 0,
		 0, 0, 0, 1,
		];
	},
	//scaling
	makeScale : function(sx, sy, sz) {
		return [
		sx, 0,  0,  0,
		0, sy,  0,  0,
		0,  0, sz,  0,
		0,  0,  0,  1,
		];
	}
}
//Projection Matrix
//this make eye at(0,0,0) and look -Z, near and far [1, INF];
//need View matrix to build correct camera;
function make2DProjection(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);
 
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
};


//View Matrix
var view = {
	//translation
	makeTranslation : function(tx, ty, tz){
		return [1,  0,  0,  0,
				0,  1,  0,  0,
				0,  0,  1,  0,
				-tx, -ty, -tz, 1];
	},

	//rotation parameter is angle
	makeXRotation : function(angleInRadians){
		var c = Math.cos(-angleInRadians);
		var s = Math.sin(-angleInRadians);
	 
		return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
		];
	},

	makeYRotation : function(angleInRadians) {
		var c = Math.cos(-angleInRadians);
		var s = Math.sin(-angleInRadians);
	 
	    return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
		];
	},
	 
	makeZRotation : function(angleInRadians) {
		var c = Math.cos(-angleInRadians);
		var s = Math.sin(-angleInRadians);
	 
		return [
		 c, s, 0, 0,
		 -s, c, 0, 0,
		 0, 0, 1, 0,
		 0, 0, 0, 1,
		];
	},
	//scaling
	makeScale : function(sx, sy, sz) {
		return [
		-sx, 0,  0,  0,
		0, -sy,  0,  0,
		0,  0, -sz,  0,
		0,  0,  0,  1,
		];
	}
}
function identity(){
	return [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1
	];
}
//reference https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js
function matrixMultiply(b,a){
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
	var out = [];
    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
}

function MVPmatrix(M, VP){
	var matrix = identity();
	// Multiply the matrices.
	// model * view * projection * vec
	// model
	
	matrix = matrixMultiply(matrix, M.scaleMatrix);
	matrix = matrixMultiply(matrix, M.rotationXMatrix);	
	matrix = matrixMultiply(matrix, M.rotationYMatrix);
	matrix = matrixMultiply(matrix, M.rotationZMatrix);
	matrix = matrixMultiply(matrix, M.translationMatrix);


	// view
	matrix = matrixMultiply(matrix, VP.view_rotationXMatrix);
	matrix = matrixMultiply(matrix, VP.view_rotationZMatrix);
	matrix = matrixMultiply(matrix, VP.view_translationMatrix);
	matrix = matrixMultiply(matrix, VP.view_rotationYMatrix);
	
	// projection
	matrix = matrixMultiply(matrix, VP.projectionMatrix);
	return matrix;
}