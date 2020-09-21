const mongoose = require('mongoose')

//Schema represent the database's structure and it's contents.
const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


//inside mongoose.model('blog')=>'blog'represent the singular form of database.
//name(mongodb will search pular name of 'blog' in db)
//Afterward we can use variable name (Blog) anytime when we put, create,delete,update our db.
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog;