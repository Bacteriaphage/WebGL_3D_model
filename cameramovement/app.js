var gl;

var vertexPositionAttribute;
var vertexColorAttribute;
var vertexNormalAttribute;
var texcoordAttribute;

var verticeBuffer;
var colorBuffer;
var normalBuffer;

var MVPuniform;
var reverseLightDirectionLocation;
var lightingLocation;

var objects = new Array();
var color = new Array();
var normal = new Array();
var framework = new Array();
var framecolor = new Array();

var VP, M;

var time = 0;
var rotating = 1;
var light = 0;
function Main(){
	var canvas = document.getElementById("mainWindow");
	console.log("load successfully!");
	
	gl = initWebGL(canvas);
	if(gl){
		gl.clearColor(0.0,0.0,0.5,0.3);
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
	initCamera();
	objects[0] = generateObj.cuboid(-0.2, 0.0, 0.2, 0.4, 0.4, 0.9);
	objects[1] = generateObj.cuboid(-0.2, 0.0, 0.1, 0.2, 0.2, 0.2);
	objects[2] = generateObj.cuboid(-0.2, 0.3, 0.2, 0.4, 0.4, 0.01);
	objects[3] = generateObj.cuboid(-0.2, 0.6, 0.2, 0.4, 0.4, 0.01);
	framework[0] = generateObj.framework(-0.2, 0.0, 0.2, 0.4, 0.4, 0.9);
	color[0] = generateColor.cuboid(1.0, 0.5, 0.4, 1.0);
	color[1] = generateColor.cuboid(0.5, 0.8, 0.2, 1.0);
	color[2] = generateColor.cuboid(1.0, 1.0, 1.0, 1.0);
	color[3] = generateColor.cuboid(1.0, 1.0, 1.0, 1.0);
	framecolor[0] = generateColor.framework(1.0, 1.0, 1.0, 1.0);
	normal[0] = generateNormal.cuboid(-0.2, 0.0, 0.2, 0.4, 0.4, 0.9);
	normal[1] = generateNormal.cuboid(-0.2, 0.0, 0.1, 0.2, 0.2, 0.2);
	normal[2] = generateNormal.cuboid(-0.2, 0.3, 0.2, 0.4, 0.4, 0.01);
	normal[3] = generateNormal.cuboid(-0.2, 0.6, 0.2, 0.4, 0.4, 0.01);
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
//	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
//	gl.enableVertexAttribArray(vertexColorAttribute);

	vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	
	MVPuniform = gl.getUniformLocation(shaderProgram, "u_matrix");
	
	reverseLightDirectionLocation = gl.getUniformLocation(shaderProgram, "reverseLightDirection");
	
	lightingLocation = gl.getUniformLocation(shaderProgram, "lightMode");
	
	document.getElementById("building").addEventListener("click", draw3D);
	document.getElementById("framework").addEventListener("click", drawF);
	document.getElementById("rotating").addEventListener("click", autoCamera);
	document.getElementById("free").addEventListener("click", freeCamera);
	document.getElementById("no_light").addEventListener("click", noLight);
	document.getElementById("direct_light").addEventListener("click", directLight);
	document.getElementById("point_light").addEventListener("click", pointLight);
	draw3Dmodel();
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
function noLight(){
	if(document.getElementById("no_light").style.color == "red") return;
	document.getElementById("no_light").style.color = "red";
	document.getElementById("direct_light").style.color = "gray";
	document.getElementById("point_light").style.color = "gray";
	light = 0;
}
function directLight(){
	if(document.getElementById("direct_light").style.color == "red") return;
	document.getElementById("direct_light").style.color = "red";
	document.getElementById("no_light").style.color = "gray";
	document.getElementById("point_light").style.color = "gray";
	light = 1;
}
function pointLight(){
	if(document.getElementById("point_light").style.color == "red") return;
	document.getElementById("point_light").style.color = "red";
	document.getElementById("no_light").style.color = "gray";
	document.getElementById("direct_light").style.color = "gray";
	light = 2;
}
function draw3D(){
	if(document.getElementById("building").style.color == "red") return;
	document.getElementById("building").style.color = "red";
	document.getElementById("framework").style.color = "gray";
	draw3Dmodel();
}
function drawF(){
	if(document.getElementById("framework").style.color == "red") return;
	document.getElementById("building").style.color = "gray";
	document.getElementById("framework").style.color = "red";
	
	drawFrame();
}
function draw3Dmodel(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);
	time = time + 1;
	if(time == 360) time = 0;
	verticeBuffer = setBuffer(gl, objects[0]);
	colorBuffer = setBuffer(gl, color[0]);
	normalBuffer = setBuffer(gl, normal[0]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	setNormalAttribute(gl, vertexNormalAttribute, normalBuffer);
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(0.0, 0.0, 0.0);
	M.rotationXMatrix = model.makeXRotation(0);
	M.rotationYMatrix = model.makeYRotation(rotating * Math.PI * time / 180);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	var matrix = MVPmatrix(M, VP);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniform1i(lightingLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	if(document.getElementById("building").style.color=="gray"){
		console.log("exit 3D");
		return;
	} 
	requestAnimationFrame(draw3Dmodel);
}
function drawFrame(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);
	time = time + 1;
	if(time == 360) time = 0;
	//VP
	verticeBuffer = setBuffer(gl, framework[0]);
	colorBuffer = setBuffer(gl, framecolor[0]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(0.0, 0.0, 0.0);
	M.rotationXMatrix = model.makeXRotation(0);
	M.rotationYMatrix = model.makeYRotation(rotating * Math.PI * time / 180);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	var matrix = MVPmatrix(M, VP);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniform1i(lightingLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
	gl.drawArrays(gl.LINES, 0, 24);
	
	verticeBuffer = setBuffer(gl, objects[1]);
	colorBuffer = setBuffer(gl, color[1]);
	normalBuffer = setBuffer(gl, normal[1]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	setNormalAttribute(gl, vertexNormalAttribute, normalBuffer);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniform1i(lightingLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	verticeBuffer = setBuffer(gl, objects[2]);
	colorBuffer = setBuffer(gl, color[2]);
	normalBuffer = setBuffer(gl, normal[2]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	setNormalAttribute(gl, vertexNormalAttribute, normalBuffer);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniform1i(lightingLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	verticeBuffer = setBuffer(gl, objects[3]);
	colorBuffer = setBuffer(gl, color[3]);
	normalBuffer = setBuffer(gl, normal[3]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	setNormalAttribute(gl, vertexNormalAttribute, normalBuffer);
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniform1i(lightingLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	if(document.getElementById("framework").style.color=="gray") return;
	requestAnimationFrame(drawFrame);
}
