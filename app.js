const express = require("express");
const morgon = require("morgan");
const blogRoutes = require("./routes/blogRoutes");
const path = require("path");
const router = express.Router();
const mangoose = require("mongoose");
const bodyParser = require("body-parser");
const _ = require("lodash");
const Uri = require('./mongodb/uri');

//express app
const app = express();

//listing to LocalHost
app.listen(5000);

//connect to Mangodb...
const dbURI =
  Uri;
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
app.use(express.static(path.join(__dirname, "public")));

app.use(morgon("dev"));

//blog routes
app.use(blogRoutes);

//404 page...
//if NO routes is matched in blogRoutes.js file.
//It will display 404 error page to user.
//It MUST be placed at end of the router.js
router.use((req, res) => {
  res.status(404).render("404", {
    title: "Error",
  });
});