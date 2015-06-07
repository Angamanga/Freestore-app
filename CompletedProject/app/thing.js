 var ObjectID = require('mongodb').ObjectID;

 module.exports = function (app, db) {
     //sparar sak i databasen
     app.post('/spara', function (req, res) {
         //lägger objektet i databasen
         var newThing = req.body;
         db.collection('things').insert(newThing, function (err, result) {
             if (err) {
                 res.send(err);
             } else {

                 res.send(newThing._id);
             }
         });
     });

     //tar bort sak ur databasen
     app.delete('/sak/:thing_id', function (req, res) {
         var thing_id = ObjectID.createFromHexString(req.params.thing_id);
         db.collection('things').remove({
             _id: thing_id
         }, function (err, doc) {
             res.send(doc);
         });
     });

     //ändrar sak i databasen
     app.put('/sak/:thing_id', function (req, res) {

         var thing_id = ObjectID.createFromHexString(req.params.thing_id);

         db.collection('things').update({
                 _id: thing_id
             }, {
                 $set: req.body

             },
             function (err, doc) {
                 res.send(thing_id);
             });
     });


 };