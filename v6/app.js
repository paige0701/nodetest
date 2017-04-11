var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var mongoose = require("mongoose")
var seedsDB = require("./seeds")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/user")



// this will create yelp_camp db in mongodb
mongoose.connect("mongodb://localhost/yelp_camp_v6")
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
app.use(bodyParser.urlencoded({extended:true}))



// setting the view engine to ejs so we dont have to write extension every time we call the view page
app.set("view engine", "ejs")


app.use(express.static(__dirname + "/public"))
console.log(__dirname)

seedsDB();

// this is compiling in to a model 
// var Campground = mongoose.model("Campground", campground_schema )
// what this does is  that make a model that has a sturcture of the top schema..
// like a friends_Schema that must have name and age with that data type
// interesting thing is that even if we use the name Person in mongodb it will autometically change to 
// plural so the model name will be people !! how cool
// i think this is because there will be more than one person so it autometically changes to a plural version of or model name
// var Person = mongoose.model("Person", friends_schema)


// ------ Passport configuration -------- //
app.use(require("express-session")({
    secret:'Rusty is the prettiest dog',
    resave: false,
    saveUninitialized :false
}))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// middleware for every single routes !!
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
    
})

// ------ Route -------- //


app.get('/', function(req, res){
    
    res.render('landing')
})


// INDEX  --- show all campgrounds
app.get('/campgrounds', function(req,res){
        
        Campground.find({
            
            
        }, function(err,camp){
            if(err){
                console.log(err)
            }else{
                console.log("it works !")
                console.log(camp)
                 // {data name (anything you want - what you are going to use in the template !!) : data that we are passing in }
                // res.render('campgrounds', {campgrounds:campgrounds})
                
                res.render('campgrounds/index', {campgrounds:camp})
            }
        })
        
        
       
})


// CREATE -- add new campground to DB
// same name but different method ! 
app.post('/campgrounds', function(req, res){
   
    // get data from form and add to array
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    
    // 
    var newCampground = {name:name, image:image, description:desc}
    // campgrounds.push(newCampground)
    // redirect to campgrounds page
    
    // 여기서 해야 하는 것 은 사람들이 새로운 것 을 입력 했을 때 
    // 받아 와서 디비에 저장 한다 !!
    
    Campground.create(newCampground, function(err, camp){
        if(err){
            
            console.log(err)
        }else{
            res.redirect('/index')
        }
    })
    
    // res.redirect('/campgrounds')
    
})


//NEW -- form for adding new campground
app.get('/campgrounds/new', function(req,res){
    res.render('campgrounds/new')
    
})


// SHOW -- 
app.get('/campgrounds/:id', function(req,res){
    // res.send("THis will be the details")
    var id = req.params.id;
    
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundOne){
      if(err){
          console.log(err)
      }else{
         console.log(foundOne)
        res.render('campgrounds/show',{campground:foundOne})      
      }
        
    })
    
})


// ================
// Comment routes
// ================

app.get('/campgrounds/:id/comments/new', isLoggedin, function(req,res){
    
    // found campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            
            res.render('comments/new', {campground:campground} )
        }
        
        
    })
    
})


app.post('/campgrounds/:id/comments', isLoggedin, function(req,res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        }else{
            // create new connect
            console.log(req.body.comment['text'])
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                     // connect comment and campground
                     console.log(comment)
                     campground.comments.push(comment);
                     campground.save();
                      //redirect campground showpage
                     res.redirect('/campgrounds/'+ campground._id)
                }
                
            })
        }
    })
   
})


// ------ Auth routes -------- //
app.get('/register', function(req,res){
    res.render('register')
})

app.post('/register', function(req,res){
    // .register is provided by passport-local-mongoose
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        if(error){
            console.log(error)
            return res.render('register')
        }
        
        // log them in
        passport.authenticate("local")(req,res,function(){
            res.redirect('/campgrounds')
        })
        
        
    })
    
    
})

app.get('/login', function(req,res){
    res.render('login')
})

// app.post('/login', middleware, callback)
app.post('/login', passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"    
    }), function(req,res){
    
})

app.get('/logout', function(res,req){
    req.logout();
    res.redirect('/campgrounds')
})


function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
    
}


app.listen(process.env.PORT, process.env.IP, function(){
    
    console.log("The YelpCamp Server has started !! ");
    
})