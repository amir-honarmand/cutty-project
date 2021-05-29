const {Router} = require('express');

const { getStats } = require('../controller/statsController');

const router = new Router();

//GET stats-----------------------------------
router.get("/", getStats);

module.exports = router;