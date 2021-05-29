const { pageTitle } = require("../config/globalVar");

//GET stats controller----------------------------
exports.getStats = (req, res)=>{
    res.render("stats", {
        pageTitle: pageTitle,
        path: "/stats",
    });
}