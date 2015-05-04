var bodyParser = require('body-parser'),
    BSON = require('mongodb').BSONPure,
    ObjectID = require('mongodb').ObjectID,
    sessions = require('client-sessions');

module.exports = function (app, db) {









    app.get('/login', function (req, res) {
        console.log(sess);
    });
};