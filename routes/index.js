const { Router } = require("express");

const {
  getIndex,
  createCutLink,
} = require("../controller/indexController");

const router = new Router();

router.get("/", getIndex);

router.post("/", createCutLink);


module.exports = router;
