var gl;

var vertexPositionAttribute;
var vertexColorAttribute;
var vertexNormalAttribute;
var texcoordAttribute;

var verticeBuffer;
var colorBuffer;
var normalBuffer;

var MVPuniform;
var Worlduniform;
var reverseLightDirectionLocation;
var pointLightLocation;
var lightModeLocation;
var worldInverseTransposeLocation;  

var objects = new Array();
var color = new Array();
var normal = new Array();
var framework = new Array();
var framecolor = new Array();

var VP, lightVP, M;

var _time = 0;
var _rotating = 1;
var _lightDirection = [1, 0, 0];
var _lightPosition = [0, 0, 0];
var light = 0;
var OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
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
	
	//gl.useProgram(normalProgram);
	
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
	//Initialize shader for shadow map
	var shadowVertex = getShader(gl, "shadow_vertex");
	var shadowFragment = getShader(gl, "shadow_fragment");
	var shadowProgram = gl.createProgram();
	gl.attachShader(shadowProgram, shadowVertex);
	gl.attachShader(shadowProgram, shadowFragment);
	gl.linkProgram(shadowProgram);
	if(!gl.getProgramParameter(shadowProgram, gl.LINK_STATUS)){
		alert("Unable to initialize shaders.");
	}
	shaderProgram.a_Position = gl.getAttribLocation(shadowProgram, "aVertexPosition");
	shaderProgram.u_MvpMatrix = gl.getAttribLocation(shadowProgram, "u_matrix");
	
	//Initialize shader for regular drawing
	var fragmentShader = getShader(gl, "fragment_shader");
	var vertexShader = getShader(gl, "vertex_shader");
	var normalProgram = gl.createProgram();
	gl.attachShader(normalProgram, vertexShader);
	gl.attachShader(normalProgram, fragmentShader);
	gl.linkProgram(normalProgram);

	if(!gl.getProgramParameter(normalProgram, gl.LINK_STATUS)){
		alert("Unable to initialize shaders.");
	}
	vertexPositionAttribute = gl.getAttribLocation(normalProgram, "aVertexPosition");
	vertexColorAttribute = gl.getAttribLocation(normalProgram, "aVertexColor");
	vertexNormalAttribute = gl.getAttribLocation(normalProgram, "aVertexNormal");
	MVPuniform = gl.getUniformLocation(normalProgram, "u_matrix");
	Worlduniform = gl.getUniformLocation(normalProgram, "world");
	reverseLightDirectionLocation = gl.getUniformLocation(normalProgram, "reverseLightDirection");
	pointLightLocation = gl.getUniformLocation(normalProgram, "pointLight")
	worldInverseTransposeLocation = gl.getUniformLocation(normalProgram, "u_worldInverseTranspose");
	lightModeLocation = gl.getUniformLocation(normalProgram, "lightMode");
	
	//Initialize framebuffer objects
	var fbo = initFramebufferObject(gl);
	if (!fbo) {
		console.log('Failed to initialize frame buffer object');
		return;
	}
	gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
	gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
	
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

function lightControl(){
	if(document.getElementById("light_control").innerHTML == "N/A")
		return;
	else if(document.getElementById("light_control_mode").innerHTML == "light direction"){
		_lightDirection[0] = -document.getElementById("input_x").value;
		_lightDirection[1] = -document.getElementById("input_y").value;
		_lightDirection[2] = -document.getElementById("input_z").value;
		return;
	}
	else if(document.getElementById("light_control_mode").innerHTML == "light position"){
		_lightPosition[0] = document.getElementById("input_x").value;
		_lightPosition[1] = document.getElementById("input_y").value;
		_lightPosition[2] = document.getElementById("input_z").value;
		return;

	}
}
  
