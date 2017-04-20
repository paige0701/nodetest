var express = require("express")
var router = express.Router()
var User = require("../models/user")
var passport = require("passport")


// ------ Route -------- //

// Root route
router.get('/', function(req, res){
    
    res.render('landing')
})


// ------ Auth routes -------- //

// Register Form
router.get('/register', function(req,res){
    res.render('register')
})


// Register
router.post('/register', function(req,res){
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


// Login form
router.get('/login', function(req,res){
    res.render('login')
})


// Login 
// app.post('/login', middleware, callback)
router.post('/login', passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"    
    }), function(req,res){
    
})


// Log out 
router.get('/logout', function(req, res){
    
    console.log("logging out!!")
    req.logout();
    res.redirect('/campgrounds')
})



// Middleware
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}


module.exports = router