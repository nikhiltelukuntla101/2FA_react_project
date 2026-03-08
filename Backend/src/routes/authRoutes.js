import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";
import { checkForAuthentication } from "../middlewares/checkForAuthentication.js";

const router = Router();

//registration route
router.post("/register", register);
//login route
router.post("/login", passport.authenticate("local"), login);
//auth status route
router.get("/status", authStatus);
//logout route
router.post("/logout", logout);

// 2FA setup
router.post("/2fa/setup", checkForAuthentication, setup2FA);
//verify route
router.post("/2fa/verify", checkForAuthentication, verify2FA);
//reset route
router.post("/2fa/reset", checkForAuthentication, reset2FA);

export default router;
