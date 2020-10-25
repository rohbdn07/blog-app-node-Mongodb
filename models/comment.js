const mongoose = require("mongoose");
const slugify = require('slugify');
 //Schema represent the database's structure and it's contents.
const Schema = mongoose.Schema;

const comment_schema=new Schema({
    name:{
        type:String,
        required:"Username is required"
    },
    content:{
        type:String,
        required:"comment is required"
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    }
})

const Comment=mongoose.model("Comment", comment_schema);

module.exports=Comment;
