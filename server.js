//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//Require models
var Article = require("./models/Article.js");
//Scraping tools
var request = require("request");
var cheerio = require("cheerio");
//Set mongoose to use ES6 promises
mongoose.Promise = Promise;

//Initialize express
var app = express();

//Use morgan and body parser with the app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//Make public a static dir
app.use(express.static("public"));

//DB config with mongoose
mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

db.on("error", function(err){
  console.log("Mongoose error: ", err);
});

db.once("open", function(){
  console.log("Mongoose connection successful");
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
  res.send('done');
});

//Listen on PORT
app.listen(3000, function(){
  console.log("App running on port 3000");
})