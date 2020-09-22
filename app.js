const express = require("express");
const morgon = require("morgan");
const path = require("path");
const mangoose = require("mongoose");
const Blog = require("./models/blog");
const bodyParser = require("body-parser");
const _ = require("lodash");

//express app
const app = express();

//listing to LocalHost
app.listen(3000);

//connect to Mangodb...
const dbURI = "PUT YOUR MONGODB URL HERE";
mangoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("there is an error", err));

//register view engine
app.set("view engine", "ejs");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//middleware and static files................
app.use(express.static("public"));
// app.use(express.static(__dirname + './public'));
app.use(morgon("dev"));

//this is route to home(index page)
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//displaying all blogs on index page(home page) using GET method,
//which are stored in mongodb..
app.get("/blogs", (req, res) => {
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

//This is About route...
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

//this is Create post route, It'll 1st stored the data to mongodb using POST method.
app.post("/blogs", (req, res) => {
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

//this is Create route...
app.get("/blogs/create", (req, res) => {
  res.render("create", {
    title: "Create",
  });
});

// this is single blog page route pass through '/blogs/:id'...
app.get("/blogs/:id", (req, res) => {
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
app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

//if NO routes is matched above.
//It will display 404 error page to user.
//It MUST be placed at end of the app.js
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error",
  });
});
