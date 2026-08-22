import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
  
export const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt

        if(!token) {
            return res.status(401).json({message:"Unauthorized - No Token Provided"});
        }

        const  decoded = jwt.verify(token,process.env.JWT_SECRET)
        
        if(!decoded) {
            return res.status(401).json({message:"Unauthorized - Invalid Token"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not foundd"});
        }
        req.user= user
        next();

    }catch(error){
    console.log("Error in protectRoute middleware:",error.message);

    // A JWT verification error is an authentication failure. Database errors
    // (for example a transient Atlas DNS failure) happen after verification and
    // must not be reported to the client as an invalid token.
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(401).json({message:"Unauthorized - Invalid or expired token"});
    }

    return res.status(503).json({
        message: "Authentication service temporarily unavailable. Please retry.",
    });
    }
    
};
