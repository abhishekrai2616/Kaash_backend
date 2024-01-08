const express=require('express');
const {carbonEmissionReport}=require('../controllers/carbonEmissionController');
const router=express.Router();

router.route("/carbonEmissionReport").post(carbonEmissionReport);

module.exports=router;