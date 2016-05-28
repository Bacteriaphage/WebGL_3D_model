function initCamera(){
	VP = {
		view_translationMatrix : view.makeTranslation(0.0, 0.5, 1.0),
		view_rotationXMatrix : view.makeXRotation(-Math.PI * 30 / 180),
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