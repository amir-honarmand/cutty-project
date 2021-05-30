const urlModel = require("../models/urlModel");

const { nanoid } = require("nanoid");
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

    let myUrl = `${process.env.MY_URL}${nanoid(5)}`;
    // const myUrl = `${myUrlArr[0]}${myUrlArr[1]}${myUrlArr[2]}`;
    // let randomId = nanoid(10);
    // myUrl.push(nanoid(10));

    if('user' in req){
      user = req.user.id;
    }
      
    //create into db
    urlModel.create({
      url: req.body.url,
      shortened: myUrl,
      user,
    },async (err, result)=>{
      
      if (err && err.code === 11000) {
        
        let num = 5;
        while (err && err.code === 11000) {
          console.error("this Error",err.code, ": this url already used!");
          
          num++;
  
          myUrl = `${process.env.MY_URL}${nanoid(num)}`;
          const isFind = await urlModel.findOne({shortened: myUrl});
          if (!isFind) {
  
            await urlModel.create({
              url: req.body.url,
              shortened: myUrl,
              user,
            });
            
            req.session.shortened = myUrl;
            console.log("in index url:", req.session.shortened);
            return res.redirect("/shortened");    
            
          };
          
        };

      } else if(result) {
        
        req.session.shortened = myUrl;
        console.log("in index url:", req.session.shortened);
        
        return res.redirect("/shortened");
      }
        
      if(err && err.code !== 11000) {
        console.error("line 66 Error",err);
        return;
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
