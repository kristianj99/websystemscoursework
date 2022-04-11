var mongoose=require("mongoose");
var { Schema } = mongoose;
var schema = new Schema({
    username: String,
    userid: String,
    comment: String
});


module.exports=mongoose.model("Comment", schema);
