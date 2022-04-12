//adds requirements of mongoose
var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
//creates a schema for the user - name, password, events signed up to, as well as an admin check
var UserSchema=mongoose.Schema({
username: String,
Password: String,
myevents: Array,
isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User", UserSchema);
