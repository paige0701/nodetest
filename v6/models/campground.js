var mongoose = require("mongoose")

// schema set up
var campground_schema = new mongoose.Schema({
    name:String,
    image: String,
    description:String,
    author : {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username : String
        
    },
    comments : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
        ]
});

module.exports = mongoose.model("Campground", campground_schema )
