//packages required for site to run
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

//creates a mongoose connection to the mongodb atlas
mongoose.connect("mongodb+srv://admin:admin@cluster0.1eloq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

//creates a variable for creation a connection to the mongodb atlas
conndb = mongoose.createConnection('mongodb+srv://admin:admin@cluster0.1eloq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

//sets the app to use express as the engine
app.set("view engine", "ejs");
//tells the app to use bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
//tells the app to use methodoverride
app.use(methodOverride('_method'))
//tells the app to require using express
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
//initialises passport (used for user creation) 
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/static", express.static('./static/'));
app.use(express.static(path.join(__dirname, 'public')));

//loads the home page
app.get("/", function (req, res) {
    res.render("index");
});

//loads the page to register an account.
app.get("/register", function (req, res) {
    //if the user is already logged in, then the website sends a register error. otherwise, it sends the user to the register page
    if (req.isAuthenticated()) {
        return res.render("registererror")
    }
    res.render("register");
});
 
//shows register error
app.get("/registererror", function (req, res) {
    res.render("registererror");
});

//shows login error
app.get("/loginerror", function (req, res) {
    res.render("loginerror");
});

//handles the user registering an account
app.post("/register", function (req, res) {
    //takes the input of username and password from the user
    var username = req.body.username
    var password = req.body.password
    //creates an account for the user using the variables declared previously. if there is an error, the register error page is loaded.
    User.register(new User({ username: username }),
            password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("registererror");
        }
        //authenticates the user, then renders the homepage
        passport.authenticate("local")(
            req, res, function () {
            res.render("index");
        });
    });
});
 
//displays the login page
app.get("/login", function (req, res) {
    //checks to see if the user is already logged in. if they are, login error page is displayed. if not, the login page is displayed
    if (req.isAuthenticated()) {
        return res.render("loginerror")
    }
    res.render("login");
});

//loads the users profile
app.get("/profile", isLoggedIn, function (req,res) {
    //checks the users name, and displays it on the profile
    username = req.user.username
    res.render("profile", {data: {username : username}});
});

//loads the comments page
app.get("/comments", isLoggedIn, function (req,res) {
    //checks whether the user has admin status or not
    var adminstatus = req.user.isAdmin
    //finds all the comments in the database, and renders the comments page with them
    Comment.find((err, comments) => {
        res.render("comments", {data: {comments:comments, adminstatus:adminstatus}});
    })
    
});

app.post("/clearcomments", isLoggedIn, function(req, res) {
    Comment.remove(function (err) {
        console.log("worked")
    });
    res.redirect("comments")
})

//loads the about us page
app.get("/aboutus", function (req,res) {
    res.render("aboutus")
});

//loads the events page
app.get("/events", isLoggedIn, function (req,res) {
    //finds all the events in the database, and renders the page with them
    Event.find((err, events) => {
        res.render("events", {data: {events:events}});
    })
});

//loads the new event page
app.post("/newevent", isLoggedIn, function (req,res) {
    res.render("newevent")
});

//currently broken - plans to add attendance to an event, however id only returns id of first event currently
app.post("/addattendance/:id", isLoggedIn, function(req, res) {
    console.log(req.params.id)
    res.redirect("/")
})

//logs the user out of their account, then redirects them to the home page
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

//loads the user list page
app.get("/userlist", isLoggedIn, function (req, res) {
    //checks if the user is an admin or not. if not, it loads an error page. if they pass, the user list is rendered
    if (req.user.isAdmin != true) {
        res.render("error")
    } else {
        //finds all the users in the database and renders them with the page
        User.find((err,users) => {
            res.render("userlist", {data: {users:users}});
        })
        
    }
});

//creates a comment
app.post("/addcomment", (req,res) => {
    //takes the input from the comments page, and creates an object in the database for it. after, it redirects back to the comments page
    Comment.create({
        username: req.user.username,
        user_id: req.user._id,
        comment: req.body.comment
    })
    res.redirect("comments")
});

//creates an event
app.post("/createevent", (req,res) => {
    //takes the input from the create event page and creates an object in the database. after, it redirects to the events page
    Event.create({
        creator: req.user.username,
        location: req.body.eventlocation,
        name: req.body.eventname,
        about: req.body.eventdesc
    })
    res.redirect("events")
});


//handling user login
app.post("/login", passport.authenticate("local", {
    //if the user passes authentication, they are redirected to the home page. if they fail, they are sent to a login error page
    successRedirect: "/",
    failureRedirect: "/loginerror"
}), function (req, res) {
});

//checks to see if the user is logged in
function isLoggedIn(req, res, next) {
    //if they pass, they are sent to the page expected. if they fail, they are redirected to the login page
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

//logs in the console when the server has started
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server Has Started!");
});