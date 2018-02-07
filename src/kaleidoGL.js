
var glCanvas;
var gl;

var p;
var quadBuf;

var shaderSrc=require("./shaderSrc.js");
var shader=require("./shader.js");

document.addEventListener("DOMContentLoaded", function(e){

	//GET THE WEBGL CONTEXT
	glCanvas=document.getElementById("glCanvas");
	gl=glCanvas.getContext("webgl");
	if(gl==null){
		alert("There was a problem creating webGL rendering context, your browser probably doesn't support it");
	}

	//SETUP THE SHADERS
	p=new shader.Program(gl, shaderSrc.vert, shaderSrc.frag);

	//SETUP THE QUAD BUFFER
	var points=[-1, -1,
				-1,  1,
				 1, -1,
				 1,  1];
	quadBuf=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
		gl.getAttribLocation(p.id, "pos"),
		2,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(gl.getAttribLocation(p.id, "pos"));

	gl.useProgram(p.id);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});