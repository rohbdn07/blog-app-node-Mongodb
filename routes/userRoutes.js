const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../models/blog");

//this is Login route page...
router.get('/login', (req, res, next) => {
    res.render("login", {
        title: "loginPage",
    })
})

//this is Register route page...
router.get('/register', (req, res, next) => {
    res.render("register", {
        title: "registerPage",
    })
})

//router is exported to App.js.
module.exports = router;