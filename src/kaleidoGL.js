
var glCanvas;
var gl;

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
	var p=new shader.Program(gl, shaderSrc.vert, shaderSrc.frag);
});