//adds requirements of mongoose
var mongoose=require("mongoose");
var { Schema } = mongoose;
//creates a new schema for creating objects in the database - takes the username, id of the user, and their comment
var schema = new Schema({
    username: String,
    userid: String,
    comment: String
});


module.exports=mongoose.model("Comment", schema);
