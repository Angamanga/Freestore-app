var BSON = require('mongodb').BSONPure,
    ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

    app.get('/', function (req, res) {
        res.render('../../public/views/index');
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
            res.send(result);
        })
    });

    app.post('/search', function (req, res) {
        var searchText = req.body.searchText;
        var searchObject = {
            $or: [{
                title: {
                    $regex: searchText,
                    $options: 'igm'
                }
            }, {
                description: {
                    $regex: searchText,
                    $options: 'igm'
                }
            }]
        }

        db.collection('things').find(searchObject).sort({
            time: -1
        }).toArray(function (err, result) {
            if (err) {
                res.sent(err);
            } else {
                res.json(result);
            }
        })
    });


};