var bodyParser = require('body-parser');
var multer = require('multer');

module.exports = function(app,db){
    //definierar collection things
    
    var things = db.collection('things');
    //visar index när man gör en get av /
    app.get('/',function(req,res){
       res.render('index');
    });
    
    //visar newThing när man gör en get av /nysak
    app.get('/nysak',function(req,res){
        res.render('newThing');
    });

    //lägger till en ny sak i databasen när man gör en post på /nysak
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
                //visar saveSucess om allt funkar
            res.render('saveSucess',{thing:result}) 
            }
            });
    });
 
         app.get('/api/photo', function(req,res){
        res.render('testphoto');
    });
    app.post('/api/photo',function(req,res){
        if(done=true){
            console.dir(req.files);
            console.log(req.files);
            res.end("File uploaded");
        }
    });
    //visar allt innehåll i databasen
    app.get('/sak', function(req,res){
        
        things.find().toArray(function(err, result){
            if(err){
                res.send(err);
            }
            else{
                console.log(result);
                res.json(result);
            }
            });
    });
    
     
};