function noLight(){
	if(document.getElementById("no_light").style.color == "red") return;
	document.getElementById("no_light").style.color = "red";
	document.getElementById("direct_light").style.color = "gray";
	document.getElementById("point_light").style.color = "gray";
	document.getElementById("light_control_mode").innerHTML = "N/A";
	light = 0;
}
function directLight(){
	if(document.getElementById("direct_light").style.color == "red") return;
	document.getElementById("direct_light").style.color = "red";
	document.getElementById("no_light").style.color = "gray";
	document.getElementById("point_light").style.color = "gray";
	document.getElementById("light_control_mode").innerHTML = "light direction";
	light = 1;
}
function pointLight(){
	if(document.getElementById("point_light").style.color == "red") return;
	document.getElementById("point_light").style.color = "red";
	document.getElementById("no_light").style.color = "gray";
	document.getElementById("direct_light").style.color = "gray";
	document.getElementById("light_control_mode").innerHTML = "light position";
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
	_time = _time + 1;
	if(_time == 360) _time = 0;
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
	M.rotationYMatrix = model.makeYRotation(_rotating * Math.PI * _time / 180);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	var matrix = MVPmatrix(M, VP);
	var worldMatrix = WorldMatrix(M);
	var worldInverseMatrix = matrix_invert(convert1to2(worldMatrix));
	var worldInverseTransposeMatrix = makeTranspose(convert2to1(worldInverseMatrix));
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniformMatrix4fv(Worlduniform, false, worldMatrix);
	gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
	gl.uniform1i(lightModeLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize(_lightDirection));
	gl.drawArrays(gl.TRIANGLES, 0, 36);
	
	if(document.getElementById("building").style.color=="gray"){
		console.log("exit 3D");
		return;
	} 
	requestAnimationFrame(draw3Dmodel);
}
function drawFrame(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFRT_BIT);
	_time = _time + 1;
	if(_time == 360) _time = 0;
	//VP
	verticeBuffer = setBuffer(gl, framework[0]);
	colorBuffer = setBuffer(gl, framecolor[0]);
	setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
	setColorAttribute(gl, vertexColorAttribute, colorBuffer);
	// Modeling
	M.translationMatrix =
	  model.makeTranslation(0.0, 0.0, 0.0);
	M.rotationXMatrix = model.makeXRotation(0);
	M.rotationYMatrix = model.makeYRotation(_rotating * Math.PI * _time / 180);
	M.rotationZMatrix = model.makeZRotation(0);
	M.scaleMatrix = model.makeScale(1.0, 1.0, 1.0);
	var matrix = MVPmatrix(M, VP);
	var worldMatrix = WorldMatrix(M);
	var worldInverseMatrix = matrix_invert(convert1to2(worldMatrix));
	var worldInverseTransposeMatrix = makeTranspose(convert2to1(worldInverseMatrix));
	gl.uniformMatrix4fv(MVPuniform, false, matrix);
	gl.uniformMatrix4fv(Worlduniform, false, worldMatrix);
	gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
	gl.uniform1i(lightModeLocation, light);
	gl.uniform3fv(reverseLightDirectionLocation, normalize(_lightDirection));
	gl.drawArrays(gl.LINES, 0, 24);
	
	for(i = 1; i < objects.length; i++){
		verticeBuffer = setBuffer(gl, objects[i]);
		colorBuffer = setBuffer(gl, color[i]);
		normalBuffer = setBuffer(gl, normal[i]);
		setPointAttribute(gl, vertexPositionAttribute, verticeBuffer);
		setColorAttribute(gl, vertexColorAttribute, colorBuffer);
		setNormalAttribute(gl, vertexNormalAttribute, normalBuffer);
		gl.uniformMatrix4fv(MVPuniform, false, matrix);
		gl.uniformMatrix4fv(Worlduniform, false, worldMatrix);
		gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
		gl.uniform1i(lightModeLocation, light);
		gl.uniform3fv(reverseLightDirectionLocation, normalize(_lightDirection));
		gl.uniform3fv(pointLightLocation, _lightPosition);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	}
	
	if(document.getElementById("framework").style.color=="gray") return;
	requestAnimationFrame(drawFrame);
}
