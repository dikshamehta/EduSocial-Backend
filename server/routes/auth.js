import express from "express";
import { login } from "../controllers/auth.js";
import { googleOAuthLogin } from "../controllers/googleLogin.js";
import { verifyCaptcha } from "../controllers/captcha.js";

const router = express.Router(); //Allow express to identify these routers will all be configured
//Allows us to create in a separate file and then export it

router.post("/login", login); //prefixed to auth already
// router.get('/google-login',googleLogin)
router.post("/google-login", googleOAuthLogin); //OAuth
router.post("/captcha", verifyCaptcha);

export default router;