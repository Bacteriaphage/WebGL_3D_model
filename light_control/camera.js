var originX, originY;
var degreeX = 0, degreeY = 0;
var cameraRXZ = 0; cameraRYZ = 0;
var currentX = 0, currentY = 0;
var directionVec = {
	x : 0,
	y : 0,
	z : -1
};
var cameraCoor = {
	x : 0.0,
	y : 0.5,
	z : 1.0
};
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
	document.getElementById("mainWindow").addEventListener("keydown", cameraMove);
}

function startMove(event){
	originX = event.x;
	originY = event.y;
	console.log("push");
	document.getElementById("mainWindow").addEventListener("mousemove", cameraRotate);
	
}
function endMove(){
	console.log("leave");
	document.getElementById("mainWindow").removeEventListener("mousemove",cameraRotate);
	
	degreeX = degreeX - cameraRXZ / 4;
	degreeY = degreeY + cameraRYZ / 4;
}

function cameraRotate(event){
	console.log("moving");
	cameraRYZ = event.x - originX;
	cameraRXZ = originY - event.y;
	
	VP.view_rotationXMatrix = view.makeXRotation(-Math.PI * (degreeX - (originY - event.y) / 4) / 180 * Math.cos(currentY));
	VP.view_rotationYMatrix = view.makeYRotation(-Math.PI * (degreeY + (event.x - originX) / 4) / 180);
	VP.view_rotationZMatrix = view.makeZRotation(Math.PI * (degreeX - (originY - event.y) / 4) / 180 * Math.sin(currentY));
	currentX =-Math.PI * (degreeX - (originY - event.y) / 4) / 180;
	currentY =-Math.PI * (degreeY + (event.x - originX) / 4) / 180;
	document.getElementById("cameraX").innerHTML = currentX;
	document.getElementById("cameraY").innerHTML = currentY;
}

function cameraMove(event){
	console.log("move");
	directionVec.x = -Math.sin(currentY)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.sin(currentX)*Math.sin(currentX)+Math.cos(currentY)*Math.cos(currentY)));
	directionVec.y = Math.sin(currentX)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.sin(currentX)*Math.sin(currentX)+Math.cos(currentY)*Math.cos(currentY)));
	directionVec.z = -Math.cos(currentY)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.sin(currentX)*Math.sin(currentX)+Math.cos(currentY)*Math.cos(currentY)));
	
	if(event.which == 87){
		cameraCoor.x += directionVec.x / 20;
		cameraCoor.y += directionVec.y / 20;
		cameraCoor.z += directionVec.z / 20;
		VP.view_translationMatrix = view.makeTranslation(cameraCoor.x, cameraCoor.y, cameraCoor.z);
	}
	else if(event.which == 83){
		cameraCoor.x -= directionVec.x / 20;
		cameraCoor.y -= directionVec.y / 20;
		cameraCoor.z -= directionVec.z / 20;
		VP.view_translationMatrix = view.makeTranslation(cameraCoor.x, cameraCoor.y, cameraCoor.z);
	}
	else if(event.which == 65){
		cameraCoor.x += -Math.sin(currentY + Math.PI / 2)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.cos(currentY)*Math.cos(currentY))) / 20;
		cameraCoor.z += -Math.cos(currentY + Math.PI / 2)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.cos(currentY)*Math.cos(currentY))) / 20;
		VP.view_translationMatrix = view.makeTranslation(cameraCoor.x, cameraCoor.y, cameraCoor.z);
	}
	else if(event.which == 68){
		cameraCoor.x += -Math.sin(currentY - Math.PI / 2)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.cos(currentY)*Math.cos(currentY))) / 20;
		cameraCoor.z += -Math.cos(currentY - Math.PI / 2)/(Math.sqrt(Math.sin(currentY)*Math.sin(currentY)+Math.cos(currentY)*Math.cos(currentY))) / 20;
		VP.view_translationMatrix = view.makeTranslation(cameraCoor.x, cameraCoor.y, cameraCoor.z);
		
	}
	document.getElementById("cameraX").innerHTML = currentX;
	document.getElementById("cameraY").innerHTML = currentY;
}