const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");
const checkDuplicateEmail = require('../AuthMiddleware.js/Auth')

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
        msg: '',
    })
})

//register POST to database...
router.post("/register", checkDuplicateEmailorUsername, (req, res, next) => {
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
        res.render("register", {
            title: 'login authication',
            msg: 'User registered successfully',
        });

    })



})

//router is exported to App.js.
module.exports = router;