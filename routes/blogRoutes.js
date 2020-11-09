const express = require("express");
const router = express.Router();
const blogController = require('../controllers/blogController')
require('dotenv').config();

//Routes....

//displaying all blogs on index page(home page) using GET method,
//which are stored in mongodb..
router.get("/blogs", blogController.blog_get_all)

//this is route to home(index page)
router.get("/", (req, res) => {
  res.redirect("/blogs");
});

//This is About route...
router.get("/about", blogController.blog_get_about);

//this is Create route...
router.get("/blogs/create", blogController.blog_get_create);

//this is Create post route, It'll 1st stored the data to mongodb using POST method.
router.post("/blogs",blogController.blog_post);

//PUT route is using to edit the content
router.put('/blogs/:id', blogController.blog_put);

// this is single blog page route pass through '/blogs/:id'...
router.get("/blogs/:slug", blogController.blog_get_id);

//this is Delete route
//it 1st delete the blog of that ID in mongodb . then,
//send the response in JSON format and redirect it to '/blogs' route.
router.delete("/blogs/:slug", blogController.blog_delete);

//GET route for editing the existing contents
router.get("/edit/:id", blogController.blog_get_edit_id);

//SEARCH ROUTES...
router.post('/search/',blogController.blog_post_search);

//router is exported to App.js.
module.exports = router;