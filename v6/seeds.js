var moongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")
var data = [
    {
        name:"Clouds nest",
        image :"http://photosforclass.com/download/32901504016",
        description:"Largest nest in the US"
        
    },
    {
        name:"Canyan Crest",
        image :"http://photosforclass.com/download/8240036928",
        description:"Cheapest Campsite"
        
    },
    {
        name:"Mays nest",
        image :"http://photosforclass.com/download/5822548113",
        description:"Amazing view lies..... "
        
    }]


function seedDB(){
    
    // remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        }else{
            console.log("Removed campgroudns ! ")
            // add new campgrounds
            // data.forEach(function(seed){
            //     Campground.create(seed, function(err,data){
            //         if(err){
            //             console.log(err)
            //         }else{
            //             console.log("added data")
            //             //create comments
            //             Comment.create({
            //                 text:"This place is alright",
            //                 author : "John Smith"
            //             }, function(err, comment){
            //                 if(err){
            //                     console.log(err)
            //                 }else{
                                
            //                     data.comments.push(comment);
            //                     data.save();
            //                     console.log("wrote comments")
            //                 }
                            
            //             })
            //         }
                    
            //     })
            //  })
             
            
        }
    });
    
    
}

module.exports = seedDB;



