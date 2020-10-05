const express = require("express");
const router = express.Router();
const path = require("path");
const Blog = require("../models/blog");
const User = require("../models/user");

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

//register POST to database...
router.post("/register", (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    const userDetails = new User({
        username: username,
        email: email,
        password: password
    });
    userDetails.save((err, data) => {
        console.log(data)
        if (err) throw err;
        res.render("/register", {
            title: 'login authication',
            msg: '',
        })
    })



})

//router is exported to App.js.
module.exports = router;