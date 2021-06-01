const { pageTitle } = require("../config/globalVar");
const urlModel = require("../models/urlModel");
const browserModel = require('../models/seprationModel/browserModel');
const devicesModel = require('../models/seprationModel/devicesModel');
const osModel = require('../models/seprationModel/osModel');
const { get404, get500 } = require("./errorController");

//--------------------shortened GET---------------------------------------------------------

exports.getShortened = async (req, res) => {
  // let result;
  // let getArrUrl = [];
  
  try {
    const shortened = req.session.shortened || "";

    const result = await urlModel.findOne({shortened});
    if (result) {
      // getArrUrl = shortened;
      res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      
      res.render("shortened", {
        pageTitle: pageTitle,
        result,
        updateUrl: result.shortened.slice(9),
        path: "/shortened",
        user: req.user,
        errors: [],
      });

    } else res.redirect("/");
    
  } catch (err) {
    console.log(err);
    get500(req, res);
  }

  
};

//--------------------shortened POST---------------------------------------------------------
exports.updateUrl = async (req, res) => {
  // const shortened = req.body.shortened;
  const shortened = req.session.shortened || "";
  try {
    await urlModel.shortenedValidation(req.body);
    const result = await urlModel.findOne({ shortened });

    if (result) {

      let user;
      if('user' in req){
        user = req.user.id;
      }
      
      await urlModel.updateOne(
        { shortened},
        { shortened: `${process.env.MY_URL}${req.body.updateUrl}`, user },
        {},
        (err) => {
          console.log(err);

          if (err) {
            // res.render("shortened", {
            //   pageTitle: "کوتاه کننده لینک | لینک کوتاه شده",
            //   errors: ["این آدرس قبلا استفاده شده است"],
            //   path: "/shortened",
            // });
            res.send("<h1>این آدرس قبلا استفاده شده است</h1>");
          }
        }
      );

      if (result.shortened) {
        req.session.shortened = `${process.env.MY_URL}${req.body.updateUrl}`;
        res.redirect("/shortened");
      }
    } else {
      res.send("<h3>not found</h3>");
    }
  } catch (err) {
    console.log(err);
    res.render("shortened", {
      pageTitle: pageTitle,
      shortened,
      updateUrl: shortened.slice(9),
      path: "/shortened",
      user: req.user,
      errors: err.errors,
    });
  }
};

//------------------------redirect----------------------------------------------------

exports.getRedirect = async (req, res) => {
  const getUrl = req.url.slice(1);
  const myUrl = process.env.MY_URL;
  
  try {
    const urlDb = await urlModel.findOne({ shortened: `${myUrl}${getUrl}` });
    if (urlDb) {
      await urlModel.updateOne({_id: urlDb.id}, {totalVisits: urlDb.totalVisits + 1});
      
      const browsers = await browserModel.findOne({url: urlDb.id});
      const devices = await devicesModel.findOne({url: urlDb.id});
      const os = await osModel.findOne({url: urlDb.id});

      //browser populate
      if(req.useragent.isChrome) {
        await browserModel.updateOne({url: urlDb.id}, {chrome : browsers.chrome + 1});
        
      }else if(req.useragent.isFirefox) {
        await browserModel.updateOne({url: urlDb.id}, {firefox: browsers.firefox + 1});

      }else if(req.useragent.isSafari){
        await browserModel.updateOne({url: urlDb.id}, {safari: browsers.safari + 1});

      }else if(req.useragent.isEdge){
        await browserModel.updateOne({url: urlDb.id}, {edge: browsers.edge + 1});
      };

      //devices populate
      if(req.useragent.isDesktop){
        await devicesModel.updateOne({url: urlDb.id}, {desktop: devices.desktop + 1});

      }else if(req.useragent.isMobile){
        await devicesModel.updateOne({url: urlDb.id}, {mobile: devices.mobile + 1});
      };

      //os populate
      if(req.useragent.isWindows){
        await osModel.updateOne({url: urlDb.id}, {windows: os.windows + 1});

      }else if(req.useragent.isMac){
        await osModel.updateOne({url: urlDb.id}, {mac: os.mac + 1});

      }else if(req.useragent.isiPad || req.useragent.isiPod || req.useragent.isiPhone || req.useragent.isiPhoneNative){
        await osModel.updateOne({url: urlDb.id}, {ios: os.ios + 1});
        
      }else if(req.useragent.isAndroid || req.useragent.isAndroidNative){
        await osModel.updateOne({url: urlDb.id}, {android: os.android + 1});
        
      }

      // console.log("user agnet ", req.useragent);
      
      res.redirect(urlDb.url);
    } else {
      get404(req,res);
    }
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};
