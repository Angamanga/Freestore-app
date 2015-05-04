 var cloudinary = require('cloudinary'),
     bodyParser = require('body-parser'),
     fileParser = require('connect-multiparty')();  

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

module.exports = function (app, db) {

//definierar objekt för ny sak
var newThing={};
    
    app.get('/nysak', function (req, res) {
        res.render('newThing');
    });
    
    
function saveInfo(req,res){                
        cloudinary.uploader.upload(req.files.image.path, function (result) {
            if (result.url) {
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
                }
                res.redirect('/forhandsgranska');
            } 
            else {
                console.log('error uploading to cloudinary: ', result);
                res.send('did not get url');
            }
        });
    };
    
    app.post('/nysak', fileParser, function(req, res){
            saveInfo(req,res)
    });
    
    app.get('/forhandsgranska', function(req,res){
        res.render('preview', newThing);
        });
    
     app.get('/forhandsgranskaEdit',function(req,res){
        res.render('newThingEdit', newThing);
    });
    app.post('/forhandsgranskaEdit', fileParser, function(req,res){
        saveInfo(req, res);
    });
    
    app.get('/spara',function(req,res){
          //lägger objektet i databasen
        db.collection('things').insert(newThing, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
            //visar objektet
            var redirectUrl = '/sak/'+newThing._id;
            res.redirect(redirectUrl);
            }
        }); 
    });
};