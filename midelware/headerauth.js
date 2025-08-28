const jwt =require('jsonwebtoken');

exports. headerauth=async (req,res,next)=>{
    const  header=req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if(token === null || token===""){
         return res.status(403).json({msg:"Unauthorized",err:""});
    }
    try {
        jwt.verify(token,process.env.SECRET_KEY,(err,result)=>{
            if(err){
            return res.status(403).json({msg:"Unauthorized",err:err.message});
            }      
        next();
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"hi there ",err:""})
    }
};