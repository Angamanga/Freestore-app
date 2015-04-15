//söksida/startsida

exports.search = function(){
	return '<form action="/search" method="post">'+
			'Sök'+
			'<input type = "text">'+
			'<input type = "submit" value="Sök">'+
			'<a href="/newThing">Lagg till ny</a>';



};
