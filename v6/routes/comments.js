var express = require("express")
var router = express.Router({mergeParams:true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")

// ================
// Comment routes
// ================

// Comments Form/ New
router.get('/new', isLoggedin, function(req,res){
    
    // found campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            
            res.render('comments/new', {campground:campground} )
        }
        
        
    })
    
})

// Comments Create
router.post('/', isLoggedin, function(req,res){
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


// middleware
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
    
}


module.exports = router 