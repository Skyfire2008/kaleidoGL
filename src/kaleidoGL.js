
var glCanvas;
var gl;

var p;
var quadBuf;
var tex;

var shaderSrc=require("./shaderSrc.js");
var shader=require("./shader.js");

document.addEventListener("DOMContentLoaded", function(e){

	//ATTACH EVENT LISTENERS TO UI ELEMENTS
	document.getElementById("fileInput").addEventListener("change", function(e){
		let input=e.target;
		if(input.files.length>0){

			let fr=new FileReader();
			let img=new Image();

			fr.addEventListener("load", function(ev){
				
				img.addEventListener("load", function(evt){
					tex=new shader.Texture(gl, img);
					gl.activeTexture(gl.TEXTURE0);
					gl.bindTexture(gl.TEXTURE_2D, tex.id);
					gl.uniform1i(gl.getUniformLocation(p.id, "tex"), 0);
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
				});
				img.src=ev.target.result;
			});
			fr.readAsDataURL(input.files[0]);
		}
	});

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