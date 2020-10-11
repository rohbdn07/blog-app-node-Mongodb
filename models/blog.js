const mongoose = require("mongoose");
const slugify = require('slugify');
const {ObjectId}=mongoose.Schema.Types;
const User=require('./user');

//Schema represent the database's structure and it's contents.
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,

  },
  postedBy:{
    type:ObjectId,
    ref:'User'
  },
   
}, {
  timestamps: true,
});

//this will validate blogSchema before stores its data to database.
blogSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    })
    next()
  }
})

//inside mongoose.model('blog')=>'blog'represent the singular form of database.
//name(mongodb will search pular name of 'blog' in db)
//Afterward we can use variable name (Blog) anytime when we put, create,delete,update our db.
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;