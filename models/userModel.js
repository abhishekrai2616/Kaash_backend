const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("please provide legitimate email");
            }
        }
    },
    otp:{
        type:String
    },
    expiresIn:{
        type:Date
    }

})

userSchema.methods.createOTP=async function(){
    const OTP = Math.floor(1000 + Math.random() * 9000);

    this.otp = OTP;
    this.expiresIn = Date.now() + 5*60*1000;

    return OTP;
}


const User=mongoose.model("User",userSchema);

module.exports=User;