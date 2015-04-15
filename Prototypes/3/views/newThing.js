//exporterar html-string for ny sak

exports.newThing = function(){
		return '<form action="/search" method="post">'+
			'<div>'+
			'Lägg till ny sak att ge bort'+
			'</div>'+
			'<div>'+
			'Titel:<input type = "text">'+
			'</div>'+
			'<div>'+
			'Kategori:<input type = "text">'+
			'</div>'+
			'<div>'+
			'Text:<textarea rows="30" cols="30">'+
			'</textarea>'+
			'</div>'+
			'<div>'+
			'<input type = "submit" value="Förhandsgranska">'+
			'</div>'+
			'</form>'+
			'<a href="/">Tillbaka till sök</a>';

};