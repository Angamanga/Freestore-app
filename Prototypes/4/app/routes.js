var bodyParser = require('body-parser'),
    cloudinary = require('cloudinary');
var fileParser = require('connect-multiparty')();
var BSON = require('mongodb').BSONPure;
var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

    //definierar collection things
    var things = db.collection('things');
    
    //definierar nysakobjekt
    var newThing={};
    //konfigurerar cloudinary //configure cloudinary
    var cloudinaryCredentials = {
        cloud_name: 'angamanga',
        api_key: '579224836286857',
        api_secret: '2a4eJXgPdjHSYtI1DRkvGIFq2c8'
    };

    cloudinary.config({
        cloud_name: cloudinaryCredentials.cloud_name,
        api_key: cloudinaryCredentials.api_key,
        api_secret: cloudinaryCredentials.api_secret
    });


    //visar index när man gör en get av /
    app.get('/', function (req, res) {
        res.render('index');
    });

    //visar newThing när man gör en get av /nysak
    app.get('/nysak', function (req, res) {
        res.render('newThing');
    });

    //lägger till en ny sak i databasen när man gör en post på /nysak
    app.post('/nysak', fileParser, function (req, res) {

        //läser först in bild
        var imageFile = req.files.image;
        
        cloudinary.uploader.upload(imageFile.path, function (result) {
            if (result.url) {
                //skapar ett objekt 
                newThing = {
                    title: req.body.title,
                    category: req.body.category,
                    description: req.body.description,
                    contact: {
                        telephone: req.body.telephone,
                        email: req.body.email
                    },
                    time: Date.now(),
                    location: req.body.location,
                    photopath: result.url
                };
                res.redirect('/forhandsgranska');
            } else {
                console.log('error uploading to cloudinary: ', result);
                res.send('did not get url');
            }
        });
    });
    
    app.get('/forhandsgranska', function(req,res){
        res.render('saveSucess', newThing);
        });
              
    app.get('/forhandsgranskaEdit',function(req,res){
        res.render('newThingEdit',newThing);
    });
    app.get('/spara',function(req,res){
          //lägger objektet i databasen
          things.insert(newThing, function (err, result) {
                       if (err) {
                          res.send(err);
                                } else {
                            //visar objektet
                                    var redirectUrl = '/sak/'+newThing._id;
                                    res.redirect(redirectUrl);
                                }
                }); 
      
       
         });
    
    
    //visar allt innehåll i databasen
    app.get('/sak', function (req, res) {

        things.find().toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                res.json(result);
            }
        });
    });
    
    app.get('/sak/:thing_id', function(req,res){
       
        var thingID=ObjectID.createFromHexString(req.params.thing_id);
        console.log('thingID:'+thingID);
        things.findOne({_id:thingID},function(err, document){
       res.render('thing',document);
      });
       

        });};