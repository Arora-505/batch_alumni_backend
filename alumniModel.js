const mongoose=require("mongoose");
const alumniSchema=mongoose.Schema({
    user_id:{
              type:mongoose.Schema.Types.ObjectId,
              required:true,
              ref:"User",
    },
    name:{
        type:String,
        required:[true,"Add the name"],
    },
    image:{
        type:String,
        required:[true,"Add the photo"],
    },
    profession:{
       type:String,
        required:[true,"Add the profession"],
     },
     roll:{
        type:String,
        required:[true,"Add the roll"],
    },
    email:{
        type:String,
        required:[true,"Add the email address"],
        unique: true,
    },
    phone:{
        type:String,
        required:[true,"Add the contact"],
    },
    currentLocation:{
        type:String,
        required:[true,"Add the location"],
    },
    hometown:{
        type:String,
        required:[true,"Add the place"],
    },
    company:{
    type:String,
    required:[true,"Add the company name"],
    },
   workSector:{
        type:String,
        required:[true,"Add the work place name"],
    },
    university:{
        type:String,
        required:[true,"Add the university"],
    },
    department:{
        type:String,
         required:[true,"Add the department"],
     },
  
    batch:{
         type:String,
          required:[true,"Add the batch"],
      },
      school:{
        type:String,
        required:[true,"Add the school"],
    },
    college:{
        type:String,
        required:[true,"Add the college"],
    },
     bloodgrp:{
        type:String,
        required:[true,"Add the grp"],
    },
    parentsname:{
        type:String,
        required:[true,"Add the guardian_name"],
    },
    interests:{
        type:[String],
        required:[true,"Add the interests"],
    },
    shortbio:{
        type:String,
        required:[true,"Add the description"],
    },
    linkedln:{
        type:String,
        required:[true,"Add the linkedlnId"],
    },
    github:{
        type:String,
        required:[true,"Add the githubacc"],
    },
    facebook:{
        type:String,
        required:[true,"Add the fbId"],
    },
  
    },
{
    timestamps:true,
}
);
module.exports=mongoose.model("Alumni",alumniSchema);