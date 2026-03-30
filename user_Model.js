const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Add the user name"],
    },
    email:{
        type:String,
        required:[true,"Add the  user email address"],
        unique:[true,"Email address already taken"]
    },
    password:{
        type:String,
        required:[true,"Add the user password"],
    },

},{
    timestamps:true,
});
module.exports=mongoose.model("User",userSchema);