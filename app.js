var express = require('express'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("./models/user");
    Comment = require("./models/comments");
    Event = require("./models/event");
const _ = require("passport-local-mongoose");
var app = express();
const path = require("path");

var mongodb= require('mongodb');

mongoose.connect("mongodb+srv://admin:admin@cluster0.1eloq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

conndb = mongoose.createConnection('mongodb+srv://admin:admin@cluster0.1eloq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(methodOverride('_method'))
 
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/static", express.static('./static/'));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.render("index");
});

app.get("/register", function (req, res) {
    if (req.isAuthenticated()) {
        return res.render("registererror")
    }
    res.render("register");
});
 
// Showing register error
app.get("/registererror", function (req, res) {
    res.render("registererror");
});

// Showing login error
app.get("/loginerror", function (req, res) {
    res.render("loginerror");
});

// Handling user signup
app.post("/register", function (req, res) {
    var username = req.body.username
    var password = req.body.password
    User.register(new User({ username: username }),
            password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("registererror");
        }
 
        passport.authenticate("local")(
            req, res, function () {
            res.render("index");
        });
    });
});
 
//Showing login form
app.get("/login", function (req, res) {
    if (req.isAuthenticated()) {
        return res.render("loginerror")
    }
    res.render("login");
});

app.get("/profile", isLoggedIn, function (req,res) {
    username = req.user.username
    res.render("profile", {data: {username : username}});
});

app.get("/comments", isLoggedIn, function (req,res) {
    Comment.find((err, comments) => {
        console.log(comments)
        res.render("comments", {data: {comments:comments}});
    })
    
});

app.get("/aboutus", function (req,res) {
    res.render("aboutus")
});

app.get("/events", isLoggedIn, function (req,res) {
    Event.find((err, events) => {
        console.log(events)
        res.render("events", {data: {events:events}});
    })
});

app.post("/newevent", isLoggedIn, function (req,res) {
    res.render("newevent")
});

app.post("/addattendance/:id", isLoggedIn, function(req, res) {
    console.log(req.params.id)
    res.redirect("/")
})

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/userlist", isLoggedIn, function (req, res) {
    console.log(req.user.isAdmin)
    if (req.user.isAdmin != true) {
        res.render("error")
    } else {
        User.find((err,users) => {
            res.render("userlist", {data: {users:users}});
        })
        
    }
});

app.post("/addcomment", (req,res) => {
    Comment.create({
        username: req.user.username,
        user_id: req.user._id,
        comment: req.body.comment
    })
    res.redirect("comments")
});

app.post("/createevent", (req,res) => {
    Event.create({
        creator: req.user.username,
        location: req.body.eventlocation,
        name: req.body.eventname,
        about: req.body.eventdesc
    })
    res.redirect("events")
});


//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/loginerror"
}), function (req, res) {
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server Has Started!");
});