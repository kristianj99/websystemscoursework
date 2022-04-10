var express = require('express'),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');
    passportLocalMongoose =
        require("passport-local-mongoose"),
    User = require("./models/user");
const _ = require("passport-local-mongoose");
var app = express();
const path = require("path");

var mongodb= require('mongodb');

mongoose.connect("mongodb://localhost/websystemscoursework");

conndb = mongoose.createConnection('mongodb://localhost/websystemscoursework');


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