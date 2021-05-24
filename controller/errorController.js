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