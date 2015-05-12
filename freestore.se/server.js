//dependencies
var express = require('express'),
    ejs = require('ejs'),
    database = require('./config/database'),
    basic = require('./app/routes/basic'),
    newThing = require('./app/routes/newThing'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    sessions = require('client-sessions'),
    bodyParser = require('body-parser');

//express
var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/app/views');
//view engine = ejs 
app.set('view engine', 'ejs');
app.use(bodyParser.json());


//startar databas
var MongoClient = mongodb.MongoClient;
MongoClient.connect(database.url, function (err, db) {
    if (err) {
        console.log('Unable to connect to mongoDB server.Error', err);
    } else {
        console.log('Connection established to ' + database.url);
        //laddar routes och skickar med databasen om anslutningen till databasen funkar
        basic(app, db);
        newThing(app, db);
    }
});


//startar servern
app.listen(8080);
console.log('server has started');