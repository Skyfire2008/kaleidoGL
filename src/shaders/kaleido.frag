#define PI radians(180.0)
precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform vec2 imgScale;
uniform int wrapMode;

uniform int kaleidoMode;
uniform vec2 srcPos;
uniform vec2 resPos;
uniform float sectors;
uniform float angle;
uniform float startAngle;

//MANUALLY WRAPS THE TEXTURE ACCORDING TO THE GIVEN MODE
//0 - CLAMP (DEFAULT)
//1 - REPEAT
//2 - MIRROR
vec2 myWrap(vec2 coords){
	vec2 result;
	
	if(wrapMode==1){
		result=fract(coords);

	}else if(wrapMode==2){
	    result=fract(coords);

	    vec2 mods=mod(coords-result, 2.0);

        if(mods.x!=0.0){
            result.x=1.0-result.x;
        }
        if(mods.y!=0.0){
            result.y=1.0-result.y;
        }

	}else{
		result=coords;
	}

	return result;

}

mat3 scaleMat(mat3 mat, vec2 sc){
	mat3 sMat=mat3(sc.x, 0.0,  0.0,
				   0.0,  sc.y, 0.0,
				   0.0,  0.0,  1.0);
	return sMat*mat;
}

mat3 rotateMat(mat3 mat, float a){
	mat3 rMat=mat3(cos(a),  sin(a), 0.0,
				   -sin(a), cos(a), 0.0,
				   0.0,     0.0,    1.0);
	return rMat*mat;
}

void main(){

	vec2 relCoord=UV-resPos;
	float curAngle=atan(relCoord.y, relCoord.x)+PI;

	float sectorNum=floor(curAngle/angle);

	mat3 mat=mat3(1.0);

	if(mod(sectorNum, 2.0)!=1.0){
		mat=rotateMat(mat, -radians(startAngle));
		mat=rotateMat(mat, -angle*sectorNum);
	}else{
		mat=rotateMat(mat, radians(startAngle));
		mat=rotateMat(mat, -angle*sectorNum-angle);
		mat=scaleMat(mat, vec2(1.0, -1.0));
	}

	vec3 vert=vec3(relCoord, 1.0);
	vert=mat*vert;

   	//dst=sampleLinear(src, checkCoord(sourcePos+float2(vert.x, vert.y)));
   	gl_FragColor=texture2D(tex, myWrap((srcPos+vec2(vert))*imgScale));

	//gl_FragColor=texture2D(tex, myWrap((UV-vec2(0.5, 0.5))*imgScale));
}