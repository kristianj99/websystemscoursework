var mongoose=require("mongoose");
var { Schema } = mongoose;
var schema = new Schema({
    creator: String,
    location: String,
    name: String,
    about: String,
    attendees: [{username: String}]
});


module.exports=mongoose.model("Event", schema);
