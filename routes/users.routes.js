const userController = require("../controllers/users.controller");

const express = require("express");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/user-profile", userController.userProfile);
router.post("/otpLogin", userController.otpLogin);
router.post("/verifyOTP", userController.verifyOTP);

module.exports = router;