var bodyParser = require('body-parser');

module.exports = function(app,db){
    
    var things = db.collection('things');
    
    app.get('/',function(req,res){
       res.render('index');
    });
    
    app.get('/nysak',function(req,res){
        res.render('newThing');
    });

    app.post('/nysak',function(req,res){
         var newThing = {
            title:req.body.title,
            description:req.body.description
        };
        things.insert(newThing, function(err, result){
            if(err){
                res.send(err);
            }
            else{
            res.render('saveSucess',{thing:result}) 
            }
            });
    });

    app.get('/sak', function(req,res){
        
        things.find().toArray(function(err, result){
            if(err){
                res.send(err);
            }
            else{
                res.json(result);
            }
            });
    });
        //Funkar inte...
    app.get('/sak/:thing_id', function(req,res){
        var findString = 'ObjectId("' + req.params.thing_id + '")';
        things.find({_id:findString}, function(err,result){
            if(err){
                res.send(err);
            }
            else{
                console.log(findString);
                res.json(result);      
            }
        });
    });
};