var delimeter=".";

var setObjProp=function(obj, names, value){
	let result=null;

	if(names.length==1){
		obj[names[0]]=value;
		result=obj;
	}else {
		if (obj.hasOwnProperty(names[0])){
			obj[names[0]]={};
		}
		result=setObjProp(obj[names[0]], names.shift(), value);
	}

	return result;
};

var get=function(){
	let result={};
	let tokens=document.cookie.split(";");
	tokens.forEach(function(t){

		let foo=t.split(delimeter);
	});

	return result;
};

var getValue

module.exports={
	delimeter: delimeter,
	get: get
};