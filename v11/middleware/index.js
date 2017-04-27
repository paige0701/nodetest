var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj = {}


// middleware
middlewareObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    // is user is logged inㅣㄴ
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect('back')
                
            }else{
                // does user own post ?
                if(foundCampground.author.id.equals(req.user._id)) {
                    next()
                }else{
                    res.redirect('back')
                }
            }
        })
    }else{
        // console.log('need to be logged in')
        res.redirect("back")
    }    
}



middlewareObj.checkCammentOwnership = function(req,res,next){
    // is user is logged inㅣㄴ
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back')
                
            }else{
                // does user own post ?
                if(foundComment.author.id.equals(req.user._id)) {
                    next()
                }else{
                    res.redirect('back')
                }
            }
        })
    }else{
        // console.log('need to be logged in')
        res.redirect("back")
    }    
}


module.exports = middlewareObj;