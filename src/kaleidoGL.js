
var glCanvas;
var gl;

var p;
var quadBuf;
var tex=null;

var resXInput;
var resYInput;
var srcXInput;
var srcYInput;

var shaderSrc=require("./shaderSrc.js");
var shader=require("./shader.js");
var vectors=require("./vectors.js");

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
					p.setInt("tex", 0);
					p.setVec2("imgSize", new vectors.Vec2(img.naturalWidth, img.naturalHeight));
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
				});
				img.src=ev.target.result;
			});
			fr.readAsDataURL(input.files[0]);
		}
	});

	document.getElementById("sectorInput").addEventListener("change", function(e){
		p.setFloat("angle", Math.PI/e.target.valueAsNumber);
		redraw();
	});

	resXInput=document.getElementById("resXInput");
	resXInput.addEventListener("change", function(e){
		setPoint("resPos", resXInput.valueAsNumber, resYInput.valueAsNumber);
		redraw();
	});

	resYInput=document.getElementById("resYInput");
	resYInput.addEventListener("change", function(e){
		setPoint("resPos", resXInput.valueAsNumber, resYInput.valueAsNumber);
		redraw();
	});

	srcXInput=document.getElementById("srcXInput");
	srcXInput.addEventListener("change", function(e){
		setPoint("srcPos", srcXInput.valueAsNumber, srcYInput.valueAsNumber);
		redraw();
	});

	srcYInput=document.getElementById("srcYInput");
	srcYInput.addEventListener("change", function(e){
		setPoint("srcPos", srcXInput.valueAsNumber, srcYInput.valueAsNumber);
		redraw();
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

	p.use();
	p.setInt("wrapMode", 2);
	p.setVec2("canvasSize", new vectors.Vec2(glCanvas.width, glCanvas.height));

	redraw();
});

redraw=function(){
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

setPoint=function(name, x, y){
	if(tex!=null) {
		p.setVec2(name, new vectors.Vec2(x / glCanvas.width, y / glCanvas.height));
	}
};