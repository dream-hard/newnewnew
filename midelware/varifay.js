const express = require('express')
const User=require('../models/_User');
const { auth } = require('./auth');
const { Op } = require('sequelize');
const jwt=require("jsonwebtoken");
require('dotenv').config();

exports.varifay= async (req,res,next)=> {
    const retoken = req.cookies.refresh_token;
    if(!retoken || retoken===""){ return res.status(400).json({error:"not loged in",msg:"not loged in"});}
    try {
        let valid=true;
        jwt.verify(retoken,process.env.REFRESH_SECRET_KEY,(err,result)=>{
             if(err){ 
                valid=false; 
            }
            req.user=result.result;
        });
        if(valid)  {     
                const response= await User.findByPk(req.user.id);
                if(!response) return(()=>{{ return res.status(400).json({error:"this acount was not found please try again",msg:""});}});
                next();
        }
        else{
            res.clearCookie('refresh_token', { path: '/' });
            return res.status(400).json({error:"your LOGIN has expired  please RE LOGIN",msg:""});
        }
    } catch (error) {
        return res.status(500).json({error:error,msg:""});
    }
}