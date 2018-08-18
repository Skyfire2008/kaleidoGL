function Matrix3x3(values){
	
	if(values===undefined){
		this.m=new Float32Array(9);
		this.m[0]=1;
		this.m[4]=1;
		this.m[8]=1;
	}else{
		this.m=Float32Array.from(values);
	}
}

Matrix3x3.prototype.mult=function(other){
	let values=new Float32Array(9);

	values[0]=this.m[0]*other.m[0]+this.m[3]*other.m[1]+this.m[6]*other.m[2];
	values[1]=this.m[1]*other.m[0]+this.m[4]*other.m[1]+this.m[7]*other.m[2];
	values[2]=this.m[2]*other.m[0]+this.m[5]*other.m[1]+this.m[8]*other.m[2];

	values[3]=this.m[0]*other.m[3]+this.m[3]*other.m[4]+this.m[6]*other.m[5];
	values[4]=this.m[1]*other.m[3]+this.m[4]*other.m[4]+this.m[7]*other.m[5];
	values[5]=this.m[2]*other.m[3]+this.m[5]*other.m[4]+this.m[8]*other.m[5];

	values[6]=this.m[0]*other.m[6]+this.m[3]*other.m[7]+this.m[6]*other.m[8];
	values[7]=this.m[0]*other.m[6]+this.m[3]*other.m[7]+this.m[6]*other.m[8];
	values[8]=this.m[0]*other.m[6]+this.m[3]*other.m[7]+this.m[6]*other.m[8];

	return new Matrix3x3(values);
}

Matrix3x3.transMat=function(vec){
	let result=new Matrix3x3();
	result.m[2]=vec.x;
	result.m[5]=vec.y;

	return result;
}

Matrix3x3.scaleMat=function(vec){
	let result=new Matrix3x3();
	result.m[0]=vec.x;
	result.m[4]=vec.y;

	return result;
}

module.exports={
	Matrix3x3: Matrix3x3
}