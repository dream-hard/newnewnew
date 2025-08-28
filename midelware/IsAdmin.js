const express=require("express");
const jwt=require("jsonwebtoken")
const { Op } = require("sequelize");
const { auth } = require("./auth");
const { User } = require("../models");
exports.adminanduponly= async (req,res,next)=>{
    try {
        // if(!auth(req))//////****** important please see this ******
        //     return res.status(406).json({msg:"Unauthorized",err:"token mustn't be null"});
        const response=await User.findByPk(req.user.id,{attributes:["role_id"]});
        if(!response) return res.status(404).json({msg:'user was not found',err:""})
        if(response.role_id!=='super_admin'||response.role_id!=='admin'||response.role_id!=='Owner') return res.status(405).json({msg:'you are not allowed to use this',err:""})
            next();
    } catch (error) {
        return res.status(500).json({msg:"something went wrong",err:error.message});
    }
}