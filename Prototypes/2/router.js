function route(handle, pathname, response, request){
	
	console.log("about to route a request for " + pathname);

	if(typeof handle[pathname] === 'function'){
		return handle[pathname](response,request);
	}
	else{
		console.log("No request handler found for " + pathname);
		response.write("404 Not found");
		response.end;
	}
}

exports.route = route; 