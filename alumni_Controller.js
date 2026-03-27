const asyncHandler=require("express-async-handler");
const alumni=require("../model/alumniModel");
const get_all_alumni=asyncHandler(async (req, res) => {
  const alumniData = await alumni.find();
  res.json(alumniData);
});
const get_alumni=asyncHandler(async(req,res)=>{
    const alumniData = await alumni.findOne({
        _id: req.params.id,
        user_id: req.user.id
    });

    if(!alumniData){
        res.status(404);
        throw new Error("Alumni not found!");
    }
    res.status(200).json(alumniData);
});

const add_alumni=asyncHandler(async(req,res)=>{
    console.log("the request body is:",req.body);
    const{name,
        image,
        profession,
        roll,
        email,
        phone,
        currentLocation,
        hometown,
        company,
        workSector,
        university,
        department,
        batch,
        school,
        college,
        bloodGroup,
        parentsName,
        interests,
        bio,
        linkedin,
        github,
        facebook,} =req.body;
    if(!name || !email || !batch || !department || !profession || !company){
        res.status(400);
        throw new Error("all fields are mandatory!");
    }
    const alumniData=await alumni.create({
    user_id:req.user.id,
    name,
        image,
        profession,
        roll,
        email,
        phone,
        currentLocation,
        hometown,
        company,
        workSector,
        university,
        department,
        batch,
        school,
        college,
        bloodGroup,
        parentsName,
        interests,
        bio,
        linkedin,
        github,
        facebook,});
    res.status(201).json(alumniData);
});

module.exports={get_alumni,add_alumni,get_all_alumni};