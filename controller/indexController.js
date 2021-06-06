const urlModel = require("../models/urlModel");
const browserModel = require('../models/seprationModel/browserModel');
const devicesModel = require('../models/seprationModel/devicesModel');
const osModel = require('../models/seprationModel/osModel');

const { customAlphabet } = require("nanoid");
const {alphanumeric} = require('nanoid-dictionary');
const { get500 } = require("./errorController");
const { pageTitle } = require("../config/globalVar");


// GET request
exports.getIndex = (req, res) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.render("index", {
    pageTitle: pageTitle,
    path: "/index",
    user: req.user,
    errors: [],
  });
};

// POST request
exports.createCutLink = async (req, res) => {
  let user;

  try {
    await urlModel.urlValidation(req.body);

    const nanoid = customAlphabet(alphanumeric, 5);
    
    let myUrl = `${process.env.MY_URL}${nanoid()}`;

    const nanoid_urlid = customAlphabet(alphanumeric ,10);
    const urlId = nanoid_urlid();

    if('user' in req){
      user = req.user.id;
    }
      
    //create into db
    urlModel.create({
      url: req.body.url,
      shortened: myUrl,
      user,
      urlId
    },async (err, result)=>{
      
      if (err && err.code === 11000) {
        
        let num = 5;
        while (err && err.code === 11000) {
          console.error("this Error",err.code, ": this url already used!");
          
          num++;
  
          const nanoid_sum = customAlphabet(alphanumeric ,num);
          myUrl = `${process.env.MY_URL}${nanoid_sum()}`;
          const isFind = await urlModel.findOne({shortened: myUrl});
          if (!isFind) {
  
            const result = await urlModel.create({
              url: req.body.url,
              shortened: myUrl,
              user,
              urlId
            });

            await browserModel.create({urlId: result.urlId});
            await devicesModel.create({urlId: result.urlId});
            await osModel.create({urlId: result.urlId});    

            req.session.shortened = myUrl;
            console.log("in index url:", req.session.shortened);
            return res.redirect("/shortened");    
            
          };
          
        };

      } else if(result) {
        await browserModel.create({urlId: result.urlId});
        await devicesModel.create({urlId: result.urlId});
        await osModel.create({urlId: result.urlId});
        
        req.session.shortened = myUrl;
        console.log("in index url:", req.session.shortened);
        return res.redirect("/shortened");
      }
        
      if(err && err.code !== 11000) {
        console.error("line 66 Error",err);
        throw err;
      }
    });

  } catch (err) {
    
    console.log("erro catch",err);
    res.render("index", {
      pageTitle: pageTitle,
      path: "/index",
      user: req.user,
      errors: err.errors || ["مشکلی پیش آمده دوباره تلاش کنید"],
    });
  }
};
