const express=require('express')
const bodyParser =require('body-parser');
const app=express();
const errorMiddleware=require('./middlewares/error');

const User=require("./routes/userRoutes");


app.use(express.json({limit:'50mb'}));//with app.use it is going to be global to our entire application(middleware)
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(errorMiddleware);
app.use("/User",User);



module.exports=app;