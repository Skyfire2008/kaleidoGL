
var storage;

const defWidth=1280;
const defHeight=720;
var canvasWidth;
var canvasHeight;
var glCanvas;
var gl;

var p;
var quadBuf;
var tex=null;

var linkInput;
var resXInput;
var resYInput;
var srcXInput;
var srcYInput;

var shaderSrc=require("./shaderSrc.js");
var shader=require("./shader.js");
var vectors=require("./vectors.js");

document.addEventListener("DOMContentLoaded", function(e){

	//SETUP THE CANVAS
	glCanvas=document.getElementById("glCanvas");
	storage=window.localStorage;
	canvasWidth=storage.getItem("canvasWidth");
	canvasHeight=storage.getItem("canvasHeight");
	if(canvasWidth==null){
		canvasWidth=defWidth;
		storage.setItem("canvasWidth", canvasWidth);
	}
	if(canvasHeight==null){
		canvasHeight=defHeight;
		storage.setItem("canvasHeight", canvasHeight);
	}
	glCanvas.width=canvasWidth;
	glCanvas.height=canvasHeight;

	document.getElementById("widthInput").value=canvasWidth;
	document.getElementById("heightInput").value=canvasHeight;

	//SET CONTROLS' STYLE
	let controls=document.getElementById("controls");
	let rect=glCanvas.getBoundingClientRect();
	controls.style.position="absolute";
	controls.style.top=rect.top+"px";
	controls.style.left=rect.right+rect.left+"px";

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
					redraw();
				});
				img.src=ev.target.result;

			});
			fr.readAsDataURL(input.files[0]);
		}
	});

	document.getElementById("kaleidoMode").addEventListener("change", function(e){
		p.setInt("kaleidoMode", e.target.value);
		redraw();
	});

	document.getElementById("sideLengthInput").addEventListener("change", function(e){
		p.setFloat("sideLength", e.target.valueAsNumber);
		redraw();
	});

	linkInput=document.getElementById("linkInput");
	document.getElementById("linkButton").addEventListener("click", function(e){
		let img=new Image();
		img.crossOrigin="Anonymous";
		img.addEventListener("load", function(ev){
			tex=new shader.Texture(gl, img);
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, tex.id);
			p.setInt("tex", 0);
			p.setVec2("imgSize", new vectors.Vec2(img.naturalWidth, img.naturalHeight));
			redraw();
		});
		img.src=linkInput.value;
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

	document.getElementById("startAngleInput").addEventListener("change", function(e){
		p.setFloat("startAngle", Math.PI*e.target.valueAsNumber/180);
		redraw();
	});

	document.getElementById("applySizeChangeButton").addEventListener("click", function(e){
		canvasWidth=document.getElementById("widthInput").valueAsNumber;
		canvasHeight=document.getElementById("heightInput").valueAsNumber;
		if(isNaN(canvasWidth) || canvasWidth<1){
			canvasWidth=defWidth;
		}
		if(isNaN(canvasHeight) || canvasHeight<1){
			canvasHeight=defHeight;
		}

		storage.setItem("canvasWidth", canvasWidth);
		storage.setItem("canvasHeight", canvasHeight);

		location.reload();
	});

	//GET THE WEBGL CONTEXT
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
	p.setFloat("angle", Math.PI);
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