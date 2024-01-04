const User=require('../models/userModel');
const catchAsyncError=require('../middlewares/catchAsyncError');
const ErrorHandler=require('../utils/errorHandler');
const sendEmail=require('../utils/nodemailer');
const crypto=require('crypto');

exports.generateOTP = catchAsyncError(async(req,res,next)=>{

    let user = await User.findOne({email: req.body.email});

    if(!user){
        const registerUser=await User.create({
            email:req.body.email
        })
        user=await User.findOne({email: req.body.email});
    }

    //Get ResetPassword Token
     const OTP= await user.createOTP();
    console.log(OTP);
    await user.save({validateBefoeSave:false});

    const message = `Your OTP is :- \n ${OTP} \n\n If you have not requested this email
    then, Please ignore it`;

    try {

        await sendEmail({

            email:user.email,
            subject:"OTP Verification Carbon Calculator",
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        user.otp = undefined; // we making this undefined because we already saved the resetToken in our Database and here request failed so we need to reset fields.
        user.expiresIn = undefined;

        await user.save({validateBefoeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
});


exports.verifyOTP = catchAsyncError(async(req,res,next)=>{

    const otp = req.body.otp;

    const user = await User.findOne({
        otp,
        expiresIn: {$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("OTP for email verfication is invalid or has been expired",404));
    }

    user.otp = undefined; // we making this undefined because we already saved the otp in our Database and here request failed so we need to reset fields.
    user.expiresIn = undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message:`Email is verified`
    })

});