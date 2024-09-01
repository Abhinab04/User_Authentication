const express =require('express')
const expressLayouts = require('express-ejs-layouts');
const session=require('express-session')
const flash = require('connect-flash');
const passport =require('passport')
const mongoose=require('mongoose')
const app=express()
const port=3000;


//mongodb connection string
const db=require('./config/key').MongoURI;

//mongodb connection
mongoose.connect(db,{useNewUrlParser: true })
  .then(()=>{
    console.log("mongodb connect")
  })
  .catch(err => console.log(err))

//inpput from body middleware
app.use(expressLayouts)
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))

//middleware for session
app.use(session({ 
  secret:'secret', 
  saveUninitialized: true, 
  resave: true
})); 


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//middleware for flash
app.use(flash()); 

//displaying the flash msg
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash(`sucess_msg`)
  res.locals.error_msg=req.flash(`error_msg`)
  res.locals.error=req.flash('error')
  next();
})

app.use('/',require('./route/index'))
app.use('/user',require('./route/user'))

app.listen(3000,()=>{
    console.log("app is listening to the port 3000")
})