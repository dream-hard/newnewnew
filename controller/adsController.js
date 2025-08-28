const { Ads } = require("../models");
const orderMapAds = {
  "id-asc": [["id", "ASC"]],
  "id-desc": [["id", "DESC"]],
  "name-asc": [["name", "ASC"]],
  "name-desc": [["name", "DESC"]],
  "title-asc": [["title", "ASC"]],
  "title-desc": [["title", "DESC"]],
  "isvalid-asc": [["isvalid", "ASC"]],
  "isvalid-desc": [["isvalid", "DESC"]],
  "created-asc": [["createdAt", "ASC"]],
  "created-desc": [["createdAt", "DESC"]],
  "updated-asc": [["updatedAt", "ASC"]],
  "updated-desc": [["updatedAt", "DESC"]],
};
const deleteFile = (filename) => {
  if (!filename) return;
  const filepath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};


exports.create=async (req,res)=>{
    try {
        const {path,valid,photopath,name,title}=req.body;

        const create= await Ads.create({
            link_path:path,
            photo_path:photopath,
            name,
            title,
            isvalid:valid

        });

        res.status(200).json(create);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
}


exports.getall=async (req,res)=>{
    try {
    const ads=await Ads.findAll();
    res.status(200).json(ads);  
        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


exports.getbyid=async (req,res)=>{
    try {
        const {id}=req.body;
        const ads=await Ads.findByPk(id);
        if(!ads)return res.status(404).json(ads);
        res.status(200).json(ads);


    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
exports.update=async (req,res)=>{
    try {
        const{id}=req.body;
        const old=await Ads.findByPk(id);
        if(!old)return res.status(404).json({error:"Not Found"});
        let {linkpaht,photopath,title,name,isvalid }=req.body;
        if(!linkpaht)linkpaht=old.link_path;
        if(!photopath)photopath=old.photo_path;
        if(!title)title=old.title;
        if(!name)name=old.name;
        if(isvalid===null||isvalid===undefined)isvalid=old.isvalid;


        const [updated]=await Ads.update({
            link_path:linkpaht,
            photo_path:photopath,
            title,
            name,
            isvalid
        },{where:{id:id}});

        
        if(!updated)return res.status(404).json({error:"NOt FOUND"});
        const updatedad=await Ads.findByPk(id);
        res.status(200).json(updatedad);

        
        

        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


exports.delete=async (req,res)=>{
    try {
        const {id}=req.body;
        const deleted=await Ads.destroy({where:{id:id}})
        if (!deleted) return res.status(404).json({ error: "Not found" });

        res.json({ message: "Deleted successfully" });
    
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}


exports.softdelete=async (req,res)=>{
    try {
        const {id}=req.body;
        const isvalid=0;
        const [ad]=await Ads.update({isvalid},{where:{id:id}});
        if(!ad)return res.status(404).json({error:"NOT FOUND"});
        res.json({ msg: "Deleted successfully",succes:true });
    } catch (error) {
                res.status(500).json({error:error.message});
    }
}
exports.getAds = async (req, res) => {
  try {
    let { page = 1, limit = 10, order } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const orderBy = orderMapAds[order] || [["createdAt", "DESC"]];
    const {count,rows} = await Address.findAndCountAll({limit,offset,order});
    if(!count ||!rows)return res.status(404).json({error:"the ads was not found"});
    res.status(200).json({   
      succes:true,
      ads:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching Ads" });
  }
};
exports.filterAds=async(req,res)=>{
    try {
    let { page = 1, limit = 10, order,id,name,title,link_path,photo_path,isvalid } = req.query;
    let where={};
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const orderBy = orderMapAds[order] || [["createdAt", "DESC"]];
    if(id)where.id=id;
    if(name)where.name=name;
    if(title)where.title=title;
    if(link_path)where.link_path=link_path;
    if(photo_path)where.photo_path=photo_path;
    if(isvalid!==null || isvalid!==undefined)where.isvalid=isvalid;
    const {count,rows} = await Address.findAndCountAll({where,limit,offset,order});  
    if(!count ||!rows)return res.status(404).json({error:"the ads was not found"});
    res.status(200).json({   
      succes:true,
      ads:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
    } catch (error) {
    res.status(500).json({ message: "Error fetching Ads" });   
    }
}
exports.searchinAds=async(req,res)=>{
    try {
    let { page = 1, limit = 10, order,id,name,title,link_path,photo_path,isvalid } = req.query;
    let where={};
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const orderBy = orderMapAds[order] || [["createdAt", "DESC"]];
    if(id)where.id={[Op.like]:`%${id}%`};
    if(name)where.name={[Op.like]:`%${name}%`};
    if(title)where.title={[Op.like]:`%${title}%`};
    if(link_path)where.link_path={[Op.like]:`%${link_path}%`};
    if(photo_path)where.photo_path={[Op.like]:`%${photo_path}%`};
    if(isvalid!==null || isvalid!==undefined)where.isvalid=isvalid;
    const {count,rows} = await Address.findAndCountAll({where,limit,offset,order});  
    if(!count ||!rows)return res.status(404).json({error:"the ads was not found"});
    res.status(200).json({   
      succes:true,
      ads:rows
      ,total:Array.isArray(count) ? count.length : count
      ,currentPage:Number(page)
      ,totalPages:Math.ceil((Array.isArray(count) ? count.length : count) / limit)});
    } catch (error) {
    res.status(500).json({ message: "Error fetching Ads" });   
    }
}
exports.getAd = async (req, res) => {
  try {
    const { id } = req.body;
    const ad = await Ads.findByPk(id,{raw:true});
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json({ads:ad,succes:true,msg:"the ad was found successfully"});
  } catch (err) {
    res.status(500).json({error: "Error fetching Ad" });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.body;
    const ad = await Ads.findByPk(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    deleteFile(ad.photo_path);
    await ad.destroy();
    res.status(201).json({succes:true, msg: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting Ad" });
  }
};
exports.updateAd = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, title, link_path,photo_path, isvalid } = req.body;
    const ad = await Ads.findByPk(id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (req.files && req.files.length > 0) {
      deleteFile(ad.photo_path); // delete old file
      ad.photo_path = req.files[0].filename;
    }

    ad.name = name ?? ad.name;
    ad.title = title ?? ad.title;
    ad.link_path = link_path ?? ad.link_path;
    ad.isvalid = isvalid ?? ad.isvalid;
    await ad.save();
    res.status(201).json({ads:ad,succes:true,msg:"the ad was found successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating Ad" });
  }
};
exports.addAd = async (req, res) => {
  try {
    const { name, title, link_path, isvalid=false } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Photo is required" });
    }
    if(!name || !title )return res.status(404).json({error:"you should send the name and title for the ad",msg:""})
    const photo_path = req.files[0].filename;
    const ad = await Ads.create({
      name,
      title,
      link_path,
      isvalid,
      photo_path,
    });
    res.status(201).json({ads:ad,succes:true,msg:'the ad was added successfully'});
  } catch (err) {
    res.status(500).json({ message: "Error creating Ad" });
  }
};