const jwt=require("jsonwebtoken");
const dotenv=require('dotenv');
dotenv.config();
exports.auth =  (req,res,next)=>{
    const refreshtoken = req.session.userId;
    
    if(refreshtoken === null||refreshtoken===""){
         return (false)
    }
    try {
        jwt.verify(refreshtoken,process.env.REFRESH_SECRET_KEY,(err,result)=>{
            if(err){  return false;   } 
        req.user =result.result;
        return (true);     
        });
    } catch (error) {
        console.log(error);
        return false;
    }
}

  
