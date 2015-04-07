var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DataProvider = function(host, port) {
  this.db= new Db('node-mongo-thing', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


DataProvider.prototype.getCollection= function(callback) {
  this.db.collection('things', function(error, thing_collection) {
    if( error ) callback(error);
    else callback(null, thing_collection);
  });
};

//find all things
DataProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, thing_collection) {
      if( error ) callback(error)
      else {
        thing_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new thing
DataProvider.prototype.save = function(things, callback) {
    this.getCollection(function(error, thing_collection) {
      if( error ) callback(error)
      else {
        if( typeof(things.length)=="undefined")
          things = [things];

        for( var i =0;i< things.length;i++ ) {
          thing = things[i];
          thing.created_at = new Date();
        }

        thing_collection.insert(things, function() {
          callback(null, things);
        });
      }
    });
};

exports.DataProvider = DataProvider;