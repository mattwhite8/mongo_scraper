//Mongoose
var mongoose = require("mongoose");
//Schema class
var Schema = mongoose.Schema;

//Create Schema
var NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

//Create model with Schema
var Note = mongoose.model("Note", NoteSchema);

module.export = Note;
