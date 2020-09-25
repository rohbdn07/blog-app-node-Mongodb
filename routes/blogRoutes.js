const express = require('express');
const router = express.Router();
const Blog = require("../models/blog");


//Routes....

//displaying all blogs on index page(home page) using GET method,
//which are stored in mongodb..
router.get("/blogs", (req, res) => {
    Blog.find()
        .sort({
            createdAt: -1, //blog will display in decending order.
        })
        .then((data) => {
            res.render("index", {
                title: "All blogs",
                blogs: data,
            });
        })
        .catch((err) => {
            console.log("unable to get blogs", err);
            res.send("Opps! something went wrong", err);
        });
});

//this is route to home(index page)
router.get("/", (req, res) => {
    res.redirect("/blogs");
});

//This is About route...
router.get("/about", (req, res) => {
    res.render("about", {
        title: "About",
    });
});

//this is Create route...
router.get("/blogs/create", (req, res) => {
    res.render("create", {
        title: "Create",
    });
});

//this is Create post route, It'll 1st stored the data to mongodb using POST method.
router.post("/blogs", (req, res) => {
    // console.log(req.body)
    const blog = new Blog(req.body);
    blog
        .save()
        .then(() => {
            console.log(" Your post is stored in db");
            res.redirect("/blogs");
        })
        .catch((err) => {
            console.log(err);
        });
});


// this is single blog page route pass through '/blogs/:id'...
router.get("/blogs/:id", (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then((data) => {
            res.render("details", {
                title: "Blog details",
                blog: data,
            });
        })
        .catch((err) => console.log(err));
});

//this is Delete route
//it 1st delete the blog of that ID in mongodb . then,
//send the response in JSON format and redirect it to '/blogs' route.
router.delete("/blogs/:id", (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(() => {
            res.json({
                redirect: "/blogs"
            });
        })
        .catch((err) => console.log(err));
});

//router is exported to App.js.
module.exports = router;