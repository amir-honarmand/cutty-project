const fs = require('fs');

const passport = require('passport');
const fetch = require('node-fetch');
const multer = require('multer');
const sharp = require('sharp');
const uuid = require('uuid').v4;
const appRoot = require('app-root-path');

// localStorage
const {LocalStorage} = require('node-localstorage');

const {storage, fileFilter} = require('../utils/upload');
const usersModel = require("../models/usersModel");
const urlModel = require("../models/urlModel");
const { get500 } = require("./errorController");
const localStorage = new LocalStorage("./scratch");

//-----------------------------------login-------------------------------------

exports.getLogin = (req, res) => {
    const errorArr = [];
    if(req.headers.referer !== "http://cutty.ir/profile/login"){
        localStorage.setItem("referer", req.headers.referer || "/");
    }
  
    if(req.isAuthenticated()) return res.redirect("/");
    
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    res.render("login", {
        pageTitle: "ورود به حساب کاربری | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع",
        path: "/profile/login",
        success: req.flash("success_msg"),
        errors: req.flash("error"),
    });
};
  
// login POST----------------------------------
exports.loginCheck = async (req,res,next)=>{

    //google recaptcha verify
    if(!req.body["g-recaptcha-response"]){
        req.flash("error", "اعتبارسنجی recaptcha الزامی می باشد");
        return res.redirect("/profile/login");
    }

    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
        &remoteip=${req.connection.remoteAddress}`;

    const response = await fetch(verifyUrl,{
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
        },
    });

    const json = await response.json();

    if (json.success){
        passport.authenticate("local",{
        // successRedirect : localStorage.getItem("referer") || "/",
        failureRedirect: "/profile/login",
        failureFlash: true,
        })(req,res,next);

    }else{
        req.flash("error", "مشکلی در اعتبارسنجی پیش آمده است");
        return res.redirect("/profile/login");
    }
    
}
  
// login REMEMBERME----------------------------------
  
exports.rememberMe = (req,res)=>{
    if (req.body.rememberme) {
        req.session.cookie.originalMaxAge = 86400000;
    }else{
        req.session.cookie.expire = null;
    }

    res.redirect(localStorage.getItem("referer") || "/");
}
  
//----------------------------------register------------------------------------
  
exports.getRegister = (req, res) => {
    if(req.isAuthenticated()) return res.redirect("/");

    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    
    res.render("register", {
        pageTitle: "ثبت نام | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع",
        path: "/profile/register",
        errors: [],
    });
};
  
// register POST----------------------------------------
exports.createUser = async (req, res) => {
    try {
        await usersModel.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await usersModel.findOne({ email });
        if (user) {
        return res.render("register", {
            pageTitle: "ثبت نام | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع",
            path: "/profile/register",
            errors: ["کاربری با این ایمیل قبلا ثبت نام کرده است"],
        });
        }

        // const hash = await bcrypt.hash(password, 10);
        await usersModel.create({ fullname, email, password });

        req.flash("success_msg", "ثبت نام موفقیت آمیز بود");
        res.redirect("/profile/login");
    } catch (err) {
        console.log(err);

        res.render("register", {
            pageTitle: "ثبت نام | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع",
            path: "/profile/register",
            errors: err.errors,
        });
    }
};

// --------------------logout--------------
exports.getLogout = (req,res)=>{
    // req.flash("success_msg", "خروج موفقیت آمیز بود");
    req.session = null;
    req.logout();
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.redirect("/profile/login");
}

// get profile--------------------------  
exports.getProfile = async (req,res)=>{

    try {
        const urls = await urlModel.find({user: req.user.id}).sort({date: "desc"});

        // for(let url of urls){
        //     url.cutUrl = url.cutUrl.slice(7);
        // };
        
        res.set(
            "Cache-Control",
            "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
        );
        
        res.render("profile", {
            pageTitle: `داشبورد ${req.user.fullname} | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع`,
            path: "/profile",
            user: req.user,
            avatar: `/uploads/${req.user.avatar}`,
            urls,
            getUrl: null,
            updateUrl: null,
        });

    } catch (err) {
        console.log(err);
        get500(req, res);
    }
    
};

//POST profile---------------------------------------
exports.updateProfile = async (req, res)=>{
    
    try {
        await usersModel.editUserValidation(req.body);
        const {fullname, password} = req.body;
        await usersModel.updateOne({email: req.user.email}, {fullname},{},(err)=>{
            console.log(err);
            if(err) get500(req, res);
        });
        return res.redirect("/profile");
        
    } catch (err) {
        console.log(err);
        
    }
}

// upload image-------------------------------
exports.uploadImage = (req, res)=>{
    const upload = multer({
        limits: {fileSize: 4000000},
        // dest: "uploads/",
        // storage,
        fileFilter,
    }).single("image");

    upload(req, res, async (err)=>{
        if(err){
            console.log(err);
            res.send(err);
        }else{
            if (req.file){
                fs.unlink(`${appRoot}/public/uploads/${req.user.avatar}`, async (err)=>{
                    if(err){
                        console.log(err);
                        get500(req, res);
                    }else{
                        const fileName = `${uuid()}_${req.file.originalname}`;
                        await sharp(req.file.buffer).jpeg({quality: 50}).toFile(
                            `./public/uploads/${fileName}`
                        ).catch(err => res.send(err));
                        
                        await usersModel.updateOne({email: req.user.email},{avatar: fileName})
        
                        res.status(200).send("آپلود عکس موفقیت آمیز بود");
                    }
                });

            }else{
                res.send("عکسی را انتخاب کنید");
            }
        }
    });
}

// get edit urls--------------------------------------
exports.getEditUrls = async (req, res)=>{
    // console.log(req.query);
    try {
        const urls = await urlModel.find({user: req.user.id}).sort({date: "desc"});
        const getUrl = await urlModel.findOne({_id: req.params.id});
        if(!getUrl){
            return res.redirect("/404");
        }else{
            if(getUrl.user.toString() !== req.user.id) return res.redirect("/404");
        }
        
        res.render("profile", {
            pageTitle: `داشبورد ${req.user.fullname} | کوتاه کننده لینک کاتی | کوتاه کننده لینک ساده و سریع`,
            path: "/profile",
            user: req.user,
            avatar: `/uploads/${req.user.avatar}`,
            urls, 
            getUrl,
            updateUrl: getUrl.cutUrl.slice(9),
        });
        
    } catch (err) {
        console.log(err);
    }
}