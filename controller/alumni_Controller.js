const asyncHandler=require("express-async-handler");
const alumni=require("../model/alumniModel");
const get_all_alumni = asyncHandler(async (req, res) => {
  const { name, city, series, department, job, search, page, limit } = req.query;
  let filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (city) filter.city = { $regex: city, $options: "i" };
  if (series) filter.series = series;
  if (department) filter.department = { $regex: department, $options: "i" };
  if (job) filter.job = { $regex: job, $options: "i" };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { job: { $regex: search, $options: "i" } },
      { series: { $regex: search, $options: "i" } },
    ];
  }


  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  const total = await alumni.countDocuments(filter); 
  const alumniData = await alumni
    .find(filter)
    .skip(skip)
    .limit(pageSize)
    .sort({ name: 1 });

  res.json({
    page: pageNumber,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    data: alumniData,
  });
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
    const{name,
        image,
        profession,
        roll,
        email,
        phone,
        city,
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
        city,
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
        facebook});
        
    res.status(201).json(alumniData);
});

module.exports={get_alumni,add_alumni,get_all_alumni};