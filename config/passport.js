const passport=require('passport')
const mongoose=require('mongoose');
const LocalStrategy = require('passport-local');
const bcrypt=require('bcryptjs')

const User=require('../models/Users')

module.exports=function(passport){
    passport.use(
        new LocalStrategy({
           usernameField:'email'
        },(email,password,done)=>{
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:"the email is not register"})
                }

                //Match password
                bcrypt.compare(password,user.password,(err,ismatch)=>{
                    if(err) throw (err)
                    if(ismatch){
                        done(null,user)
                    }
                    else{
                        done(null,false,{message:"password does not match"})
                    }
                })
            })
            .catch(err => console.log(err))
        }
      ));
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });