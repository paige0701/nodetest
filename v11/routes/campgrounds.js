var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")
var multer = require("multer")
var upload = multer({ dest: 'uploads/' })

// fs is for moving uploaded files
var fs = require("fs")

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now())
//   }
// })
 
// var upload = multer({ storage: storage })

// INDEX  --- show all campgrounds
router.get('/', function(req,res){
        
        Campground.find({
            
        }, function(err,camp){
            if(err){
                console.log(err)
            }else{
                // console.log("it works !")
                // console.log(camp)
                 // {data name (anything you want - what you are going to use in the template !!) : data that we are passing in }
                // res.render('campgrounds', {campgrounds:campgrounds})
                
                res.render('campgrounds/index', {campgrounds:camp, page:'magenetica'})
            }
        })

})


// CREATE -- add new campground to DB
// same name but different method ! 
router.post('/', middleware.isLoggedin,upload.array('image'), function(req, res){
  
   
    // get data from form and add to array
    var upFile = req.files;
    var name = req.body.name;
    var original_name = upFile[0].originalname;
    var saved_name = upFile[0].filename;
    var price = req.body.price
    var desc = req.body.description
    var author = {
        id : req.user._id,
        username : req.user.username
        
    }
    // 
    var tmp_path = upFile[0].path;
    console.log("tmp_path== ",tmp_path)
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = 'public/images/' + saved_name+".jpg";
    
    saved_name=saved_name+'.jpg'
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        
        fs.unlink(tmp_path, function() {
            if (err) throw err;
            // res.send('File uploaded to: ' + target_path + ' - ' + upFile[0].size + ' bytes');
        });
    });
    
    
    

    var newCampground = {name:name, description:desc, author:author, price:price, original_name:original_name,saved_name:saved_name}
    
    console.log("this one == ? ", req.user)
    // campgrounds.push(newCampground)
    // redirect to campgrounds page
    
    // 여기서 해야 하는 것 은 사람들이 새로운 것 을 입력 했을 때 
    // 받아 와서 디비에 저장 한다 !!
    

    Campground.create(newCampground, function(err, camp){
        if(err){
            
            console.log("err === ",err)
        }else{
            console.log(camp)
            res.redirect('/campgrounds')
        }
    })
    
    // res.redirect('/campgrounds')
    
})


//NEW -- form for adding new campground
router.get('/new',middleware.isLoggedin, function(req,res){
    res.render('campgrounds/new')
    
})


// SHOW -- 
router.get('/:id', function(req,res){
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



// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campgrounds:foundCampground})
    });
});


// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership,function(req,res){
    
    // find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCamp){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
    
    //redirect somewhere
})

// DESTROY Campground !!
router.delete('/:id', middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err, camp){
        if(err){
            res.redirect('/campgrounds')
        }else{
            res.redirect('/campgrounds')
        }
    })
})








module.exports = router