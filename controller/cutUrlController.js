const { pageTitle } = require("../config/globalVar");
const urlModel = require("../models/urlModel");
const { get404, get500 } = require("./errorController");

//--------------------cutUrl GET---------------------------------------------------------

exports.getCutUrl = async (req, res) => {
  // let result;
  // let getArrUrl = [];
  
  try {
    const cutUrl = req.session.cutUrl || "";

    const result = await urlModel.findOne({cutUrl});
    if (result) {
      // getArrUrl = cutUrl;
      res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      
      res.render("cut-url", {
        pageTitle: pageTitle,
        result,
        updateUrl: result.cutUrl.slice(9),
        path: "/cut-url",
        user: req.user,
        errors: [],
      });

    } else res.redirect("/");
    
  } catch (err) {
    console.log(err);
    get500(req, res);
  }

  
};

//--------------------cutUrl POST---------------------------------------------------------
exports.updateUrl = async (req, res) => {
  // const cutUrl = req.body.cutUrl;
  const cutUrl = req.session.cutUrl || "";
  try {
    await urlModel.cutUrlValidation(req.body);
    const result = await urlModel.findOne({ cutUrl });

    if (result) {

      let user;
      if('user' in req){
        user = req.user.id;
      }
      
      await urlModel.updateOne(
        { cutUrl},
        { cutUrl: `${process.env.MY_URL}${req.body.updateUrl}`, user },
        {},
        (err) => {
          console.log(err);

          if (err) {
            // res.render("cut-url", {
            //   pageTitle: "کوتاه کننده لینک | لینک کوتاه شده",
            //   errors: ["این آدرس قبلا استفاده شده است"],
            //   path: "/cut-url",
            // });
            res.send("<h1>این آدرس قبلا استفاده شده است</h1>");
          }
        }
      );

      if (result.cutUrl) {
        req.session.cutUrl = `${process.env.MY_URL}${req.body.updateUrl}`;
        res.redirect("/cut-url");
      }
    } else {
      res.send("<h3>not found</h3>");
    }
  } catch (err) {
    console.log(err);
    res.render("cut-url", {
      pageTitle: pageTitle,
      cutUrl,
      updateUrl: cutUrl.slice(9),
      path: "/cut-url",
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
    const urlDb = await urlModel.findOne({ cutUrl: `${myUrl}${getUrl}` });
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
