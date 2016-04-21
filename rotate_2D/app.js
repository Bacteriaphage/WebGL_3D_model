var gl; // a global variable for WebGL
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var squareVerticesBuffer;
var fragColorBuffer;
var timeUniform;
var _time = 0.0;
var rotateUniform;
var rotate2D = [0,1]; 
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

	//give shader a color attribute
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
	gl.enableVertexAttribArray(vertexColorAttribute);

	//give shader a time uniform
	timeUniform = gl.getUniformLocation(shaderProgram, "aTime");
	rotateUniform = gl.getUniformLocation(shaderProgram, "aRotate2D");
	initBuffers();

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
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0	
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	fragColorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, fragColorBuffer);

	var color = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

	
}

function drawScene(){

//	perspectiveMatrix = makePrespective(45, 640.0/480.0, 0.1, 100.0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, fragColorBuffer);

	gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

 	requestAnimationFrame(render);

}

function render(){

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);

	gl.uniform1f(timeUniform, _time);
	gl.uniform2fv(rotateUniform, rotate2D);
	rotate2D = [Math.cos(_time),Math.sin(_time)];
	_time = _time + 0.01;

	gl.drawArrays(gl.TRIANGLES , 0, 6);	
	requestAnimationFrame(render);
}