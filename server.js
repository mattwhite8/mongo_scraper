//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//Handlebars
var exphbs = require("express-handlebars");
//Require models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");
//Scraping tools
var request = require("request");
var cheerio = require("cheerio");
//Set mongoose to use ES6 promises
mongoose.Promise = Promise;

//Initialize express
var app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// BodyParser makes it possible for our server to interpret data sent to it.
// The code below is pretty standard.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var PORT = process.env.PORT || 3000;

//Make public a static dir
app.use(express.static("app"));

//DB config with mongoose
mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

db.on("error", function(err){
  console.log("Mongoose error: ", err);
});

db.once("open", function(){
  console.log("Mongoose connection successful");
});

app.get("/", function(req, res){
  Article.find({"favorite": false}, function(err, doc){
    var hbsobj = {
      articles: doc
    }
    console.log(hbsobj);
    res.render("index", hbsobj);
  });
});

app.get("/favorites", function(req, res){
  Article.find({"favorite": true}, function(err, doc){
    var hbsobj = {
      articles: doc
    }
    console.log(hbsobj);
    res.render("favorites", hbsobj);
  });
});

app.post("/favorite/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);

  Article.findOneAndUpdate({"_id":articleID}, {"favorite": true})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/unfavorite/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);

  Article.findOneAndUpdate({"_id":articleID}, {"favorite": false})
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.send(200);
    }
  })

});

app.post("/notes/:id", function(req, res){
  var articleID = req.params.id;
  var newNote = new Note({body: req.body.text});

  newNote.save(function(err, doc){
    if (err) {
      console.log(err);
    } else {
      Article.findOneAndUpdate({"_id":articleID}, {$push: {"notes": doc._id}})
      .exec(function(err, doc){
        if (err){
          console.log(err);
        }else {
          res.send(200);
        }
      });
    }
  });

});

app.get("/notes/:id", function(req, res){
  var articleID = req.params.id;
  console.log(articleID);
  Article.findOne({"_id":articleID})
  .populate("notes")
  .exec(function(err, doc){
    if(err){
      console.log(err);
    }else {
      res.json(doc);
    }
  })

});

// app.get("/populatetest", function(req, res){
//   Article.findOne({"title":"test"})
//   .populate("notes")
//   .exec(function(err, doc){
//     if(err){
//       console.log(err);
//     }else {
//       res.json(doc);
//     }
//   });
// });

app.post("/remove/:id", function(req, res){
  var _id = req.params.id;

  Note.remove({"_id":_id}, function(err){
    if(err){
      console.log(err);
    }else{
      res.send(200);
    }
  });
  
});

app.get("/scraper", function(req, res){
  //Have to get the body of the HTML with request
  request("https://theverge.com", function(err, response, html){
    //Load html into cheerio
    var $ = cheerio.load(html);
    //Grab every a with class mainLink
    $("h2[class=c-entry-box--compact__title]").each(function(i, element){

      //Empty result object
      var result = {};

      //Add title text and link
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var newArticle = new Article(result);

      newArticle.save(function(err, doc){
          if(err){
            console.log(err);
          }else {
            console.log(doc);
          }
      });

    });
  });
  res.send(200);
});

//Listen on PORT
app.listen(PORT, function(){
  console.log("App running on port " + PORT );
})
