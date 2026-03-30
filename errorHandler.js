const constant=require("../constants");
const errorHandler=(err,req,res,next)=>{
    const status= res.statusCode && res.statusCode !== 200?res.statusCode:500;
  switch (status) {
    case constant.VALIDATION_ERROR:
        res.status(status).json({title:"validation failed",message:err.message,stackTrace:err.stack});
        break;
    case constant.NOT_FOUND:
        res.status(status).json({title:"not found",message:err.message,stackTrace:err.stack});
        break;
    case constant.UNAUTHORIZED:
           res.status(status).json({title:"unauthorised",message:err.message,stackTrace:err.stack});
        break;
    case constant.FORBIDDEN:
        res.status(status).json({title:"forbidden",message:err.message,stackTrace:err.stack});
        break;
    case  constant.SERVER_ERROR:
        res.status(status).json({title:"server error",message:err.message,stackTrace:err.stack});
        break;
    default:
        res.status(500).json({
        title: "Unknown error",
        message: err.message
    });
        break;
  }
};
module.exports=errorHandler;