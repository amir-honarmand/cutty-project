const { pageTitle } = require("../config/globalVar");
const browserModel = require("../models/seprationModel/browserModel");
const devicesModel = require("../models/seprationModel/devicesModel");
const osModel = require("../models/seprationModel/osModel");
const urlModel = require('../models/urlModel');

//GET stats controller----------------------------
exports.getStats = async (req, res)=>{

    if(req.query){
        const url = await urlModel.findOne({urlId: req.query.urlId});
        const browsers = await browserModel.findOne({urlId: req.query.urlId});
        const devices = await devicesModel.findOne({urlId: req.query.urlId});
        const os = await osModel.findOne({urlId: req.query.urlId});
        
        res.render("stats", {
            pageTitle: pageTitle,
            path: "/stats",
            createAt: url.createAt,
            totalVisits: url.totalVisits,
            browsers,
            devices,
            os,
        });
        
    }else{
        res.render("stats", {
            pageTitle: pageTitle,
            path: "/stats",
            createAt: 0,
            totalVisits: 0,
            browsers: 0,
            devices: 0,
            os: 0,
        });

    };
};

//POST stats---------------------------------------
exports.postStats = async (req, res)=>{
    const url = await urlModel.findOne({urlId: req.body.urlId});
    const browsers = await browserModel.findOne({urlId: req.body.urlId});
    const devices = await devicesModel.findOne({urlId: req.body.urlId});
    const os = await osModel.findOne({urlId: req.body.urlId});
    // console.log(totalVisits.totalVisits, browsers, devices, os);

    res.render("stats", {
        pageTitle: pageTitle,
        path: "/stats",
        createAt: url.createAt,
        totalVisits: url.totalVisits,
        browsers,
        devices,
        os,
    });
};