var express = require('express');
var ejs = require('ejs');
var search = require('./views/search');
var newThing = require('./views/newThing');
var app = express();


app.set('view engine', 'ejs');
app.get('/',function (req, res) {
	res.render('index', {thing:search.search()});
})
app.get('/newThing',function(req,res){
	res.render('index',{thing:newThing.newThing()});


})

app.use(express.static('public'));




app.listen(8080);
