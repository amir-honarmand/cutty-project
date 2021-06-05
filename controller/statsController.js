const { pageTitle } = require("../config/globalVar");
const browserModel = require("../models/seprationModel/browserModel");
const devicesModel = require("../models/seprationModel/devicesModel");
const osModel = require("../models/seprationModel/osModel");
const urlModel = require('../models/urlModel');
const { get500 } = require("./errorController");
const {formatDate} = require("../utils/jalai");

//GET stats controller----------------------------
exports.getStats = async (req, res)=>{

    
    try {
        let url = null, browsers = null, devices = null, os = null;
        let createAt = null, totalVisits = null, shortened = null, orginalUrl = null, urlId = null;
        let date = null;

        if(req.query.urlId){
            url = await urlModel.findOne({urlId: req.query.urlId});
            browsers = await browserModel.findOne({urlId: req.query.urlId});
            devices = await devicesModel.findOne({urlId: req.query.urlId});
            os = await osModel.findOne({urlId: req.query.urlId});
            createAt = url.createAt;
            totalVisits = url.totalVisits;
            shortened = url.shortened;
            urlId = url.urlId;
            orginalUrl = url.url;
            date = formatDate;
        };
        
        res.render("stats", {
            pageTitle: pageTitle,
            path: "/stats",
            user: req.user,
            createAt,
            totalVisits,
            browsers,
            devices,
            os,
            shortened,
            orginalUrl,
            urlId,
            date
        });
        
    } catch (err) {
        console.log(err);
        get500(req, res);
    };
    
};

//POST stats---------------------------------------
exports.postStats = async (req, res)=>{
    try {
        const url = await urlModel.findOne({urlId: req.body.urlId});
        const browsers = await browserModel.findOne({urlId: req.body.urlId});
        const devices = await devicesModel.findOne({urlId: req.body.urlId});
        const os = await osModel.findOne({urlId: req.body.urlId});
        // console.log(totalVisits.totalVisits, browsers, devices, os);

        res.render("stats", {
            pageTitle: pageTitle,
            path: "/stats",
            user: req.user,
            createAt: url.createAt,
            totalVisits: url.totalVisits,
            browsers,
            devices,
            os,
            shortened: url.shortened,
            date: formatDate,
            orginalUrl: url.url,
            urlId: url.urlId
        });    

    } catch (err) {
        console.log(err);
        get500(req, res);
    };
    
};