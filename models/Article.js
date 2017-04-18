//Mongoose
var mongoose = require("mongoose");
//Schema class
var Schema = mongoose.Schema;

//Create Schema
var ArticleSchema = new Schema({
  //Both are required
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//Create model with schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
