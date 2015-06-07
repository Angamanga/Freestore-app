var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {
    //visar förstasidan
    app.get('/', function (req, res) {
        res.render('index');
    });

    //visar de tre senast tillagda sakerna
    app.get('/latest', function (req, res) {
        db.collection('things').find().sort({
            time: -1
        }).limit(3).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

    //visar en sak
    app.get('/sak/:thing_id', function (req, res) {
        var thingID = ObjectID.createFromHexString(req.params.thing_id);
        db.collection('things').findOne({
            _id: thingID
        }, function (err, result) {
            res.send(result);
        });
    });

    //fritextsök
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
        };

        db.collection('things').find(searchObject).sort({
            time: -1
        }).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });
    //visar alla saker
    app.get('/sak', function (req, res) {
        db.collection('things').find().sort({
            time: -1
        }).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });
    //visar antal annonser per plats
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
            }
        });
    });
    //visar antal annonser per kategori
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
            }
        });
    });

    //visar saker i en saärskild kategori eller plats (beroende på vad klienten skickar med för information)
    app.post('/browseSearch', function (req, res) {
        var searchObject = {};

        searchObject[req.body.type] = req.body.searchFor;
        console.log(searchObject);

        db.collection('things').find(searchObject).sort({
            time: -1
        }).toArray(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    });

};