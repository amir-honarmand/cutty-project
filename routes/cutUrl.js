const { Router } = require("express");

const cutUrlController = require("../controller/cutUrlController");

const router = new Router();

// GET
router.get("/", cutUrlController.getCutUrl);

// POST
router.post("/", cutUrlController.updateUrl);

module.exports = router;
