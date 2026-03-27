const express=require("express");
const {register_User,login_User,}=require("../controller/user_Controller");
const router=express.Router();
router.post("/register",register_User);
router.post("/login",login_User);

module.exports=router;