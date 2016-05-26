function setPointAttribute(gl, v_attribute, verticesBuffer){
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	gl.vertexAttribPointer(v_attribute, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(v_attribute);
}
function setColorAttribute(gl, c_attribute, colorBuffer){
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(c_attribute, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(c_attribute);
}
function setBuffer(gl, data){
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	return buffer;
}