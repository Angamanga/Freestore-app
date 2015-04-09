var express = require('express');
var ejs = require('ejs');

var app = express();

app.set('view engine', 'ejs');


app.get('/',function (req, res) {
	res.render('index', {title:"sök efter en sak"});


})


app.listen(8080);
