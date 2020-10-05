const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../models/user");


checkDuplicateEmailorUsername = (req, res, next) => {
    let email = req.body.email;
    let username = req.body.username;

    const existUsername = User.findOne({
        username: req.body.username
    });
    existUsername.exec((err, user) => {
        if (err) throw err;

        if (user) {

            return (
                res.render('register', {
                    title: 'registerpage',
                    msg: 'Failed! Username is already existed!'
                }))
        }

    })

    const existEmail = User.findOne({
        email: req.body.email
    });
    existEmail.exec((err, user) => {
        if (err) throw err;

        if (user) {
            console.log(user)
            return (
                res.render('register', {
                    title: 'registerpage',
                    msg: 'Failed! Email is already existed!'
                }))
        }
        next();
    })




};

module.exports = checkDuplicateEmailorUsername;