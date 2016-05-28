var originX, originY;
var degreeX = 10, degreeY = 0;
var cameraRXZ = 0; cameraRYZ = 0;
var directionVec = [0, 0, -1];
function initCamera(){
	VP = {
		view_translationMatrix : view.makeTranslation(0.0, 0.5, 1.0),
		view_rotationXMatrix : view.makeXRotation(-Math.PI * degreeX / 180),
		view_rotationYMatrix : view.makeYRotation(0),
		view_rotationZMatrix : view.makeZRotation(0),
		projectionMatrix : make2DProjection(Math.PI * 90/180, 600/480, 0.1, 50.0)
	};
	M = {
		translationMatrix : null,
		rotationXMatrix : null,
		rotationYMatrix : null,
		rotationZMatrix : null,
		scaleMatrix : null
	};
}
function autoCamera(){
	document.getElementById("rotating").style.color = "red";
	document.getElementById("free").style.color = "gray";
	document.getElementById("mainWindow").removeEventListener("mousedown", startMove);
	document.getElementById("mainWindow").removeEventListener("mouseup", endMove);
	rotating = 1;
	return;
}

function freeCamera(){
	document.getElementById("rotating").style.color = "gray";
	document.getElementById("free").style.color = "red";
	rotating = 0;
	document.getElementById("mainWindow").addEventListener("mousedown", startMove);
	console.log("push done");
	document.getElementById("mainWindow").addEventListener("mouseup", endMove);
}

function startMove(event){
	originX = event.x;
	originY = event.y;
	console.log("push");
	document.getElementById("mainWindow").addEventListener("mousemove", cameraRotate);
	document.getElementById("mainWindow").addEventListener("keydown", cameraMove);
}
function endMove(){
	console.log("leave");
	document.getElementById("mainWindow").removeEventListener("mousemove",cameraRotate);
	document.getElementById("mainWindow").removeEventListener("keydown", cameraMove);
	degreeX = degreeX - cameraRXZ / 2;
	degreeY = degreeY + cameraRYZ / 2;
}

function cameraRotate(event){
	console.log("moving");
	cameraRYZ = event.x - originX;
	cameraRXZ = originY - event.y;
	document.getElementById("cameraX").innerHTML = degreeX - (originY - event.y) / 2;
	document.getElementById("cameraY").innerHTML = degreeY + (event.x - originX) / 2;
	VP.view_rotationXMatrix = view.makeXRotation(Math.PI * (degreeX - (originY - event.y) / 2) / 180);
	VP.view_rotationYMatrix = view.makeYRotation(Math.PI * (degreeY + (event.x - originX) / 2) / 180);
}

function cameraMove(event){
	
}