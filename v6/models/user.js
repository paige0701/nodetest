var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username : String,
    password : String
    
})


UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)


// this is compiling in to a model 
// var Campground = mongoose.model("Campground", campground_schema )
// what this does is  that make a model that has a sturcture of the top schema..
// like a friends_Schema that must have name and age with that data type
// interesting thing is that even if we use the name Person in mongodb it will autometically change to 
// plural so the model name will be people !! how cool
// i think this is because there will be more than one person so it autometically changes to a plural version of or model name
// var Person = mongoose.model("Person", friends_schema)
