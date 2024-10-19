export default function updateObject<T extends {[key:string]:any}>(original:T,update:{[key:string]:any}):T{
	const updateObj:{[key:string]:any} = {};
	for(const [key,val] of Object.entries(update)){
		if(typeof val == "object" && val !== null && !Array.isArray(val)){
			if(typeof original[key] == "object")
				updateObj[key] = updateObject(original[key],val);
			else
				updateObj[key] = updateObject({},val);
		}else{
			updateObj[key] = val;
		}
	}
	const result = {...original,...updateObj};

	for(const [key,val] of Object.entries(result)){
		if(val === null)
			delete result[key];
	}
	
	return result;
}