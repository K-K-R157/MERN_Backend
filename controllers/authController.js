const User = require("../models/User");

const {check, validationResult}=require('express-validator');   

const bcrypt =require('bcryptjs');


// const nodemailer = require("nodemailer");
// const getTransporter = require("../config/mail1");

const transporter = require("../config/mail"); 

const { firstNameValidation, lastNameValidation, emailValidation, passwordValidation, confirmPasswordValidation, userTypeValidation, termsValidation } = require("./validations");



exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{pageTitle:'Login',isLoggedIn:false});
}



exports.getForgotPassword=(req,res,next)=>{
    res.render('auth/forgot',{pageTitle:'forgot password',isLoggedIn:false});
}


exports.postForgotPassword=async (req,res,next)=>{
    const {email}=req.body;
    console.log(email);

    try{
        const user=await User.findOne({email});
        if(!user){
            throw  new Error('user not found');
        }
        const MILLIS_IN_MINUTE = 60 * 1000;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 20 * MILLIS_IN_MINUTE;
        await user.save();

        const forgotEmail = {
            to: email,
            from: `Airbnb Clone ${process.env.FROM_EMAIL}`, 
            subject: 'Here is your OTP to reset your Password',
            html: `<h1> OTP is: ${otp}</h1>
            <p> Enter this OTP on <a href="http://localhost:3002/reset-password?email=${email}">Reset Password</a> page. </p>
            `
        };
        await transporter.sendMail(forgotEmail);
        console.log('otp is sent to your email address to reset password')
        res.redirect(`/reset-password?email=${user.email}`);
    }catch(error){
         return res.render('auth/forgot',{pageTitle:'forgot password',isLoggedIn:'false',errorMessages:[error.message]});

    }
}

exports.getResetPassword=(req,res,next)=>{
    const {email}=req.query;
    return res.render('auth/resetPassword',{pageTitle:'reset password',isLoggedIn:'false',email});
}


exports.postResetPassword=[

   passwordValidation,
   confirmPasswordValidation,

    async (req,res,next)=>{
        const {email,password,confirm_password,otp}=req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/resetPassword', {
                pageTitle: 'reset password', 
                isLoggedIn: false,
                email:email,
                errorMessages: errors.array().map(err => err.msg),
                oldInput: req.body,
            });
        }

        try{
            const user=await User.findOne({email});
            
            if(user.otpExpiry<Date.now()) throw new Error('OTP has expired');
            else if(user.otp!==otp) throw new Error('OTP does not match');

            const hashedPassword = await bcrypt.hash(password, 12);
            user.password=hashedPassword;
            user.otp=undefined;
            user.otpExpiry=undefined;
            await user.save();

            res.redirect('/login');

        }catch(err){
            console.log(err);
            return res.render('auth/resetPassword',{pageTitle:'reset password',isLoggedIn:'false',email,errorMessages:[err.message]});
        }

    }
]



exports.postLogin= async (req,res,next)=>{
    
    const {email,password}=req.body;
     try {
        const user=await User.findOne({email});
        if(!user) throw new Error('User Not Found');

        const isMatch= await bcrypt.compare(password,user.password);

        if(!isMatch) throw new Error('Password does not match');

        req.session.isLoggedIn=true;
        // req.session.user=user;       // give error in newer version of mongoose and node 
        req.session.userId = user._id.toString();    // use this and add a middleware to access user from mongodb using user id from session
        await req.session.save();
        res.redirect('/');
     }catch(err) {
        return res.render('auth/login',{pageTitle:'Login',isLoggedIn:'false',errorMessages:[err.message]});
    };
}



exports.postLogout=(req,res,next)=>{
    req.session.destroy();
    res.redirect('/login');
}

exports.getSignup=(req,res,next)=>{
    res.render('auth/signup',{pageTitle:'signup',isLoggedIn:false});
}



exports.postSignup = [
    firstNameValidation,

    lastNameValidation,

    emailValidation,passwordValidation,

    confirmPasswordValidation,

    userTypeValidation,

    termsValidation,
    // Final handler
    async (req, res, next) => {
        console.log('=== SIGNUP HANDLER CALLED ===');
        // const transporter = await getTransporter();
        console.log('User came for signup:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'Signup', 
                isLoggedIn: false,
                errorMessages: errors.array().map(err => err.msg),
                oldInput: req.body,
            });
        }

        const {firstName, lastName, email, password, userType} = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            console.log('Password hashed successfully');
            
            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                userType
            });

            await user.save();

            // const welcomeEmail={
            //     from: "Airbnb Clone <no-reply@airbnb.test>",
            //     to: email,
            //     subject: "Welcome to your Airbnb",
            //     html: `
            //     <h2>Welcome  ${firstName} ${lastName}. Please book your first vacation home with us</h2>`,
            // }

            const welcomeEmail={
                from: `Airbnb Clone ${process.env.FROM_EMAIL}`,
                to: email,
                subject: "Welcome to your Airbnb",
                html: `
                <h2>Welcome  ${firstName} ${lastName}. Please book your first vacation home with us</h2>`,
            }

            // const info= await transporter.sendMail(welcomeEmail);

            await transporter.sendMail(welcomeEmail);


            // console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));

            console.log('User saved successfully');
            res.redirect('/login');
            
        } catch (error) {
            console.error('Signup error:', error);
            return res.status(422).render('auth/signup', {
                pageTitle: 'Signup', 
                isLoggedIn: false,
                errorMessages: [error.message],
                oldInput: req.body,
            });
        }
    }
];