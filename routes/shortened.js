const { Router } = require("express");

const shortenedController = require("../controller/shortenedController");

const router = new Router();

// GET
router.get("/", shortenedController.getShortened);

// POST
router.post("/", shortenedController.updateUrl);

module.exports = router;
