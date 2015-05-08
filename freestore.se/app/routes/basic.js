var BSON = require('mongodb').BSONPure,
    ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

    app.get('/', function (req, res) {
        res.render('index');
    });
    app.get('/test', function (req, res) {
        res.render('imgtest');
    });
    //visar alla saker
    app.get('/sak', function (req, res) {
        db.collection('things').find().toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                console.log(result);
                res.json(result);
            }
        });
    });
    //visar de tre senast tillagda sakerna
    app.get('/latest', function (req, res) {
        db.collection('things').find().sort({
            time: -1
        }).limit(3).toArray(function (err, result) {
            if (err) {
                res.sent(err);
            } else {
                console.log(result);
                res.json(result);
            }
        })
    });



    //visar en sak
    app.get('/sak/:thing_id', function (req, res) {
        var thingID = ObjectID.createFromHexString(req.params.thing_id);
        db.collection('things').findOne({
            _id: thingID
        }, function (err, result) {
            res.render('thing', result);
        });
    });





}