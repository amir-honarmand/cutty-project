exports.authenticated = (req,res,next)=>{
    if(req.isAuthenticated()) 
    return next();
    
    res.redirect("/profile/login");
}