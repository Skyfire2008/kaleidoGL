var glCanvas;
var gl;

document.addEventListener("DOMContentLoaded", function(e){
	glCanvas=document.getElementById("glCanvas");
	gl=glCanvas.getContext("webgl");
	if(gl==null){
		alert("There was a problem creating webGL rendering context, your browser probably doesn't support it");
	}
});