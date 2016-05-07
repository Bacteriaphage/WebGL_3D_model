var gl; // a global variable for WebGL
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var texcoordLocation;
var squareVerticesBuffer;
var fragColorBuffer;
var texcoordBuffer;
var timeUniform;
var _time = 0.0;
var matrixLocation;

function Initial(){
	console.log("works well");

	var canvas = document.getElementById("fundi");
	gl = initWebGL(canvas);
	
	if(gl){
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	var fragmentShader = getShader(gl, "2d-fragment-shader");
	var vertexShader = getShader(gl, "2d-vertex-shader");

	//create a program

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		alert("Unable to initialize shaders.");
	}
	gl.useProgram(shaderProgram);

	//give shader a attribute
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	//give shader a texcoord attribute
	texcoordLocation = gl.getAttribLocation(shaderProgram, "a_texcoord");
	gl.enableVertexAttribArray(texcoordLocation);
	setTexcood(gl);
	//give shader a time uniform
	timeUniform = gl.getUniformLocation(shaderProgram, "aTime");
	//give shader a MVP uniform
	matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
	
	initBuffers();
	//create texture
	var texture = gl.createTexture();
	var image = new Image();
	//image.crossOrigin = "Anonymous"
	image.src = "http://localhost:8000/Textures.png";
	image.addEventListener('load', function(){
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	});

	
	drawScene();

}

function initWebGL(canvas){
	gl = null;
	try{
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");		
	}catch(e){}

	if(!gl){
		alert("Unable to initialize WebGL.");
		gl = null;
	}

	return gl;
}

function getShader(gl, id){
	var shaderScript, theSource, currentChild, shader;
	//read shader program and compile that.
	shaderScript = document.getElementById(id);

	if(!shaderScript){
		return null;
	}

	theSource = "";
	currentChild = shaderScript.firstChild;

	while(currentChild){
		if(currentChild.nodeType == currentChild.TEXT_NODE){
			theSource += currentChild.textContent;
		}
		currentChild = currentChild.nextSibling;
	}

	if(shaderScript.type == "x-shader/x-fragment"){
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	}
	else if(shaderScript.type == "x-shader/x-vertex"){
		shader = gl.createShader(gl.VERTEX_SHADER);
	}
	else{
		return null;
	}

	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader) + id);  
		return null;  
	}
    
  return shader;
}

function initBuffers(){
	squareVerticesBuffer = gl.createBuffer();
	//bind buffer, in js don`t try to unbind buffer like openGL
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	var vertices = [
	//front
    0.5,  0.5,  0.5,
    -0.5, 0.5,  0.5,
    0.5,  -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5,  0.5,
    0.5,  -0.5, 0.5,
	//bottom
	-0.5, -0.5, 0.5,
	0.5,  -0.5, 0.5,
	0.5,  -0.5,-0.5,
	0.5,  -0.5,-0.5,
	-0.5, -0.5, 0.5,
	-0.5, -0.5,-0.5,
	//top
	-0.5,  0.5, 0.5,
	0.5,   0.5, 0.5,
	0.5,   0.5,-0.5,
	0.5,   0.5,-0.5,
	-0.5,  0.5, 0.5,
	-0.5,  0.5,-0.5,
	//back
	0.5,  0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5,  -0.5,-0.5,
    -0.5, -0.5,-0.5,
    -0.5, 0.5, -0.5,
    0.5,  -0.5,-0.5,
	//left
	-0.5,  0.5, 0.5,
	-0.5,  0.5,-0.5,
	-0.5, -0.5,-0.5,
	-0.5, -0.5,-0.5,
	-0.5,  0.5, 0.5,
	-0.5, -0.5, 0.5,
	//right
	0.5,  0.5,  0.5,
	0.5,  0.5, -0.5,
	0.5, -0.5, -0.5,
	0.5, -0.5, -0.5,
	0.5,  0.5,  0.5,
	0.5, -0.5,  0.5
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
}
//set texture
function setTexcood(gl){
	texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	var coordinate = [
	//front
	0.1875, 0,
	0.125,  0,
	0.1875, 0.0625,
	0.125,  0.0625,
	0.125,  0,
	0.1875, 0.0625,
	//bottom
	0,      0,
	0.0625, 0,
	0.0625, 0.0625,
	0.0625, 0.0625,
	0,      0,
	0,      0.0625,
	//top
	0.0625, 0.0625,
	0.125,  0.0625,
	0.125,  0.125,
	0.125,  0.125,
	0.0625, 0.0625,
	0.0625, 0.125,
	//back
	0.1875, 0,
	0.125,  0,
	0.1875, 0.0625,
	0.125,  0.0625,
	0.125,  0,
	0.1875, 0.0625,
	//left
	0.1875, 0,
	0.125,  0,
	0.125,  0.0625,
	0.125,  0.0625,
	0.1875, 0,
	0.1875, 0.0625,
	//right
	0.125,  0,
	0.1875, 0,
	0.1875, 0.0625,
	0.1875, 0.0625,
	0.125,  0,
	0.125,  0.0625
	]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinate), gl.STATIC_DRAW);
}


function drawScene(){

//	perspectiveMatrix = makePrespective(45, 640.0/480.0, 0.1, 100.0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

 	requestAnimationFrame(render);

}

function render(){

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);

	gl.uniform1f(timeUniform, _time);

	_time = _time + 0.01;

	var projectionMatrix =
	  make2DProjection(600, 480, 400);
	var translationMatrix =
	  makeTranslation(0, 0, 0);
	var rotationXMatrix = makeXRotation(0.5);
	var rotationYMatrix = makeYRotation(_time);
	var rotationZMatrix = makeZRotation(0.5);
	var scaleMatrix = makeScale(1, 1, 1);

	// Multiply the matrices.
	var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
	matrix = matrixMultiply(matrix, rotationYMatrix);
	matrix = matrixMultiply(matrix, rotationXMatrix);
	matrix = matrixMultiply(matrix, translationMatrix);
//	matrix = matrixMultiply(matrix, projectionMatrix);

	// Set the matrix.
	gl.uniformMatrix4fv(matrixLocation, false, matrix);
	gl.drawArrays(gl.TRIANGLES , 0, 36);	
	requestAnimationFrame(render);
}