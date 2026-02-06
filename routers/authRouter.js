const express=require('express');
const authRouter=express.Router();
const authController= require("../controllers/authController");


authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/forgot-password", authController.getForgotPassword);
authRouter.post("/forgot-password", authController.postForgotPassword);

authRouter.get("/reset-password", authController.getResetPassword);
authRouter.post("/reset-password", authController.postResetPassword);

authRouter.post("/logout", authController.postLogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup", authController.postSignup);


// authRouter.post("/signup",authController.preSignup,authController.postSignup);
authRouter.post("/signup",authController.postSignup);



exports.authRouter=authRouter;  
    