const mongoose=require('mongoose');

const lampTypeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    wattage: { type: Number, required: true }
  });

const carbonEmissionSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    country:{
        type:String,
    },
    hoursOfUse:{
        type:Number
    },
    daysOfUse:{
        type:Number
    },
    date:{
        type:Date,
        default:new Date 
    },
    lampTypes:[
        {type:lampTypeSchema}
    ],
    annualEmission:{
        type:Number
    },
    carbonSavingPotential:{
        type:Number,
        min:0,
        max:100
    },
    costOfUpgradation:{
        type:Number
    },
    ROI:{
        type:Number
    }
});



const carbonEmission=mongoose.model("carbonEmission",carbonEmissionSchema);

module.exports=carbonEmission;