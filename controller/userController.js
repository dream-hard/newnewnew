const User = require('../models/_User');

const {Op, Sequelize, where} = require("sequelize");

const jwt=require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt=require("bcryptjs");



exports.create = async (req, res) => {
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
        if ((!email || email.trim() === '') && (!phoneNumber || phoneNumber.trim() === '')) {
          return res.status(400).json({ msg: 'Please send email or phoneNumber' });
        }
        if (!password || password.trim() === '') {
          return res.status(400).json({ msg: 'Password is required' });
        }
        let user;
        if(email && email.trim().length > 0) {
           user= await User.findOne({where:{email:email}});
        }else{ 
            user= await User.findOne({where:{phone_number:phoneNumber}});
        }
        if(!user) return res.status(404).json({msg:"User was not found",err:"invalid  email or phone number"});
        const vaildpass= await bcrypt.compareSync(password,user.passwordhash);
        if(!vaildpass) return res.status(401).json({msg:"not vaild password",err:""});
        user.role=await Role.findByPk(user.role_id);
        const tokenPayload={phoneNumber:user.phone_number,role:user.role,id:user.uuid,name:user.name};
        const accessToken =genratauth(tokenPayload);
        const refreshToken=genratreauth(tokenPayload);
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd, // only over HTTPS
        sameSite: "Strict", // or 'Lax' depending on your flow
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days,
        path:'/'
      });

      return  res.status(200).json({authtoken:accessToken ,msg:"Login successful"});
    }catch (error) {
      return  res.status(500).json({msg:"something went wrong",error:error.message});
    }
}



exports.iflogin=async(req,res,next)=>{
        const newtoken=genratauth(req.user)
        return  res.status(200).json({authtoken:newtoken});
};

exports.logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: isProd, 
      sameSite: "Lax", 
      path: '/'// or "Strict" / "None" based on your setup
    });
    return res.status(200).json({ msg: "تم تسجيل الخروج بنجاح" });
  } catch (error) {
    return res.status(500).json({ msg: "حدث خطأ غير متوقع", err: error.message });
  }
};


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

exports.refresh=async(req,res,next)=>{

    const refreshtoken=req.cookies?.refresh_token;  
    if(refreshtoken===null|| refreshtoken===""||refreshtoken===undefined) return res.status(400).json({msg:"not logedin",error:"please login"});
    

    jwt.verify(refreshtoken,process.env.REFRESH_SECRET_KEY,(err,result)=>{
        if(err)  return res.status(406).json({ message: 'Unauthorized',error:err.message });

        const token=genratauth(result.result);
        
        return res.status(200).json({authtoken:token});
    });

}

function genratauth(result){
    return jwt.sign({result:result},process.env.SECRET_KEY,{expiresIn:process.env.ACCESS_EXPIRES});
}
function genratreauth(result){
    return jwt.sign({result:result},process.env.REFRESH_SECRET_KEY,{expiresIn:process.env.REFRESH_EXPIRES});
}
  

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