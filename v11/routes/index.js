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
    res.render('register', {page: 'register'})
})


// Register
router.post('/register', function(req,res){
    // .register is provided by passport-local-mongoose
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        // if(error){
        //     console.log(error);
        //     req.flash('error', error.message);
        //     return res.render('register');
        // }
        if(error){
            console.log(error);
            return res.render("register", {error: error.message});
            }
        
        // log them in
        passport.authenticate("local")(req,res,function(){
            req.flash('success','Welcome ! '+user.username)
            res.redirect('/campgrounds');
        })
    })
})


// Login form
router.get('/login', function(req,res){
    res.render('login', {page: 'login'})
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
    req.flash('success','logged you out');
    res.redirect('/campgrounds')
})



module.exports = router