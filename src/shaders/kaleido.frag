#define PI radians(180.0)
precision highp float;

varying vec2 UV;
uniform sampler2D tex;

uniform int wrapMode;
uniform vec2 canvasSize;
uniform vec2 imgSize;

uniform int kaleidoMode;
uniform vec2 srcPos;
uniform vec2 resPos;
uniform float angle;
uniform float startAngle;

uniform float sideLength;

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

vec2 rotateVec(vec2 vec, float a){
	mat3 rMat=mat3(cos(a), sin(a), 0.0,
    			  -sin(a), cos(a), 0.0,
    			      0.0,    0.0, 1.0);

	return vec2(rMat*vec3(vec, 1.0));
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

	vec2 relCoord=(UV-resPos)*canvasSize;

	if(kaleidoMode==1){

		//convert into a diamond coordinate system
		mat3 mat=mat3(1.0);
		mat=scaleMat(mat, vec2(sqrt(1.5), sqrt(0.5)));
		mat=rotateMat(mat, -PI/4.0);

		mat3 invMat=mat3(1.0); //inverse transformation matrix
		invMat=rotateMat(invMat, PI/4.0);
		invMat=scaleMat(invMat, vec2(sqrt(2.0/3.0), sqrt(2.0)));

		float corLen=sideLength*sqrt(3.0)/2.0; //corrected side length

		vec2 newCoord=vec2(mat*vec3(relCoord, 1.0)); //coordinate transofmred into new coordinate system
		vec2 triCoord=floor(newCoord/corLen);

		//calculate triangle coordinates and number of case
		vec2 modTriCoord=mod(triCoord, 3.0);

		bool bot=(mod(floor(relCoord.y/corLen), 2.0)==1.0) ^^ (mod(triCoord.x+triCoord.y, 2.0)==1.0); //indicates whether the points is in a bottom or top triangle
		vec2 realTriCoord=vec2(invMat*vec3(triCoord*corLen, 1.0)); //triangle coordinates
		if(bot){
			realTriCoord.y+=2.0/sqrt(3.0)*sideLength;
		}else{
			realTriCoord.y+=1.0/sqrt(3.0)*sideLength;
		}

		vec2 inCoord=relCoord-realTriCoord;

		int num=int(mod(2.0*modTriCoord.x + 2.0*(3.0-modTriCoord.y) + float(bot), 6.0)); //case number

		if(num==1){
			inCoord.y=-inCoord.y;
		}else if(num==2){
			inCoord=rotateVec(inCoord, PI*2.0/3.0);
		}else if(num==3){
			inCoord.x=-inCoord.x;
			inCoord=rotateVec(inCoord, -PI/3.0);
		}else if(num==4){
			inCoord=rotateVec(inCoord, -PI*2.0/3.0);
		}else if(num==5){
			inCoord.x=-inCoord.x;
            inCoord=rotateVec(inCoord, PI/3.0);
		}

		inCoord=rotateVec(inCoord, startAngle);

		gl_FragColor=texture2D(tex, myWrap( (srcPos*canvasSize + inCoord)/imgSize ));

	}else{

		float curAngle=atan(relCoord.y, relCoord.x)+PI;

		float sectorNum=floor(curAngle/angle);

		mat3 mat=mat3(1.0);

		if(mod(sectorNum, 2.0)!=1.0){
			mat=rotateMat(mat, -startAngle);
			mat=rotateMat(mat, -angle*sectorNum);
		}else{
			mat=rotateMat(mat, startAngle);
			mat=rotateMat(mat, -angle*sectorNum-angle);
			mat=scaleMat(mat, vec2(1.0, -1.0));
		}

		vec3 vert=vec3(relCoord, 1.0);
		vert=mat*vert;

   		gl_FragColor=texture2D(tex, myWrap((srcPos*canvasSize+vec2(vert))/imgSize));

   	}

}