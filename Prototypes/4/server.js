//dependencies
    var express = require('express');
    var ejs = require('ejs');
    var database = require('./config/database');
//    var mongoose = require('mongoose');
    var routes = require('./app/routes');
    var bodyParser = require('body-parser');
    var mongodb = require('mongodb');

//express
    var app = express();
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ 
        extended:true
    }));
//load database-config

    //mongoose.connect(database.url);

var MongoClient = mongodb.MongoClient;
    MongoClient.connect(database.url,function(err,db){
        if(err){
            console.log('Unable to connect to mongoDB server.Error',err);
        }
        else{
            console.log('Connection established to ' + database.url);
            routes(app,db);
        }
    });

//view engine = ejs
    app.set('view engine', 'ejs');


//startar servern
    app.listen(8080);
    console.log('server has started');