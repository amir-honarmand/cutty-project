exports.get404 = (req, res)=>{
    res.render("404", { 
        pageTitle: "صفحه مورد نظر پیدا نشد", 
        path: "/404" 
      });
};

exports.get500 = (req, res)=>{
    res.render("500",{
        pageTitle: "خطای سرور",
        path: "/404"
    });
};

//errorHandling in home page
exports.errorsIndex = (req, res, err)=>{
    if(err.errors){
        const error = err.errors.toString();
        req.flash('error_msg', error);
        return res.redirect("/");
    };

    req.flash('error_msg', 'مشکلی پیش آمده دوباره تلاش کنید');
    res.redirect("/");
};