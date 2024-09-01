const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();

const User = require('../models/Users');
const passport = require('../config/passport');

//login page
router.get('/login', (req, res) => {
    res.render("login");
})

//register page
router.get('/register', (req, res) => {
    res.render("register");
})

//getting value from register form
router.post('/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    let errors = [];
    //empty blank error
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill all the blanks" })
    }
    //password mismatch error
    if (password != password2) {
        errors.push({ msg: "password mismatch" })
    }
    //password too short error
    if (password.length < 6) {
        errors.push({ msg: "password is too short" })
    }
    if (errors > 0) {
        res.render('register', {
            name,
            email,
            password,
            password2,
            errors
        })
    }
    else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exist
                    errors.push({ msg: "user already exist" })
                    res.render('register', {
                        name,
                        email,
                        password,
                        password2,
                        errors
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    //hashing the password to make it secure
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            newUser.password = hash;

                            //save user
                            newUser.save()
                                .then(user => {
                                    req.flash('sucess_msg', "you have succesfully registered now can login")
                                    res.redirect("/user/login")
                                })
                                .catch(err => console.log(err))
                        });

                    });
                }
            })
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:"/dashboard",
        failureRedirect:"/user/login",
        failureFlash:true
    })(req,res,next)
})


router.get("/logout",(req,res)=>{
    req.logout();
    req.flash('sucess_msg',"you are successfully logout")
    res.redirect("/user/login")
})
module.exports = router;
