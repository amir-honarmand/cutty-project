const {Router} = require('express');

const { authenticated } = require('../config/auth');

const {
  getDashboard: getDashboard, 
  updateDashboard: updateDashboard,
  getLogin,
  getRegister,
  createUser,
  loginCheck,
  getLogout,
  rememberMe,
  uploadImage,
  getEditUrls,
} = require("../controller/dashboardController");

const router = new Router();

//get dashboard ---------------------
router.get("/", authenticated, getDashboard);

router.post("/", updateDashboard);

router.post("/upload", uploadImage);

router.get("/login", getLogin);

router.post("/login", loginCheck,rememberMe);

router.get("/register", getRegister);

router.post("/register", createUser);

router.get("/logout", authenticated, getLogout);

router.get("/:id", authenticated, getEditUrls);





module.exports = router;