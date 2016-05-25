var gl;
var vertexPositionAttribute;
var vertexColorAttribute;
var texcoordAttribute;
var verticeBuffer;
var colorBuffer;
var MVPuniform;
var objects = new Array();
var color = new Array();
var time = 0;
function Main(){
	var canvas = document.getElementById("mainWindow");
	console.log("load successfully!");
	
	gl = initWebGL(canvas);
	if(gl){
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	var fragmentShader = getShader(gl, "fragment_shader");
	var vertexShader = getShader(gl, "vertex_shader");

	//create a program

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
		alert("Unable to initialize shaders.");
	}
	gl.useProgram(shaderProgram);
	
	objects[0] = generateObj.cuboid(0, 0, 0, 0.2, 0.2, 0.2);
	objects[1] = generateObj.cuboid(0, 0, 0, 0.4, 0.2, 0.2);
	objects[2] = generateObj.cuboid(0, 0, 0, 0.2, 0.2, 0.5);
	
	color[0] = generateColor.cuboid(1.0, 0.5, 0.4, 1.0);
	color[1] = generateColor.cuboid(0.7, 0.3, 0.6, 1.0);
	color[2] = generateColor.cuboid(0.5, 0.1, 0.7, 1.0);
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
//	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//	gl.enableVertexAttribArray(vertexColorAttribute);
	
	MVPuniform = gl.getUniformLocation(shaderProgram, "u_matrix");
	
	requestAnimationFrame(draw);
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

function draw(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);
	time = time + 1;
	if(time == 360) time = 0;
	//VP
	var VP = {
		view_translationMatrix : view.makeTranslation(0.0, 0.4, 1.0),
		view_rotationXMatrix : view.makeXRotation(Math.PI * 50 / 180),
		view_rotationYMatrix : view.makeYRotation(0),
		view_rotationZMatrix : view.makeZRotation(0),
		projectionMatrix : make2DProjection(Math.PI * 60/180, 600/480, 0.1, 50.0)
	};
	var M = {
		translationMatrix : null,
		rotationXMatrix : null,
		rotationYMatrix : null,
		rotationZMatrix : null,
		scaleMatrix : null
	};
	
	verticeBuffer = setBuffer(gl, objects[0]);
	colorBuffer = setBuffer(gl, color[0]);
	setAttribute(gl, vertexPositionAttribute, vertexColorAttribute, verticeBuffer, colorBuffer);
	
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(-0.5, -0.1, 0.1);
	M.rotationXMatrix = model.makeXRotation(0);
	M.rotationYMatrix = model.makeYRotation(Math.PI * time / 180);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	var matrix = MVPmatrix(M, VP);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	verticeBuffer = setBuffer(gl, objects[1]);
	colorBuffer = setBuffer(gl, color[1]);
	setAttribute(gl, vertexPositionAttribute, vertexColorAttribute, verticeBuffer, colorBuffer);
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(-0.2, -0.1, 0.2);
	M.rotationXMatrix = model.makeXRotation(Math.PI*(time/180));
	M.rotationYMatrix = model.makeYRotation(0);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	matrix = MVPmatrix(M, VP);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	
	verticeBuffer = setBuffer(gl, objects[2]);
	colorBuffer = setBuffer(gl, color[2]);
	setAttribute(gl, vertexPositionAttribute, vertexColorAttribute, verticeBuffer, colorBuffer);
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(0.5, -0.1, 0.25);
	M.rotationXMatrix = model.makeXRotation(0);
	M.rotationYMatrix = model.makeYRotation(0);
	M.rotationZMatrix = model.makeZRotation(Math.PI*(time/180));
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	matrix = MVPmatrix(M, VP);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	var point = document.getElementById("point");
	point.innerHTML = matrix[15];
	
	requestAnimationFrame(draw);
}
