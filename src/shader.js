//CONTAINS GL PROGRAM CODE

function Program(gl, vertSrc, fragSrc){
	this.id=gl.createProgram();

	vert=loadShader(gl, gl.VERTEX_SHADER, vertSrc);
	frag=loadShader(gl, gl.FRAGMENT_SHADER, fragSrc);

	gl.attachShader(this.id, vert);
	gl.attachShader(this.id, frag);

	gl.linkProgram(this.id);

	if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
		throw "Error while linking the program: " + gl.getProgramInfoLog(id);
	}
}

//taken from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
function loadShader(gl, type, src){
	const id=gl.createShader(type);
	gl.shaderSource(id, src);
	gl.compileShader(id);

	//check, that the shader was successfully compiled
	if(!gl.getShaderParameter(id, gl.COMPILE_STATUS)){
		throw "Error occurred while compiling shader: "+gl.getShaderInfoLog(id);
	}

	return id;
}

module.exports={
	Program: Program
};