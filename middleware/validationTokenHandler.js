const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const validateToken=asyncHandler(async(req,res,next)=>{
    let token = req.cookies?.token; 

    if (!token) {
          res.status(401);
             throw new Error("No token provided in cookies");}
            try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
             if (!decoded){
            res.status(401);
            throw new Error("Invalid token")}
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401);
            throw new Error("User is not authorized");
        }
});

module.exports = validateToken;