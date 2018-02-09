attribute vec2 pos;

varying vec2 UV;

void main(){
	gl_Position=vec4(pos, 0.0, 1.0);
	UV=(pos+vec2(1.0, 1.0))/2.0;
	UV.y=1.0-UV.y;
}