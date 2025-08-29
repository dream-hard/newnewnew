const express = require('express')
const User=require('../models/_User');
const { auth } = require('./auth');
const { Op } = require('sequelize');
const jwt=require("jsonwebtoken");
require('dotenv').config();

exports.varifay= async (req,res,next)=> {
    
  const retoken = req.cookies.refresh_token;

    console.log(retoken)
    if(!retoken || retoken===""){ return res.status(400).json({msg:"not loged in",err:""});}
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
                if(!response) return(()=>{{ return res.status(400).json({err});}});
                next();
        }
        else{
        return res.status(406).json({msg:"Unauthreized",err:""});
        }
    } catch (error) {
        console.log(error);
        return res.status(406).json({msg:"Unauthreized",err:""});
    }
}