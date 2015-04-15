var Thing = require('./model/thing');
var bodyParser = require('body-parser');
//var index = require('./views/index');
module.exports = function(app){
    
    app.get('/',function(req,res){
       res.render('index');
    });
    
    app.get('/nysak',function(req,res){
        res.render('newThing');
    });
    app.post('/nysak',function(req,res){
        var titel = req.body.title;
        var beskrivning = req.body.description;
        console.log("titeln ar: " + titel + "och beskrivningen ar: " + beskrivning);
        res.end('yes');
    
    });
        
    app.get('/sak/:thing_id', function(req,res){
        //to be implemented
    });
    
   
};