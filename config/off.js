module.exports={
    ensureAuthentication:function(req,res,next){
        if(req.isAuthenticate){
            return next()
        }
        else{
            req.flash('error_msg',"please login to see the dashboard")
            res.redirect("/user/login")
        }
    }
}