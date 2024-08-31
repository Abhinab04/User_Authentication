const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();

const User = require('../models/Users')


router.get('/login', (req, res) => {
    res.render("login");
})

router.get('/register', (req, res) => {
    res.render("register");
})

router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    let error = [];
    //empty blank error
    if (!name || !email || !password || !password2) {
        error.push({ msg: "Please fill all the blanks" })
    }
    //password mismatch error
    if (password != password2) {
        error.push({ msg: "password mismatch" })
    }
    //password too short error
    if (password.length < 6) {
        error.push({ msg: "password is too short" })
    }
    if (error > 0) {
        res.render('register', {
            name,
            email,
            password,
            password2,
            error
        })
    }
    else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exist
                    error.push({ msg: "user already exist" })
                    res.render('register', {
                        name,
                        email,
                        password,
                        password2,
                        error
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            newUser.password = hash;

                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', "you have succesfully registered")
                                    res.redirect('/user/login')
                                })
                                .catch(err => console.log(err))
                        });

                    });
                }
            })
    }
})

module.exports = router;
