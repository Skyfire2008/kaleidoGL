//CONTAINS GL PROGRAM CODE

function Program(gl, vertSrc, fragSrc){
	this.gl=gl;
	
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

Program.prototype.setFloat=function(name, val){
	this.gl.uniform1f(this.gl.getUniformLocation(this.id, name), val);
};

Program.prototype.setInt=function(name, val){
	this.gl.uniform1i(this.gl.getUniformLocation(this.id, name), val);
};

Program.prototype.setVec2=function(name, val){
	this.gl.uniform2f(this.gl.getUniformLocation(this.id, name), val.x, val.y);
};

Program.prototype.setVec3=function(name, val){
	this.gl.uniform3f(this.gl.getUniformLocation(this.id, name), val.x, val.y, val.z);
};

Program.prototype.use=function(){
	this.gl.useProgram(this.id);
};

function Texture(gl, img){
	this.width=img.naturalWidth;
	this.height=img.naturalHeight;
	
	//CONVERT IMAGE TO UINT8ARRAY
	let c=document.createElement("canvas");
	c.width=img.naturalWidth;
	c.height=img.naturalHeight;
	let ctx=c.getContext("2d");
	ctx.drawImage(img, 0, 0);

	let data=ctx.getImageData(0, 0, c.width, c.height);

	//PASS DATA TO GL
	this.gl=gl;
	this.id=gl.createTexture();

	gl.bindTexture(gl.TEXTURE_2D, this.id);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	
	gl.bindTexture(gl.TEXTURE_2D, null);

}

Texture.prototype.setParamI=function(prop, value){
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
	this.gl.texParameteri(this.gl.TEXTURE_2D, prop, value);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

Texture.prototype.setParamF=function(prop, value){
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
	this.gl.texParameterf(this.gl.TEXTURE_2D, prop, value);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
};

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
	Program: Program,
	Texture: Texture
};