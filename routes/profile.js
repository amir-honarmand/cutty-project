const {Router} = require('express');

const { authenticated } = require('../config/auth');

const {
  getProfile, 
  updateProfile,
  getLogin,
  getRegister,
  createUser,
  loginCheck,
  getLogout,
  rememberMe,
  uploadImage,
  getEditUrls,
} = require("../controller/profileController");

const router = new Router();

//get profile ---------------------
router.get("/", authenticated, getProfile);

router.post("/", updateProfile);

router.post("/upload", uploadImage);

router.get("/login", getLogin);

router.post("/login", loginCheck,rememberMe);

router.get("/register", getRegister);

router.post("/register", createUser);

router.get("/logout", authenticated, getLogout);

router.get("/:id", authenticated, getEditUrls);





module.exports = router;