const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const checkLoginUser = require('../AuthMiddleware/Auth');
const User = require("../models/user");
const methodOverride=require("method-override")
require('dotenv').config();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

//Routes....

//displaying all blogs on index page(home page) using GET method,
//which are stored in mongodb..
router.get("/blogs", (req, res) => {
  const loginUserEmail = localStorage.getItem('loginUser');
  const loginUsername=localStorage.getItem('Loginusername');
  Blog.find({})
    .sort({
      createdAt: '-1', //blog will display in decending order.
    })
    .then((data) => {
      res.render("index", {
        title: "All blogs",
        blogs: data,
        loginUser: loginUserEmail,
        loginUsername:loginUsername,

      });
      console.log('logged as:' + loginUserEmail);
      console.log('logged as:' + loginUsername);

    })
    .catch((err) => {
      console.log("unable to get blogs", err);
      res.send("Opps! something went wrong", err);
    });
});

// another way of Uploading the image/file...

// router.post("/blogs", (req, res) => {
//   const file = req.files.file;
//   const filename = file.name;

//   console.log(filename);

//   file.mv(`public/posts/${filename}`, (err) => {
//     if (err) {
//       console.log("File uploading err:" + err);
//     } else {

//       Blog.create({
//           ...req.body,
//           image: `/posts/${filename}`,
//         },
//         (error, post) => {
//           console.log(post);
//           res.redirect("/");
//         }
//       );
//     }
//   });
// });

//this is route to home(index page)
router.get("/", (req, res) => {
  res.redirect("/blogs");
});

//This is About route...
router.get("/about", (req, res) => {
  const loginUser = localStorage.getItem('loginUser');
  res.render("about", {
    title: "About",
    loginUser: loginUser,
  });
});

//this is Create route...
router.get("/blogs/create", (req, res) => {
  const loginUser = localStorage.getItem('loginUser');
  res.render("create", {
    title: "Create",
    msg: '',
    blogs: new Blog,
    loginUser: loginUser,
  });
});

//function for Create and edit post
function saveBlogandRedirect (path){
  return async(req,res)=>{
    const loginUser = localStorage.getItem('loginUser');
    const file = req.files.file;
    const filename = file.name;
    console.log(filename);
    console.log(req.user)
    file.mv(`public/posts/${filename}`, async (err) =>{
    if (err) {
      console.log("File uploading err:" + err)
    };
    // const blog = new Blog(req.body);
      let blog =req.blog
      console.log(blog)
      blog.username= req.body.username
      blog.title=req.body.title
      blog.description=req.body.description
      blog.content=req.body.content
      blog.image= `/posts/${filename}`
    
    try {
      blog = await blog.save();
      console.log('blog is saved to db')
      res.redirect('/blogs')
      console.log('file saved to db');
      } 
      catch (err) {
      res.render(`${path}`, {
        title: 'not saved',
        msg: 'opps! file not saved, Title name already exit!',
        blogs: blog,
        loginUser: loginUser,

      });
      console.log('data not saved' + '' + err)
    }
  })
  };
}

//this is Create post route, It'll 1st stored the data to mongodb using POST method.
router.post("/blogs",(req, res, next) => {
  req.blog= new Blog();
  next();
}, saveBlogandRedirect("create"));

//PUT route is using to edit the content
router.put('/blogs/:id', async (req,res,next)=>{
  req.blog= await Blog.findById(req.params.id);
  next();
}, saveBlogandRedirect('edit'))

// this is single blog page route pass through '/blogs/:id'...
router.get("/blogs/:slug", async (req, res) => {
  // const id = req.params.id;
  const loginUser = localStorage.getItem('loginUser');
  const blog = await Blog.findOne({
    slug: req.params.slug
  });

  try {
    res.render("details", {
      title: "Blog details",
      blog:blog,
      loginUser: loginUser,
      
    });
  } catch {
    (err) => console.log(err);
  }
});

//this is Delete route
//it 1st delete the blog of that ID in mongodb . then,
//send the response in JSON format and redirect it to '/blogs' route.
router.delete("/blogs/:slug", (req, res) => {
  Blog.findOneAndDelete({
      slug: req.params.slug
    })
    .then(() => {
      res.json({
        redirect: "/blogs",
      });
    })
    .catch((err) => console.log(err));
});

//GET route for editing the existing contents
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const loginUser = localStorage.getItem('loginUser');
  Blog.findById({
      _id: id
    }).then((data) => {
      res.render("edit", {
        title: "Update blog",
        blog: data,
        loginUser: loginUser,

      });
    })
    .catch((err) => console.log(err));
});



//SEARCH ROUTES...
router.post('/search/',(req,res)=>{
  const loginUser = localStorage.getItem('loginUser');
  const loginUsername=localStorage.getItem('loginUsername');
  let userPattern=new RegExp('^'+req.body.search.toLowerCase());
  const titleFilter= Blog.find({title:{$regex:userPattern}});
  titleFilter.exec((err, data) => {
    res.render("index", {
      title: "All blogs",
      blogs: data,
      loginUser: loginUser,
      loginUsername:loginUsername,

    });
  })
  
})
//router is exported to App.js.
module.exports = router;