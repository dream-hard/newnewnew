const User = require('../models/_User');

const {Op, Sequelize, where} = require("sequelize");

const jwt=require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt=require("bcryptjs");



exports.create = async (req, res) => {
  console.log(req.body)
  try {
    let {username,email,bio,profile_pic}=req.body;
    const {name ,phoneNumber,password,role_id,status_id}=req.body;
   if((username===undefined||username===null)||(username==='')){
      username=name;
    }
        
    const hashpassword= bcrypt.hashSync(password,7);


    const user = await User.create(
      {
        name,
        username,
        email,
        bio,
        profile_pic,
        phone_number:phoneNumber,
        passwordhash:hashpassword,
        role_id:role_id,
        status_id:status_id
      }
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByUuid = async (req, res) => {
  try {
    const {id}=req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const {id}=req.body;
    let {name ,username,phoneNumber,bio,email,password,role_id,status_id,profile_pic}=req.body;
    let hashpassword;
    const user= await User.findByPk(id);
    if(!user)return res.status(404).json({err:"not found"});
    if(!name)name=user.name;
    if(!username)username=user.username;
    if(!phoneNumber)phoneNumber=user.phone_number;
    if(!bio)bio=user.bio;
    if(!email)email=user.email;
    if(!password){hashpassword=user.passwordhash}else{hashpassword=bcrypt.hashSync(password,7)}
    if(!role_id)role_id=user.role_id;
    if(!status_id)role_id=user.status_id;
    if(!profile_pic)profile_pic=user.profile_pic;


    const [updated] = await User.update(
      {
        name,
        username,
        email,
        bio,
        profile_pic,
        phone_number:phoneNumber,
        passwordhash:hashpassword,
        role_id,
        status_id
      }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateuuid=async (req,res)=>{
  try {
       const {id}=req.body;
    let {name,id_edit ,username,phoneNumber,bio,email,password,role_id,status_id,profile_pic}=req.body;
    let hashpassword;

    const user= await User.findByPk(id);
    if(!user)return res.status(404).json({err:"not found"});
    if(!name)name=user.name;
    if(!username)username=user.username;
    if(!phoneNumber)phoneNumber=user.phone_number;
    if(!bio)bio=user.bio;
    if(!email)email=user.email;
    if(!password){hashpassword=user.passwordhash}else{hashpassword=bcrypt.hashSync(password,7)}
    if(!role_id)role_id=user.role_id;
    if(!status_id)role_id=user.status_id;
    if(!profile_pic)profile_pic=user.profile_pic;
    if(!id_edit)id_edit=id;

    const [updated] = await User.update(
      {
        uuid:id_edit,
        name,
        username,
        email,
        bio,
        profile_pic,
        phone_number:phoneNumber,
        passwordhash:hashpassword,
        role_id,
        status_id
      }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedUser = await User.findByPk(id_edit);
    res.json(updatedUser);
  } catch (error) {
        res.status(400).json({ error: error.message });
  }
}
exports.updatewithoutuuid=async (req,res)=>{
  try {
       const {id}=req.body;
    let {name,id_edit ,username,phoneNumber,bio,email,password,role_id,status_id,profile_pic}=req.body;
    let hashpassword;
    if(!id_edit)id_edit=id;

    const attached_products=await Product.update({
      user_id:"not connected"
    },
      {where:{user_id:id,}});

    const attached_orders=await Order.update({
      user_id:"not connected"
    },
      {where:{user_id:id,}});

    const user= await User.findByPk(id);
    if(!user)return res.status(404).json({err:"not found"});
    if(!name)name=user.name;
    if(!username)username=user.username;
    if(!phoneNumber)phoneNumber=user.phone_number;
    if(!bio)bio=user.bio;
    if(!email)email=user.email;
    if(!password){hashpassword=user.passwordhash}else{hashpassword=bcrypt.hashSync(password,7)}
    if(!role_id)role_id=user.role_id;
    if(!status_id)role_id=user.status_id;
    if(!profile_pic)profile_pic=user.profile_pic;

    const [updated] = await User.update(
      {
        uuid:id_edit,
        name,
        username,
        email,
        bio,
        profile_pic,
        phone_number:phoneNumber,
        passwordhash:hashpassword,
        role_id,
        status_id
      }, {
      where: { uuid: id },
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    const updatedUser = await User.findByPk(id_edit);
    res.json(updatedUser);
  } catch (error) {
        res.status(400).json({ error: error.message });
  }
}
exports.delete = async (req, res) => {
  try {
    const {id}=req.body;
    const deleted = await User.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletewithoutuuid = async (req, res) => {
  try {
    const {id}=req.body;

    const attached_products=await Product.update({
      user_id:"not connected"
    },
      {where:{user_id:id,}});

    const attached_orders=await Order.update({
      user_id:"not connected"
    },
      {where:{user_id:id,}});

    
    const deleted = await User.destroy({ where: { uuid: id } });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};









const Product = require('../models/_products');
const Order = require('../models/_orders');
const { Role } = require('../models');
dotenv.config();

exports.login= async (req,res)=>{
    try {

        const {phoneNumber,email,password}=req.body;
        console.log(req.body)
        let user;
        if(email || phoneNumber){
          if(email && email.lenght!==0){
             user= await User.findOne({
              where:{
                  email:email       
                  }
              });
          }else{ 
               user= await User.findOne({
              where:{
                  phone_number:phoneNumber       
                  }
              });
            
          }
          
        }else{
          return res.status(404).json({err:"please retry",msg:"please send email or phone number"})
        }
       
        if(!user) return res.status(404).json({msg:"User was not found",err:"invalid  email or phone number"});

        const vaildpass=bcrypt.compareSync(password,user.passwordhash);
        console.log(vaildpass);
        if(!vaildpass) return res.status(401).json({msg:"not vaild password",err:""});
            
        user.role=await Role.findByPk(user.role_id);

        const for_token={phoneNumber:user.phone_number,role:user.role,id:user.uuid,name:user.name};
        const token=genratauth(for_token);
        const retoken=genratreauth(for_token);

    res.cookie("refresh_token", retoken, {
    httpOnly: true,
    secure: false, // only over HTTPS
    sameSite: "Strict", // or 'Lax' depending on your flow
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

      return  res.status(200).json({authtoken:token,msg:"login succes"});
    }catch (error) {
      return  res.status(500).json({msg:"something went wrong",err:error.message});
    }
}



///////////////////////////////////////////////////////////////////////////////////////
exports.iflogin=async(req,res,next)=>{
        const newtoken=jwt.sign({email:req.user.email,id:req.user.id,hashpassword:req.user.hashpassword},process.env.SECRET_KEY,{expiresIn:"5s"});
          return  res.status(200).json({authtoken:newtoken});
    
};



///////////////////////////////////////////////////////////////////////////////////////

exports.logout = async (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false, // Change to true in production (with HTTPS)
      sameSite: "Lax", // or "Strict" / "None" based on your setup
    });

    return res.status(200).json({ msg: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    return res.status(500).json({ msg: "حدث خطأ غير متوقع", err: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////
exports.Me= async (req,res,next)=>{
    try {
        const user =await User.findByPk(req.user.id,{
        // attributes:['role_id','status_id','name','email','phone_number','Profile_pic','bio','CreatedAt','username','name']
        });
        if(!user)return res.status(404).json({msg:"not found user",err:""})
        res.status(200).json(user);
    } catch (error) {
       return res.status(500).json({msg:"something went wrong",err:error.message})
    }
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
exports.refresh=async(req,res,next)=>{

    const refreshtoken=req.cookies.refresh_token;  
    if(refreshtoken===null|| refreshtoken==="") return res.status(400).json({msg:"not loged in",err:"please login"});
    
    jwt.verify(refreshtoken,process.env.REFRESH_SECRET_KEY,(err,result)=>{
        if(err)  return res.status(406).json({ message: 'Unauthorized',err:err.message });

        const token=genratauth(result.result);
        
        return res.status(200).json({authtoken:token});
    });

}

function genratauth(result){
    return jwt.sign({result:result},process.env.SECRET_KEY,{expiresIn:'7d'});
}
function genratreauth(result){

    return jwt.sign({result:result},process.env.REFRESH_SECRET_KEY,{expiresIn:"1500s"});
}
  

// function auth (req){// it can be changed into the midelware headerauth.js


//     const authH=req.headers['authorization']
//     const token = authH && authH.split(' ')[1];
//     if(token === null){
//          return res.sendStatus(401).json({msg:"mustn't be null"});
//     }
//     jwt.verify(token,process.env.SECRET_KEY,(err,result)=>{
//         if(err){
//         return res.status(403).json({msg:"not valid jwt",err:err});
//         } 
//     req.user ={result:result.result};
//     return;     
//     });
// }

exports.singup= async (req,res)=>{

  try {


    let{bio ,username,profile_pic,email}=req.body;
    const {phoneNumber,name,password}=req.body;
    
    


    if((password===""||password===undefined)||password===null)
      return res.status(400).json({err:"The Password Was Not Found"})
  if((phoneNumber===""||phoneNumber===undefined)||phoneNumber===null)
      return res.status(400).json({err:"The PhoneNumber Was Not Found"})
  if((name===""||name===undefined)||name===null)
      return res.status(400).json({err:"The Name Was Not Found"})
  
  
  
  if(!username)username=name;
  if(!bio)bio=`Hello I am ${username}`

  const hashpassword=bcrypt.hashSync(password,7);

  const role_id="general_user";
  const status_id="pending";
  if(email==="")email=null;

const existingUser = await User.findOne({ where: { phone_number: phoneNumber } });

if (existingUser) {
    if (existingUser.role_id==="geust_user") {
        // This is a guest → upgrade it to a real account
        await existingUser.update({
            name:name,
            username: username,
            passwordhash: hashpassword,
            bio,
            email:email,
            profile_pic,
            role_id,
            status_id
          });
        // optionally send welcome email / token
        return res.json({ success: true, message: "Guest upgraded to full account" });
    } else {
      
        // Phone already exists for real user
        return res.status(400).json({ error: "Phone number already registered" });
    }
} else {

  const singup_user=await User.create({
    name,
    username,
    passwordhash:hashpassword,
    bio,
    email:email,
    phone_number:phoneNumber,
    profile_pic,
    role_id,
    status_id
}
  )
  if(!singup_user)return res.status(401).json({err:"not succeceded singup please try again"})
  res.status(201).json(singup_user);
}
  } catch (error) {
              console.log(error);

    res.status(500).json({error:error.message});
  }
}
  
exports.adminsingup= async (req,res)=>{
  try {
    let{bio ,username,profile_pic}=req.body;
    const {phoneNumber,name,password,role_id,status_id}=req.body;
    if((password===""||password===undefined)||password===null)
      return res.status(400).json({err:"The Password Was Not Found"})
  if((phoneNumber===""||phoneNumber===undefined)||phoneNumber===null)
      return res.status(400).json({err:"The PhoneNumber Was Not Found"})
  if((name===""||name===undefined)||name===null)
      return res.status(400).json({err:"The Name Was Not Found"})
  if(!username)username=name;
  if(!bio)bio=`Hello I am ${username}`

  const hashpassword=bcrypt.hashSync(password,7);

 
  const singup_user=await User.create({
    name,
    username,
    passwordhash:hashpassword,
    bio,
    phone_number:phoneNumber,
    profile_pic,
    role_id,
    status_id
}
  )
  if(!singup_user)return res.status(401).json({err:"not succeceded singup please try again"})
  res.status(201).json(singup_user);

  } catch (error) {
    res.status(500).json({error:error.message});
  }
}
  
  
exports.justgetall=async(req,res)=>{
  try {
    const users=await User.findAll({attributes:["uuid","name","role_id","phone_number"],raw:true });

    res.status(200).json (users);
  } catch (error) {
     res.status(500).json({ error: error.message });

  }
}