const User=require('../models/userModel');
const carbonEmission=require('../models/carbonEmissionModel');
const catchAsyncError=require('../middlewares/catchAsyncError');
const ErrorHandler=require('../utils/errorHandler');
const sendEmail=require('../utils/nodemailer');
const fs = require('fs');
const pdf = require('html-pdf');

exports.carbonEmissionReport=catchAsyncError(async(req,res,next)=>{
    const { country,
            daysOfUse,
            hoursOfUse,
            lampTypes,
            annualEmission,
            ROI,
            costOfUpgradation,
            carbonSavingPotential}=req.body;


    const user = await User.findOne({email:"210008001@hbtu.ac.in"});

    if(!user){
        return next(new ErrorHandler("User does not exists",404));
    }


    const addReport= await carbonEmission.create({
        ROI:ROI,
        User:user._id,
        country:country,
        daysOfUse:daysOfUse,
        hoursOfUse:hoursOfUse,
        lampTypes:[...lampTypes],
        annualEmission:annualEmission,
        costOfUpgradation:costOfUpgradation,
        carbonSavingPotential:carbonSavingPotential
    });

    // const report=await carbonEmission.findOne({User:user._id,date:{$gt:new Date(new Date().getTime()-0.1*60*60*1000)}});
    
    // if(!report){
    //     return next(new ErrorHandler("someting wrong",404));
    // }

    const message = `Download the below attachment`;

    let htmlContent = `
    <html>
        <head>
        <title>HTML to PDF</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            }
            h1 {
            color: #007bff;
            }
        </style>
        </head>
        <body>
        <h1>Hello, Your Carbon Emission is!</h1>
        <p>{carbonEmission}</p>
        </body>
    </html>
    `;

    htmlContent = htmlContent.replace('{carbonEmission}', annualEmission);

    const pdfOptions = { format: 'A4' };


    try {
        const generatePdfPromise = () => {
            return new Promise((resolve, reject) => {
                pdf.create(htmlContent, pdfOptions).toFile('./CarbonReport.pdf', (err, res) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(res);
                }
              });
            });
          };
       
         await generatePdfPromise()


        await sendEmail({

            email:user.email,
            subject:"Carbon Calculator",
            message,
            attachments: [
                {
                  filename: 'CarbonReport.pdf',
                  path: 'C:/Users/Abhishek Rai/Documents/web_development/Kaash_backend/CarbonReport.pdf',
                  contentType: 'application/pdf',
                },
              ],

        });
        //fs.unlinkSync('./CarbonReport.pdf');
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        return next(new ErrorHandler(error.message,500));
    }
});