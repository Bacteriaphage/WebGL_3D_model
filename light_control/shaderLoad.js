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