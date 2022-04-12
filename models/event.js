//adds requirements of mongoose
var mongoose=require("mongoose");
var { Schema } = mongoose;
//creates a new schema for creating objects in the database - takes the creator of the event, location, name, description, and people attending
var schema = new Schema({
    creator: String,
    location: String,
    name: String,
    about: String,
    attendees: Array
});


module.exports=mongoose.model("Event", schema);
