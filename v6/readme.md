RESTFUL routes

name        url         verb        desc
=================================================================
INDEX       /dogs       GET         Display a list of all dogs
NEW         /dogs/new   GET         Display a form to make a new dogs
CREATE      /dogs       POST        Add new dog to DB
SHOW        /dogs/:id   GET         Display one specific dog

INDEX       /campgrounds
NEW         /campgrounds/new
CREATE      /campgrounds
SHOW        /campgrounds/:id

NEW         /campgrounds/:id/comments/new       GET
CREATE      /campgrounds/:id/comments           POST