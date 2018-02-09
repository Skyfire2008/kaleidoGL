precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform vec2 imgScale;
uniform int wrapMode;

vec2 myWrap(vec2 coords){
	float x=0.5;
	float y=0.5;
	
	if(wrapMode==1){
		x=fract(coords.x);
		y=fract(coords.y);

		if(coords.x<0.0){
			x+=1.0;
		}
		if(coords.y<0.0){
			y+=1.0;
		}
	}else{
		x=coords.x;
		y=coords.y;
	}

	return vec2(x, y);
}

void main(){
	gl_FragColor=texture2D(tex, myWrap(UV*imgScale));
}