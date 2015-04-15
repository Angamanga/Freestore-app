//dependencies
    var express = require('express');
    var ejs = require('ejs');
    var database = require('./config/database');
    var mongoose = require('mongoose');
    var routes = require('./app/routes');
    var bodyParser = require('body-parser');

//express
    var app = express();
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ 
        extended:true
    }));
//load database-config

mongoose.connect(database.url);
console.log(database.url);


//view engine = ejs
    app.set('view engine', 'ejs');

//routes

routes(app);
//startar servern
    app.listen(8080);
    console.log('server has started');