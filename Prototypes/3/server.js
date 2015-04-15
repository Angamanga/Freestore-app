//dependencies
    var express = require('express');
    var ejs = require('ejs');
    var search = require('./views/search');
    var newThing = require('./views/newThing');
   
//express
    var app = express();

//view engine = ejs
    app.set('view engine', 'ejs');

//routes

    app.get('/',function (req, res) {
	   res.render('index', {thing:search.search()});
        })

    app.get('/newThing',function(req,res){
	   res.render('index',{thing:newThing.newThing()});
    })

    app.use(express.static('public'));



//startar servern
    app.listen(8080);
    console.log('server started at 8080');
