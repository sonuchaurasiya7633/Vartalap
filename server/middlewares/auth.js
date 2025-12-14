const jwt = require("jsonwebtoken");

exports.checkAuth = async(req,res,next)=>{

    try {
        
        const token = req.headers.authorization;        
       if(!token || !token.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Token is missing or malformed"
            })
        }

        const actualToken = token.split(" ")[1];
        
        const decoded = jwt.verify(actualToken,process.env.JWT_SECRATE);
        req.user = decoded;
        next();
        
    } catch (error) {
       console.log(error);
       return res.status(401).json({
        success:false,
        message:"Invalid or expired token",
       })
        
    }

}