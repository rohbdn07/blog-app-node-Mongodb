const express = require("express");
const morgon = require("morgan");
const path = require("path");
const mangoose = require("mongoose");
const Blog = require("./models/blog");
const bodyParser = require("body-parser");
const {
  result
} = require("lodash");
//express app
const app = express();

//listing to LocalHost
app.listen(3000);
//connect to Mangodb...
const dbURI =
  'PUT YOUR MONGODB URL HERE'
mangoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log("there is an error", err));

//register view engine
app.set("view engine", "ejs");

// use of body parser to convert into json.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//middleware and static files................
// app.use(express.static("public"));
// app.use(express.static(__dirname + './public'));

app.use(morgon("dev"));

//mangoose and mango sandbox route
// app.get("/add-blog", (req, res) => {
//   const blog = new Blog({
//     title: "new blog 2",
//     description: "this is a description",
//     body: "We are here to write something",
//   });
//   blog
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log("connection is db unsuccess", err);
//     });
// });

// app.get('/all-blogs', (req, res) => {
//   Blog.find().then((result) => {
//     res.send(result)
//   }).catch((err) => {
//     console.log(err)
//   })
// })

// app.get('/one-blog', (req, res) => {
//   Blog.findById('_id').then((Data) => {
//     res.send(Data)
//   }).catch((err) => {
//     console.log(err)
//   })
// })


//routes...
app.get("/", (req, res) => {
  res.redirect('/blogs')

});

//displaying all blogs stored in db...
app.get('/blogs', (req, res) => {
  Blog.find().sort({
    createdAt: -1 //blog will display in decending order.
  }).then((data) => {
    res.render("index", {
      title: "All blogs",
      blogs: data
    });
  }).catch((err) => {
    console.log('unable to get blogs', err)
    res.send('Opps! something went wrong', err)
  })
})
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
  });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", {
    title: "Create",
  });
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error",
  });
});