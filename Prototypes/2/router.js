function route(handle, pathname){
	
	console.log("about to route a request for " + pathname);
	console.log("handle= " + handle);
	if(typeof handle[pathname] === 'function'){
		return handle[pathname]();
	}
	else{
		console.log("No request handler found for " + pathname);
		return "404 Not found";
	}
}

exports.route = route; 