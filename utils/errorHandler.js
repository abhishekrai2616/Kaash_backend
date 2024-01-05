class ErrorHandler extends Error{
    constructor(massege,statusCode){
        super(massege);
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor);
        
    }
}

module.exports=ErrorHandler;