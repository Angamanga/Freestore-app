//dependencies
var express = require('express');
var ejs = require('ejs');
var database = require('./config/database');
var routes = require('./app/routes');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var cloudinary = require('cloudinary');
var fileParser = require('connect-multiparty')();


//express
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//configure cloudinary
var cloudinaryCredentials = {
    cloud_name:'angamanga', 
    api_key:'579224836286857', 
    api_secret:'2a4eJXgPdjHSYtI1DRkvGIFq2c8'
};
cloudinary.config({
    cloud_name:cloudinaryCredentials.cloud_name,
    api_key:cloudinaryCredentials.api_key,
    api_secret:cloudinaryCredentials.api_secret
});




//database-config
//mongoose.connect(database.url);

var MongoClient = mongodb.MongoClient;
MongoClient.connect(database.url, function (err, db) {
    if (err) {
        console.log('Unable to connect to mongoDB server.Error', err);
    } else {
        console.log('Connection established to ' + database.url);
        routes(app, db); //laddar routes och skickar med databasen om anslutningen till
        //databasen funkar
    }
});

//view engine = ejs
app.set('view engine', 'ejs');


//startar servern
app.listen(8080);
console.log('server has started');