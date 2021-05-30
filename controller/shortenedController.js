const { pageTitle } = require("../config/globalVar");
const urlModel = require("../models/urlModel");
const { get404, get500 } = require("./errorController");

//--------------------shortened GET---------------------------------------------------------

exports.getshortened = async (req, res) => {
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
      // res.end(urlDb.url);

      res.redirect(urlDb.url);
    } else {
      get404(req,res);
    }
  } catch (err) {
    console.log(err);
    get500(req, res);
  }
};
