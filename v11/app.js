var express         = require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    seedsDB         = require("./seeds"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    multer          = require('multer');
 
 
// requiring routes   
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")





// this will create yelp_camp db in mongodb
mongoose.connect("mongodb://localhost/yelp_camp_v9")
// mongoose.connect("mongodb://localhost/my_friends")
// yelp_Camp, my_friends is the name of the database ...
// if there is a database called my_friends, it will add to that, if there isnt one, it will make a database with that name
// how this is used is in the terminal type mongo..
// in the mongo terminal type show dbs and it will show all the databases you have
// if you want to connect to one of the data type
// use my_friends
// than 
// show dbs


// telling the app to use the body parser that we have installed.
app.use(bodyParser.urlencoded({extended:true}));

// Using the method override
app.use(methodOverride("_method"));

// setting the view engine to ejs so we dont have to write extension every time we call the view page
app.set("view engine", "ejs");

// Use flash
app.use(flash());

app.use(express.static(__dirname + "/public"));


// seedsDB();



// ------ Passport configuration -------- //
app.use(require("express-session")({
    secret:'Rusty is the prettiest dog',
    resave: false,
    saveUninitialized :false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for every single routes !!
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});


// // using multer
// var Storage = multer.diskStorage({
//      destination: function(req, file, callback) {
//          callback(null, "./Images");
//      },
//      filename: function(req, file, callback) {
//          callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
//      }
//  });


// telling app to use these routes
app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("The YelpCamp Server has started !! ");
    
});