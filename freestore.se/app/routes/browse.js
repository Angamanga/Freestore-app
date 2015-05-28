 var bodyParser = require('body-parser');
 module.exports = function (app, db) {


     app.get('/sak', function (req, res) {
         db.collection('things').find().sort({
             time: -1
         }).toArray(function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 console.log(result);
                 res.json(result);
             }
         });
     });

     app.get('/location', function (req, res) {
         db.collection('things').aggregate([{
             $group: {
                 _id: "$location",
                 count: {
                     $sum: 1
                 }
             }
        }]).toArray(function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 res.send(result);
                 console.log(result);
             }
         })
     });

     app.get('/category', function (req, res) {
         db.collection('things').aggregate([{
             $group: {
                 _id: "$category",
                 count: {
                     $sum: 1
                 }
             }
        }]).toArray(function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 res.send(result);
                 console.log(result);
             }
         });
     });

     app.get('/category/:categoryId', function (req, res) {
         db.collection('things').aggregate([{
             $group: {
                 _id: "$category",
                 count: {
                     $sum: 1
                 }
             }
        }]).toArray(function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 res.send(result);
                 console.log(result);
             }
         });
     });

     app.post('/browseSearch', function (req, res) {
         var searchObject = {};
         searchObject[req.body.type] = req.body.searchFor;

         db.collection('things').find(searchObject).sort({
             time: -1
         }).toArray(function (err, result) {
             if (err) {
                 res.send(err);
             } else {
                 console.log(result);
                 res.json(result);
             }
         })
     });




 }