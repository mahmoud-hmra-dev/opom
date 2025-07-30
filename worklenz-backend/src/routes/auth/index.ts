import express from "express";
import passport from "passport";

import AuthController from "../../controllers/auth-controller";

import signUpValidator from "../../middlewares/validators/sign-up-validator";
import resetEmailValidator from "../../middlewares/validators/reset-email-validator";
import updatePasswordValidator from "../../middlewares/validators/update-password-validator";
import passwordValidator from "../../middlewares/validators/password-validator";
import safeControllerFunction from "../../shared/safe-controller-function";


const authRouter = express.Router();

// Local authentication
const options = (key: string): passport.AuthenticateOptions => ({
  failureRedirect: `/secure/verify?strategy=${key}`,
  successRedirect: `/secure/verify?strategy=${key}`
});

authRouter.post("/login", passport.authenticate("local-login", options("login")));
authRouter.post("/signup", signUpValidator, passwordValidator, passport.authenticate("local-signup", options("signup")));
authRouter.post("/signup/check", signUpValidator, passwordValidator, safeControllerFunction(AuthController.status_check));
authRouter.get("/verify", AuthController.verify);
authRouter.get("/check-password", safeControllerFunction(AuthController.checkPasswordStrength));

authRouter.post("/reset-password", resetEmailValidator, safeControllerFunction(AuthController.reset_password));
authRouter.post("/update-password", updatePasswordValidator, passwordValidator, safeControllerFunction(AuthController.verify_reset_email));

// Google authentication
authRouter.get("/google", (req, res) => {
  return passport.authenticate("google", {
    scope: ["email", "profile"],
    state: JSON.stringify({
      teamMember: req.query.teamMember || null,
      team: req.query.team || null,
      teamName: req.query.teamName || null,
      project: req.query.project || null
    })
  })(req, res);
});

authRouter.get("/google/verify", (req, res) => {
  let error = "";
  if ((req.session as any).error) {
    error = `?error=${encodeURIComponent((req.session as any).error as string)}`;
    delete (req.session as any).error;
  }

  const failureRedirect = process.env.LOGIN_FAILURE_REDIRECT + error;
  return passport.authenticate("google", {
    failureRedirect,
    successRedirect: process.env.LOGIN_SUCCESS_REDIRECT
  })(req, res);
});

// authRouter.post("/generate-token", safeControllerFunction(AuthController.generateToken));
// authRouter.get("/get-xsrf-token", (req, res) => {
//   const token = req.csrfToken();
//   res.cookie("XSRF-TOKEN", token); // Set the token in a cookie
//   res.status(200).json({ token }); // Return the token in the response body
// });


// Passport logout
authRouter.get("/logout", AuthController.logout);

export default authRouter;
