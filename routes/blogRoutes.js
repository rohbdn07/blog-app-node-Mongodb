const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const checkLoginUser = require('../AuthMiddleware/Auth');
const User = require("../models/user");
require('dotenv').config();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

//Routes....

//displaying all blogs on index page(home page) using GET method,
//which are stored in mongodb..
router.get("/blogs", (req, res) => {
  const loginUser = localStorage.getItem('loginUser');
  console.log(loginUser)
  Blog.find()
    .sort({
      createdAt: 'desc', //blog will display in decending order.
    })
    .then((data) => {
      res.render("index", {
        title: "All blogs",
        blogs: data,
        loginUser: loginUser,

      });
      console.log('logged as:' + loginUser);

    })
    .catch((err) => {
      console.log("unable to get blogs", err);
      res.send("Opps! something went wrong", err);
    });
});

//Upload the image/file path....
router.post("/blogs", (req, res) => {
  const file = req.files.file;
  const filename = file.name;

  console.log(filename);

  file.mv(`public/posts/${filename}`, (err) => {
    if (err) {
      console.log("there is an error" + err);
    } else {

      Blog.create({
          ...req.body,
          image: `/posts/${filename}`,
        },
        (error, post) => {
          console.log(post);
          res.redirect("/");
        }
      );
    }
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
  const loginUser = localStorage.getItem('loginUser');
  res.render("create", {
    title: "Create",
    loginUser: loginUser,
  });
});



//this is Create post route, It'll 1st stored the data to mongodb using POST method.
router.post("/blogs", checkLoginUser, (req, res) => {
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
router.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;
  const loginUser = localStorage.getItem('loginUser');
  const blog = await Blog.findById(id);
  try {
    res.render("details", {
      title: "Blog details",
      blog: blog,
      loginUser: loginUser,
    });
  } catch {
    (err) => console.log(err);
  }
});

//this is Delete route
//it 1st delete the blog of that ID in mongodb . then,
//send the response in JSON format and redirect it to '/blogs' route.
router.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => {
      res.json({
        redirect: "/blogs",
      });
    })
    .catch((err) => console.log(err));
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndUpdate(id)
    .then((data) => {
      res.render("edit", {
        title: "edit blog",
        blog: data,
      });
    })
    .catch((err) => console.log(err));
});
//router is exported to App.js.
module.exports = router;