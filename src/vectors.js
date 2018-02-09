function Vec2(x, y){
	this.x=x;
	this.y=y;
}

Vec2.prototype.toArray=function(){
	return [x, y];
};

Vec2.prototype.add=function(other){
	return new Vec2(this.x+other.x, this.y+other.y);
};

Vec2.prototype.sub=function(other){
	return new Vec2(this.x-other.x, this.y-other.y);
};

Vec2.prototype.dot=function(other){
	return this.x*other.x+this.y*other.y;
};

module.exports={
	Vec2: Vec2
};