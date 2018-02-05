var vert=
"attribute vec2 pos;" +
"" +
"varying vec2 UV;" +
"" +
"void main(){" +
"	gl_Position=vec4(pos, 1.0, 1.0);" +
"	UV=(pos+vec2(1.0, 1.0))/2.0;" +
"}";

var frag=
"precision highp float;" +
"varying vec2 UV;" +
"" +
"void main(){" +
"	gl_FragColor=vec4(0.7, 0.8, 0.9, 1.0);" +
"}";

module.exports={
	vert: vert,
	frag: frag
};