const mongoose=require("mongoose");

const connectDatabase=function(){ mongoose.connect(process.env.MONGO_URL).then(res => {
    console.log("connected succesfully")
    }).catch(err => {
    console.log(err);
    });}
    //default export
    module.exports=connectDatabase;