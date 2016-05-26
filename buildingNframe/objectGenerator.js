var generateObj = {
	cuboid : function(x, y, z, len, wid, hei){
		console.log("cuboid created");
		return [
		//front
		x,	y,	z,
		x+len, y+hei, z,
		x,	y+hei,	z,
		x,	y,	z,
		x+len, y+hei, z,
		x+len, y, z,
		//back
		x,	y,	z-wid,
		x+len, y+hei, z-wid,
		x,	y+hei,	z-wid,
		x,	y,	z-wid,
		x+len, y+hei, z-wid,
		x+len, y, z-wid,
		//left
		x, 	y,	z-wid,
		x,	y+hei, z,
		x,	y+hei, z-wid,
		x, 	y,	z-wid,
		x,	y+hei, z,
		x,	y,	z,
		//right
		x+len, y, z,
		x+len, y+hei, z-wid,
		x+len, y+hei, z,
		x+len, y, z,
		x+len, y+hei, z-wid,
		x+len, y, z-wid,
		//top
		x,	y+hei, z,
		x+len, y+hei, z-wid,
		x,	y+hei,	z-wid,
		x,	y+hei, z,
		x+len, y+hei, z-wid,
		x+len, y+hei, z,
		//bottom
		x,	y,	z-wid,
		x+len, y, z,
		x,	y,	z,
		x,	y,	z-wid,
		x+len, y, z,
		x+len, y, z-wid
		];
	},
	framework : function(x, y, z, len, wid, hei){
		return[
		x,	y,	z,
		x+len, y, z,
		x+len, y, z,
		x+len, y+hei, z,
		x+len, y+hei, z,
		x,	y+hei, z,
		x,	y+hei, z,
		x,	y,	z,
		
		x,	y,	z,
		x,	y,	z-wid,
		x,	y,	z-wid,
		x,	y+hei, z-wid,
		x,	y+hei, z-wid,
		x,	y+hei, z,
		
		x+len, y, z,
		x+len, y, z-wid,
		x+len, y, z-wid,
		x+len, y+hei, z-wid,
		x+len, y+hei, z-wid,
		x+len, y+hei, z,
		
		x, y+hei, z-wid,
		x+len, y+hei, z-wid,
		x,	y,	z-wid,
		x+len, y, z-wid
		];
	}
}
var generateColor = {
	cuboid : function(r, g, b, a){
		console.log("color created")
		return [
		r, 0, b, a,
		r, 0, b, a,
		r, 0, b, a,
		r, 0, b, a,
		r, 0, b, a,
		r, 0, b, a,
		
		r, g, 0, a,
		r, g, 0, a,
		r, g, 0, a,
		r, g, 0, a,
		r, g, 0, a,
		r, g, 0, a,
		
		0, g, b, a,
		0, g, b, a,
		0, g, b, a,
		0, g, b, a,
		0, g, b, a,
		0, g, b, a,
		
		0, 0, b, a,
		0, 0, b, a,
		0, 0, b, a,
		0, 0, b, a,
		0, 0, b, a,
		0, 0, b, a,
		
		r, 0, 0, a,
		r, 0, 0, a,
		r, 0, 0, a,
		r, 0, 0, a,
		r, 0, 0, a,
		r, 0, 0, a,
		
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a
		];
	},
	framework : function(r, g, b, a){
		return[
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,
		r, g, b, a,];
	}
}
var generateNormal = {
	cuboid : function(x, y, z, len, wid, hei){
		return [
		0,	0,	1,
		0,	0,	1,
		0,	0,	1,
		0,	0,	1,
		0,	0,	1,
		0,	0,	1,
		0,	0,	-1,
		0,	0,	-1,
		0,	0,	-1,
		0,	0,	-1,
		0,	0,	-1,
		0,	0,	-1,
		-1,	0,	0,
		-1,	0,	0,
		-1,	0,	0,
		-1,	0,	0,
		-1,	0,	0,
		-1,	0,	0,
		1,	0,	0,
		1,	0,	0,
		1,	0,	0,
		1,	0,	0,
		1,	0,	0,
		1,	0,	0,
		0,	1,	0,
		0,	1,	0,
		0,	1,	0,
		0,	1,	0,
		0,	1,	0,
		0,	1,	0,
		0,	-1,	0,
		0,	-1,	0,
		0,	-1,	0,
		0,	-1,	0,
		0,	-1,	0,
		0,	-1,	0
		];
	}
}