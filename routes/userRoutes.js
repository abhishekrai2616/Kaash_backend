const express=require('express');
const {generateOTP,verifyOTP}=require('../controllers/userControllers');
const router=express.Router();

router.route("/generateOTP").post(generateOTP);
router.route("/verifyOTP").get(verifyOTP);

module.exports=router;
