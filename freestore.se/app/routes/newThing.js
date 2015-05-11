 var cloudinary = require('cloudinary'),
     cloudinaryConfig = require('../../config/cloudinary'),
     bodyParser = require('body-parser'),
     fileParser = require('connect-multiparty')();

 module.exports = function (app, db) {

     //definierar objekt för ny sak
     var newThing;

  app.get('/nysak', function (req, res) {
 res.render('newThing');
     });

     function saveInfo(req, res) {
         cloudinary.config(cloudinaryConfig.cloudinaryCredentials);
         
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
             } else {
                 console.log('error uploading to cloudinary: ', result);
                 res.send('did not get url');
             }
         });
     };

    
     app.post('/nysak', fileParser, function (req, res) {
         saveInfo(req, res)
     });

     app.get('/forhandsgranska', function (req, res) {
         res.render('preview');
         });
     
     app.get('/newthing', function(req,res){
         console.log(newThing);
         res.json(newThing);
     });

     app.get('/forhandsgranskaEdit', function (req, res) {
         res.render('newThingEdit', newThing);
     });
     app.post('/forhandsgranskaEdit', fileParser, function (req, res) {
         saveInfo(req, res);
     });

     app.post('/spara', function (req, res) {
         //lägger objektet i databasen
       newThing=req.body;
         
         db.collection('things').insert(newThing, function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 //visar objektet
                 var redirectUrl = '/sak/' + newThing._id;
                 res.redirect(redirectUrl);
             }
         });
     });
 };