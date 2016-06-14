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
function makeTranspose(m){
	return [
	m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
	];
	
}

function convert1to2(m){
	var I = new Array(4);
	for(x = 0; x < 4; x++){
		I[x] = new Array(4);
	}
	
	for(i = 0; i < 4; i++){
		for(j = 0; j < 4; j++){
			I[i][j] = m[i * 4 + j];
		}
	}
	return I;
}
function convert2to1(m){
	var I = [];
	for(i = 0; i < 4; i++){
		for(j = 0; j < 4; j++){
			I[i * 4 + j] = m[i][j];
		}
	}
	return I;
}

// Andrew Ippoliti copyright
// http://blog.acipo.com/matrix-inversion-in-javascript/
// Returns the inverse of matrix `M`.
function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
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
	matrix = matrixMultiply(matrix, VP.view_translationMatrix);
	matrix = matrixMultiply(matrix, VP.view_rotationXMatrix);
	matrix = matrixMultiply(matrix, VP.view_rotationZMatrix);
	matrix = matrixMultiply(matrix, VP.view_rotationYMatrix);
	
	// projection
	matrix = matrixMultiply(matrix, VP.projectionMatrix);
	return matrix;
}
function WorldMatrix(M){
	var matrix = identity();
	
	matrix = matrixMultiply(matrix, M.scaleMatrix);
	matrix = matrixMultiply(matrix, M.rotationXMatrix);	
	matrix = matrixMultiply(matrix, M.rotationYMatrix);
	matrix = matrixMultiply(matrix, M.rotationZMatrix);
	matrix = matrixMultiply(matrix, M.translationMatrix);
	
	return matrix;
}
function normalize(vector){
	return [
	vector[0]/(Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])),
	vector[1]/(Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2])),
	vector[2]/(Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]+vector[2]*vector[2]))
	];
}