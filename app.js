const express =require('express')
const expressLayouts = require('express-ejs-layouts');
const session=require('express-session')
const flash = require('connect-flash');
const mongoose=require('mongoose')
const app=express()
const port=3000;

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

//middleware for flash
app.use(flash()); 

app.use((req,res,next)=>{
  res.locals.success_msg=req.flash("success_msg")
  res.locals.error_msg=req.flash("eror_msg")
  next
})

app.use('/',require('./route/index'))
app.use('/user',require('./route/user'))

app.listen(3000,()=>{
    console.log("app is listening to the port 3000")
})