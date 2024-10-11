//middleware for handeling user request & responses 


const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;


function adminMiddleware(req,res,next){ // implementing auth middleware for the user
    const token = req.headers.token ; //extracting token from the headers
    const decodedInfo = jwt.verify(token,JWT_SECRET);
  

   if(decodedInfo && decodedInfo.role=='admin'){
    req.adminId = decodedInfo.id;
    next();
   }


   else{
    return res.status(404).json({
        message : "Token invalid or you are not signed in"
    }) 

   }
}


module.exports = {
    adminMiddleware
}