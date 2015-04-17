//dependencies
    var express = require('express');
    var ejs = require('ejs');
    var database = require('./config/database');                
    var routes = require('./app/routes');
    var bodyParser = require('body-parser');
    var mongodb = require('mongodb');
    var multer = require('multer');


//express
    var app = express();
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ 
        extended:true
    }));

//configure multer
app.use(multer({dest:'./public/uploads/',
                rename:function(fieldname,filename){
                    console.log(fieldname);
                    console.log(filename);
                    return filename+Date.now();
                },
                onFileUploadStart:function(file){
                    console.log(file.originalname + 'is starting ...')
                },
                onFileUploadComplete:function(file){
                    console.log(file.fieldname + 'upladed to ' + file.path)
                    done=true;
                }
               }));

  
                    
                    
                    
//database-config
    //mongoose.connect(database.url);

    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(database.url,function(err,db){
        if(err){
            console.log('Unable to connect to mongoDB server.Error',err);
        }
        else{
            console.log('Connection established to ' + database.url);
            routes(app,db); //laddar routes och skickar med databasen om anslutningen till
                            //databasen funkar
        }
    });

//view engine = ejs
    app.set('view engine', 'ejs');


//startar servern
    app.listen(8080);
    console.log('server has started');