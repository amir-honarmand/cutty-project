const {Router} = require('express');

const { getStats, postStats } = require('../controller/statsController');

const router = new Router();

//GET stats-----------------------------------
router.get("/", getStats);

//POST stats----------------------------------
router.post("/", postStats);

module.exports = router;